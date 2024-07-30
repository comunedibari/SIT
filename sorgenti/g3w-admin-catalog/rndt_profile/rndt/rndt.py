# coding=utf-8
""""RNDT Plugin for PyCSW

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

"""

__author__ = 'elpaso@itopen.it'
__date__ = '2019-02-21'
__copyright__ = 'Copyright 2019, Gis3W'


import os
import re
import copy
import logging
from io import StringIO
from lxml import etree as et, objectify
from pycsw.core import config, util
from pycsw.core.etree import etree
from pycsw.plugins.profiles import profile
from django.utils.translation import ugettext_lazy as _
from django.urls import reverse
from qdjango.models import Layer
from django.conf import settings

try:
    from urllib.parse import urlparse
except ImportError:
    from urlparse import urlparse

from catalog.rndt import service_metadata, service_metadata_xml, _add
from catalog.models import Catalog, Record
from pycsw.plugins.profiles.apiso.apiso import *


logger = logging.getLogger('catalog')

class RNDT(APISO):
    '''RNDT profile class for data metadata'''

    parser = etree.XMLParser(remove_blank_text=True)

    def __init__(self, model, namespaces, context):
        super(RNDT, self).__init__(model, namespaces, context)
        self.namespaces.update({
            'gml': 'http://www.opengis.net/gml/3.2',
            'gmx': 'http://www.isotc211.org/2005/gmx'
        })

    def _parse_str(self, text):
        return etree.parse(StringIO(text), self.parser).getroot()

    def _fix_language(self, parent_el, langcode):
        # Fix language
        lang = parent_el.find('{http://www.isotc211.org/2005/gmd}language')
        lang.remove(lang.getchildren()[0])
        et.SubElement(lang, util.nspath_eval('gmd:LanguageCode', self.namespaces), {
            'codeList': "http://www.loc.gov/standards/iso639-2",
            'codeListValue': langcode
        }).text = langcode
        return lang

    def _contact(self, org, email, phone, url, role):
        contactxml = """
        <gmd:contact xmlns:gmd="http://www.isotc211.org/2005/gmd" xmlns:gco="http://www.isotc211.org/2005/gco">
            <gmd:CI_ResponsibleParty>
            <gmd:organisationName>
                <gco:CharacterString>%s</gco:CharacterString>
            </gmd:organisationName>
            <gmd:contactInfo>
                <gmd:CI_Contact>
                <gmd:phone>
                    <gmd:CI_Telephone>
                    <gmd:voice>
                        <gco:CharacterString>%s</gco:CharacterString>
                    </gmd:voice>
                    </gmd:CI_Telephone>
                </gmd:phone>
                <gmd:address>
                    <gmd:CI_Address>
                    <gmd:electronicMailAddress>
                        <gco:CharacterString>%s</gco:CharacterString>
                    </gmd:electronicMailAddress>
                    </gmd:CI_Address>
                </gmd:address>
                <gmd:onlineResource>
                    <gmd:CI_OnlineResource>
                    <gmd:linkage>
                        <gmd:URL>%s</gmd:URL>
                    </gmd:linkage>
                    </gmd:CI_OnlineResource>
                </gmd:onlineResource>
                </gmd:CI_Contact>
            </gmd:contactInfo>
            <gmd:role>
                <gmd:CI_RoleCode
                codeList="http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/ML_gmxCodelists.xml#CI_RoleCode"
                codeListValue="%s">%s</gmd:CI_RoleCode>
            </gmd:role>
            </gmd:CI_ResponsibleParty>
        </gmd:contact>
        """ % (org, phone, email, url, role, role)
        return self._parse_str(contactxml)

    def write_record(self, result, esn, outputschema, queryables, caps=None):
        ''' Return csw:SearchResults child as lxml.etree.Element '''

        def _parse_str(text):
            parser = etree.XMLParser(remove_blank_text=True)
            return etree.parse(StringIO(text), parser).getroot()

        node = super(RNDT, self).write_record(
            result, esn, outputschema, queryables, caps)
        file_identifier = node.find(util.nspath_eval(
            'gmd:fileIdentifier', self.namespaces))

        # Fix language
        if esn in ['summary', 'full']:
            self._fix_language(node, result.language)


        # Parent identifier (flat)
        parent_identifier = et.Element(util.nspath_eval(
            'gmd:parentIdentifier', self.namespaces))
        et.SubElement(parent_identifier, util.nspath_eval(
            'gco:CharacterString', self.namespaces)).text = file_identifier.getchildren()[0].text
        node.insert(2, parent_identifier)

        characterSet = et.Element(util.nspath_eval(
            'gmd:characterSet', self.namespaces))
        et.SubElement(characterSet, util.nspath_eval('gmd:MD_CharacterSetCode', self.namespaces), {
            'codeList': "http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/gmxCodelists.xml#MD_CharacterSetCode",
            'codeListValue': "utf8"
        }).text = 'utf8'

        node.insert(2, characterSet)
        url_parts = urlparse(self.url)

        # Get record model raw
        record = Record.objects.get(pk=result.id)
        catalog = record.catalog
        parent_metadata = service_metadata_xml(catalog, "%s://%s%s" % (
            url_parts.scheme, url_parts.hostname, (':%s' % url_parts.port) if url_parts.port else ''))


        # Fix dateStamp->gco:Date - set to catalog_inspire
        node.xpath('//gmd:dateStamp/gco:Date', namespaces=self.namespaces)[0].text = str(catalog.inspire_date)

        # pointOfContact
        contact = node.findall(
            '{http://www.isotc211.org/2005/gmd}contact')[0]

        # First get it from the record
        if record.inspire_contact_organization:
            new_contact = self._contact(
                record.inspire_contact_organization,
                record.inspire_contact_email,
                record.inspire_contact_phone,
                record.inspire_contact_url,
                'pointOfContact'
                )
        else:  # from the catalog
            new_contact = self._contact(
                catalog.inspire_contact_organization,
                catalog.inspire_contact_email,
                catalog.inspire_contact_phone,
                catalog.inspire_contact_url,
                'pointOfContact'
                )

        contact.getparent().replace(contact, new_contact)
        contact = new_contact

        # Merge them
        for item in parent_metadata:
            if not node.findall(item.tag):
                node.append(copy.deepcopy(item))

        # Insert pointOfContact
        poc = etree.Element(util.nspath_eval(
            'gmd:pointOfContact', self.namespaces))
        if esn in ['summary', 'full']:
            poc.append(copy.deepcopy(contact.xpath(
                '//gmd:CI_ResponsibleParty', namespaces=node.nsmap)[0]))
            abstract = node.xpath('//gmd:abstract', namespaces=node.nsmap)[0]
            abstract.getparent().insert(abstract.getparent().index(abstract) + 1, poc)

        # Add maintenance frequency
        frequency_value = record.rndt_resource_maintenance_frequency
        frequency_text = dict(record.INPIRE_RESOURCE_MAINTENANCE_FREQUENCY)[frequency_value]
        frequency = u"""
        <gmd:resourceMaintenance xmlns:gmd="http://www.isotc211.org/2005/gmd">
        <gmd:MD_MaintenanceInformation>
          <gmd:maintenanceAndUpdateFrequency>
            <gmd:MD_MaintenanceFrequencyCode codeListValue="%s" codeList="http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/gmxCodelists.xml#MD_MaintenanceFrequencyCode">%s</gmd:MD_MaintenanceFrequencyCode>
          </gmd:maintenanceAndUpdateFrequency>
        </gmd:MD_MaintenanceInformation>
        </gmd:resourceMaintenance>""" % (frequency_value, str(frequency_text))
        poc.getparent().insert(poc.getparent().index(poc) + 1, self._parse_str(frequency))

        # Fix xs:ID
        node.find(
            '{http://www.isotc211.org/2005/gmd}identificationInfo').getchildren()[0].attrib.pop('id')

        # Add dataQualityInfo
        DQ_DataQuality = node.find(
            '{http://www.isotc211.org/2005/gmd}dataQualityInfo').getchildren()[0]

        report = et.SubElement(DQ_DataQuality, util.nspath_eval(
            'gmd:report', self.namespaces))
        DQ_AbsoluteExternalPositionalAccuracy = et.SubElement(report, util.nspath_eval(
            'gmd:DQ_AbsoluteExternalPositionalAccuracy', self.namespaces))
        result_ = et.SubElement(DQ_AbsoluteExternalPositionalAccuracy, util.nspath_eval(
            'gmd:result', self.namespaces))
        DQ_QuantitativeResult = et.SubElement(result_, util.nspath_eval(
            'gmd:DQ_QuantitativeResult', self.namespaces))
        valueUnit = et.SubElement(DQ_QuantitativeResult, util.nspath_eval(
            'gmd:valueUnit', self.namespaces))
        if esn in ['summary', 'full']:
            BaseUnit = et.SubElement(valueUnit, util.nspath_eval(
                'gml:BaseUnit', self.namespaces), {'{http://www.opengis.net/gml/3.2}id': 'm'})
            et.SubElement(BaseUnit, util.nspath_eval(
                'gml:identifier', self.namespaces), {'codeSpace': 'http://www.bipm.org/en/si/base_units'}).text = 'm'
            et.SubElement(BaseUnit, util.nspath_eval(
                'gml:unitsSystem', self.namespaces), {'{http://www.w3.org/1999/xlink}href': 'http://www.bipm.org/en/si'})



        value = et.SubElement(DQ_QuantitativeResult, util.nspath_eval(
            'gmd:value', self.namespaces))
        Record_ = et.SubElement(value, util.nspath_eval(
            'gco:Record', self.namespaces))
        et.SubElement(Record_, util.nspath_eval(
            'gco:Real', self.namespaces)).text = str(record.accuracy)

        # MD_DataIdentification: add
        # Resource constraints and extent from catalog
        MD_DataIdentification = node.find(
            '{http://www.isotc211.org/2005/gmd}identificationInfo').getchildren()[0]
        si = parent_metadata.find(
            '{http://www.isotc211.org/2005/gmd}identificationInfo').getchildren()[0]


        # Get from ctalog.rndt.py module: deprecated
        # for e in si.findall('{http://www.isotc211.org/2005/gmd}resourceConstraints'):
        #     MD_DataIdentification.append(copy.deepcopy(e))

        # Resource constraints
        # RNDT 2.4.1
        # ---------------------
        resourceConstraints = _add(
            'gmd', 'resourceConstraints', parent=MD_DataIdentification)
        MD_Constraints = _add('gmd', 'MD_Constraints', parent=resourceConstraints)
        useLimitation = _add('gmd', 'useLimitation', parent=MD_Constraints)
        _add('gco', 'CharacterString',
             text="%s" % _('No conditions apply') if not record.inspire_use_limitation else record.inspire_use_limitation,
             parent=useLimitation)

        # Resource constraints
        # ================================================================================================
        # RNDT 2.4.2
        # ---------------------
        resourceConstraints_inspire = _add(
            'gmd', 'resourceConstraints', parent=MD_DataIdentification)
        MD_LegalConstraints = _add(
            'gmd', 'MD_LegalConstraints', parent=resourceConstraints_inspire)
        accessConstraints = _add('gmd', 'accessConstraints', parent=MD_LegalConstraints)
        MD_RestrictionCode = _add(
            'gmd',
            'MD_RestrictionCode',
            {
                'codeList': 'http://standards.iso.org/iso/19139/resources/gmxCodelists.xml#MD_RestrictionCode',
                'codeListValue': 'otherRestrictions',
            },
            text="%s" % _('Other restrictions'),
            parent=accessConstraints
        )

        otherConstraints = _add('gmd', 'otherConstraints', parent=MD_LegalConstraints)

        if record.access_constraints_inspire_id:
            _add('gmx', 'Anchor', {
                    '{http://www.w3.org/1999/xlink}href': record.access_constraints_inspire.url,
                },
                text=str(record.access_constraints_inspire),
                parent=otherConstraints
            )

        # Resource constraints
        # RNDT 2.4.3
        # ---------------------
        resourceConstraints_legal = _add(
            'gmd', 'resourceConstraints', parent=MD_DataIdentification)
        MD_LegalConstraints = _add(
            'gmd', 'MD_LegalConstraints', parent=resourceConstraints_legal)


        accessConstraints = _add('gmd', 'accessConstraints',
                                 parent=MD_LegalConstraints)
        MD_RestrictionCode = _add(
            'gmd',
            'MD_RestrictionCode',
            {
                'codeList': 'http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/gmxCodelists.xml#MD_RestrictionCode',
                'codeListValue': 'otherRestrictions',
            },
            text= "%s" % _('Other restrictions'),
            parent=accessConstraints
        )

        otherConstraints = _add('gmd', 'otherConstraints',
                                parent=MD_LegalConstraints)

        if not record.usability_constraints and not record.eu_license:
            _add('gmx', 'Anchor', {
                '{http://www.w3.org/1999/xlink}href': 'http://inspire.ec.europa.eu/metadata-codelist/ConditionsApplyingToAccessAndUse/noConditionsApply',
            },
                 text="%s" % _('No conditions apply'),
                 parent=otherConstraints
                 )
        elif record.eu_license_id:
            _add('gco', 'CharacterString', text=record.eu_license.url, parent=otherConstraints)
        else:
            _add('gco', 'CharacterString', text=record.usability_constraints, parent=otherConstraints)

        # Resource constraints
        # RNDT ?.?.?
        # ---------------------
        resourceConstraints = u"""<gmd:resourceConstraints xmlns:gmd="http://www.isotc211.org/2005/gmd" xmlns:gco="http://www.isotc211.org/2005/gco">
            <gmd:MD_SecurityConstraints>
                <gmd:classification>
                <gmd:MD_ClassificationCode
                    codeList="http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/gmxCodelists.xml#MD_ClassificationCode"
                    codeListValue="unclassified" codeSpace="domainCode">unclassified</gmd:MD_ClassificationCode>
                </gmd:classification>
            </gmd:MD_SecurityConstraints>
            </gmd:resourceConstraints>"""
        MD_DataIdentification.append(_parse_str(resourceConstraints))

        # ================================================================================================
        # Resource constraints


        # Patch codelist on datetypecode
        for dt in MD_DataIdentification.xpath('//gmd:CI_DateTypeCode', namespaces=self.namespaces):
            dt.attrib['codeList'] = 'http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/ML_gmxCodelists.xml#CI_DateTypeCode'
            dt.attrib['codeSpace'] = "ISOTC211/19115"

        # Remove original spatialResolution (wrong position)
        if esn in ['summary', 'full']:
            sr = node.xpath('//gmd:spatialResolution', namespaces=node.nsmap)[0]
            sr.getparent().remove(sr)

        # Set raster/vector
        spatialRepresentationType = et.SubElement(MD_DataIdentification, util.nspath_eval(
            'gmd:spatialRepresentationType', self.namespaces))
        et.SubElement(spatialRepresentationType, util.nspath_eval('gmd:MD_SpatialRepresentationTypeCode', self.namespaces), {
            'codeList': "http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/gmxCodelists.xml#MD_SpatialRepresentationTypeCode",
            'codeListValue': 'vector'
        }).text = 'vector'

        spatialResolutionValue = record.denominator
        spatialResolution = u"""<gmd:spatialResolution xmlns:gmd="http://www.isotc211.org/2005/gmd" xmlns:gco="http://www.isotc211.org/2005/gco">
        <gmd:MD_Resolution>
          <gmd:equivalentScale>
            <gmd:MD_RepresentativeFraction>
              <gmd:denominator>
                <gco:Integer>%s</gco:Integer>
              </gmd:denominator>
            </gmd:MD_RepresentativeFraction>
          </gmd:equivalentScale>
        </gmd:MD_Resolution>
        </gmd:spatialResolution>""" % spatialResolutionValue
        MD_DataIdentification.append(self._parse_str(spatialResolution))

        # Fix language
        if esn in ['summary', 'full']:
            lang = self._fix_language(MD_DataIdentification, record.resource_language if record.resource_language else result.language)
            MD_DataIdentification.remove(lang)
            MD_DataIdentification.append(lang)  # reorder

        # Data characterSet
        MD_DataIdentification.append(copy.deepcopy(characterSet))

        # Patch quality info scope code
        if esn in ['summary', 'full']:
            DataQualityInfo = node.find('{http://www.isotc211.org/2005/gmd}dataQualityInfo').getchildren()[0]
            for scope_code in DataQualityInfo.xpath('//gmd:MD_ScopeCode', namespaces=node.nsmap):
                scope_code.attrib['codeListValue'] = 'dataset'
                scope_code.text = "%s" % _('dataset')

        # CI_Citation additions
        CI_Citation = MD_DataIdentification.xpath(
            '//gmd:citation/gmd:CI_Citation', namespaces=self.namespaces)[0]

        # Dataset identifier (use RNDT dataset identifier)
        identifier = et.SubElement(CI_Citation, util.nspath_eval(
            'gmd:identifier', self.namespaces))
        MD_Identifier = et.SubElement(identifier, util.nspath_eval(
            'gmd:MD_Identifier', self.namespaces))
        code = et.SubElement(MD_Identifier, util.nspath_eval(
            'gmd:code', self.namespaces))
        et.SubElement(code, util.nspath_eval(
            'gco:CharacterString', self.namespaces)).text = record.rndt_dataset_identifier()

        # Check for dates (creation, publication and revision), at least "revision" is mandatory
        if len(CI_Citation.xpath('//gmd:MD_DataIdentification/gmd:citation/gmd:CI_Citation/gmd:date', namespaces=self.namespaces)) == 0:
            creation_date = u"""
            <gmd:date xmlns:gmd="http://www.isotc211.org/2005/gmd" xmlns:gco="http://www.isotc211.org/2005/gco">
                <gmd:CI_Date>
                    <gmd:date>
                        <gco:Date>%s</gco:Date>
                    </gmd:date>
                    <gmd:dateType>
                        <gmd:CI_DateTypeCode codeListValue="creation"
                            codeList="http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/gmxCodelists.xml#CI_DateTypeCode">
                            creazione
                        </gmd:CI_DateTypeCode>
                    </gmd:dateType>
                </gmd:CI_Date>
            </gmd:date>
            """ % str(catalog.inspire_date)
            CI_Citation.insert(1, self._parse_str(creation_date))

        # Copy contact in metadata citedResponsibleParty
        citedResponsibleParty = et.SubElement(CI_Citation, util.nspath_eval(
            'gmd:citedResponsibleParty', self.namespaces))
        if esn in ['summary', 'full']:
            CI_ResponsibleParty = copy.deepcopy(contact.getchildren()[0])

            # Replace poc with owner
            role = CI_ResponsibleParty.xpath(
                '//gmd:role', namespaces=self.namespaces)[0]
            role.getchildren()[0].attrib['codeListValue'] = 'owner'
            role.getchildren()[0].text = 'owner'  # "%s" % _('Owner')

             # Patch owner data from record if defined
            if record.inspire_owner_contact_organization:
                CI_ResponsibleParty.xpath('//gmd:organisationName/gco:CharacterString', namespaces=self.namespaces)[0].text = record.inspire_owner_contact_organization

            if record.inspire_owner_contact_email:
                CI_ResponsibleParty.xpath('//gmd:electronicMailAddress/gco:CharacterString', namespaces=self.namespaces)[0].text = record.inspire_owner_contact_email

            if record.inspire_owner_contact_phone:
                CI_ResponsibleParty.xpath('//gmd:voice/gco:CharacterString', namespaces=self.namespaces)[0].text = record.inspire_owner_contact_phone

            if record.inspire_owner_contact_url:
                CI_ResponsibleParty.xpath('//gmd:URL', namespaces=self.namespaces)[0].text = record.inspire_owner_contact_url


            citedResponsibleParty.append(CI_ResponsibleParty)

        presentationForm = et.SubElement(CI_Citation, util.nspath_eval(
            'gmd:presentationForm', self.namespaces))
        et.SubElement(presentationForm, util.nspath_eval('gmd:CI_PresentationFormCode', self.namespaces), {
            'codeList': "http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/gmxCodelists.xml#CI_PresentationFormCode",
            'codeListValue': 'mapDigital'
        }).text = 'mapDigital'  # "%s" % _('Digital map')

        # Series
        series = u"""
        <gmd:series xmlns:gmd="http://www.isotc211.org/2005/gmd" xmlns:gco="http://www.isotc211.org/2005/gco">
            <gmd:CI_Series>
              <gmd:issueIdentification>
                <gco:CharacterString>%s</gco:CharacterString>
              </gmd:issueIdentification>
            </gmd:CI_Series>
        </gmd:series>
        """ % record.rndt_dataset_identifier()
        CI_Citation.append(self._parse_str(series))

        # Patch distribution
        MD_Distribution = node.xpath(
            '//gmd:MD_Distribution', namespaces=self.namespaces)[0]

        # The problem here is to determine if it is a vector layer or not, since both
        # are served as WMS and WFS could have been disabled.
        # So if it's a vector, the identifier contains ":ows." instead of ":wms."
        # Identifier: u'CODIPA:ows.qdjango.world.79:20200420:140232
        is_vector = ':ows.qdjango' in record.identifier

        # Change OWS (WMS/WFS) links from APISO plugin values
        transerOption = MD_Distribution.xpath(
            '//gmd:transferOptions', namespaces=self.namespaces)[0]

        hrefs_protocol = {
            "OGC:WMS": "http://www.opengis.net/def/serviceType/ogc/wms",
            "OGC:WFS": "http://www.opengis.net/def/serviceType/ogc/wfs"
        }

        hrefs_aprofile = {
            "OGC:WMS": [
                "http://inspire.ec.europa.eu/metadata-codelist/SpatialDataServiceType/view",
                "view"
            ],

            "OGC:WFS": [
                "http://inspire.ec.europa.eu/metadata-codelist/SpatialDataServiceType/download",
                "download"
            ]
        }

        onlineresources = transerOption.xpath(
            '//gmd:CI_OnlineResource', namespaces=self.namespaces)

        for online in onlineresources:
            try:
                protocol = online[1]
                link = online[0]
                if protocol[0].text in ("OGC:WMS", "OGC:WFS"):

                    if protocol[0].text == "OGC:WMS":
                        link[0].text = f"{link[0].text}?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities"
                    else:
                        link[0].text = f"{link[0].text}?SERVICE=WFS&VERSION=1.1.0&REQUEST=GetCapabilities"

                    anchor = f"<gmx:Anchor " \
                             f"xmlns:xlink=\"http://www.w3.org/1999/xlink\" " \
                             f"xmlns:gmx=\"http://www.isotc211.org/2005/gmx\" " \
                             f"xlink:href=\"{hrefs_protocol[protocol[0].text]}\">{protocol[0].text}" \
                             f"</gmx:Anchor>"
                    protocol.insert(0, self._parse_str(anchor))

                    # Delete old CharacterString tag
                    del (protocol[1])

                    applicationProfile = f"""
                    <gmd:applicationProfile
                    xmlns:gmd="http://www.isotc211.org/2005/gmd"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    xmlns:gmx="http://www.isotc211.org/2005/gmx">
                        <gmx:Anchor xlink:href="{hrefs_aprofile[protocol[0].text][0]}">{hrefs_aprofile[protocol[0].text][1]}</gmx:Anchor>
                    </gmd:applicationProfile>
                    """
                    online.insert(2, self._parse_str(applicationProfile))

                    anchor = f"<gmx:Anchor " \
                             f"xmlns:xlink=\"http://www.w3.org/1999/xlink\" " \
                             f"xmlns:gmx=\"http://www.isotc211.org/2005/gmx\" " \
                             f"xlink:href=\"http://inspire.ec.europa.eu/metadata-codelist/OnLineDescriptionCode/accessPoint\">" \
                             f"access point" \
                             f"</gmx:Anchor>"
                    online[4].insert(0, self._parse_str(anchor))
                    del (online[4][1])

            except IndexError as e:
                pass




        # distributionFormat
        # FIXME: get from record (or make it fixed: WFS? Shapefile/GTiff?)
        distributionFormat = u"""
        <gmd:distributionFormat xmlns:gmd="http://www.isotc211.org/2005/gmd" xmlns:gco="http://www.isotc211.org/2005/gco">
        <gmd:MD_Format>
          <gmd:name>
            <gco:CharacterString>%s</gco:CharacterString>
          </gmd:name>
          <gmd:version>
            <gco:CharacterString>%s</gco:CharacterString>
          </gmd:version>
        </gmd:MD_Format>
        </gmd:distributionFormat>
        """ % (('GTiff', '1.0') if not is_vector else ('shapefile', '10.1'))
        MD_Distribution.insert(0, self._parse_str(distributionFormat))

        # Distributor, default to main (inspire_contact_) contact if it's empty
        distributor = et.Element(util.nspath_eval(
            'gmd:distributor', self.namespaces))
        MD_Distributor = et.SubElement(distributor, util.nspath_eval(
            'gmd:MD_Distributor', self.namespaces))
        distributorContact = et.SubElement(MD_Distributor, util.nspath_eval(
            'gmd:distributorContact', self.namespaces))

        if esn in ['summary', 'full']:
            # Copy from contact if not defined
            if not record.rndt_distributor_contact_organization:
                base_contact = contact
            else:
                base_contact = self._contact(
                    record.rndt_distributor_contact_organization,
                    record.rndt_distributor_contact_email,
                    record.rndt_distributor_contact_phone,
                    record.rndt_distributor_contact_url,
                    'distributor'
                    )

            CI_ResponsibleParty = copy.deepcopy(base_contact.getchildren()[0])

            # Replace poc with distributor
            role = CI_ResponsibleParty.xpath(
                '//gmd:role', namespaces=self.namespaces)[0]
            role.getchildren()[0].attrib['codeListValue'] = 'distributor'
            role.getchildren()[0].text = "%s" % _('Distributor')
            distributorContact.append(CI_ResponsibleParty)
            MD_Distribution.insert(1, distributor)

            # thesaurusName
            thesaurusName = u"""<gmd:thesaurusName xmlns:gmd="http://www.isotc211.org/2005/gmd" xmlns:gco="http://www.isotc211.org/2005/gco">
                <gmd:CI_Citation>
                  <gmd:title>
                    <gco:CharacterString>GEMET - INSPIRE themes, version 1.0</gco:CharacterString>
                  </gmd:title>
                  <gmd:date>
                    <gmd:CI_Date>
                      <gmd:date>
                        <gco:Date>2008-06-01</gco:Date>
                      </gmd:date>
                      <gmd:dateType>
                        <gmd:CI_DateTypeCode
                          codeList="http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/gmxCodelists.xml#CI_DateTypeCode"
                          codeListValue="publication">publication</gmd:CI_DateTypeCode>
                      </gmd:dateType>
                    </gmd:CI_Date>
                  </gmd:date>
                </gmd:CI_Citation>
              </gmd:thesaurusName>"""
            MD_Keywords = node.xpath(
                '//gmd:descriptiveKeywords/gmd:MD_Keywords', namespaces=self.namespaces)[0]
            MD_Keywords.append(self._parse_str(thesaurusName))

            # Append free keywords from the project
            if record.project_keywords:
                keywords = ''
                for k in record.project_keywords.split(','):
                    keywords += """
                    <gmd:keyword>
                        <gco:CharacterString>%s</gco:CharacterString>
                    </gmd:keyword>
                    """ % k
                project_keywords = u"""
                <gmd:descriptiveKeywords xmlns:gmd="http://www.isotc211.org/2005/gmd" xmlns:gco="http://www.isotc211.org/2005/gco">
                    <gmd:MD_Keywords>
                    %s
                    </gmd:MD_Keywords>
                </gmd:descriptiveKeywords>
                """ % keywords

                MD_DataIdentification.insert(MD_DataIdentification.index(MD_Keywords.getparent())+1, self._parse_str(project_keywords))


            # Various download links
            try:

                # Get the layer id from the identifier
                # Identifier: u'CODIPA:ows.qdjango.world.79:20200420:140232
                _id = result.identifier[:-16]
                _id = int(re.findall(r'\d+$', _id)[0])
                layer = Layer.objects.get(pk=_id)

                # Link to the map viewer
                port = str(getattr(settings, 'CATALOG_PORT', '80'))
                viewer_url = getattr(settings, 'CATALOG_URL_SCHEME', 'http') + '://' + getattr(settings, 'CATALOG_HOST', 'localhost') + ( '' if port == '80' else ':' + port )  + reverse('group-project-slug-map', kwargs={ 'project_type' : 'qdjango', 'group_slug': layer.project.group.slug, 'project_slug': layer.project.slug } )
                viewer = u"""
                <gmd:transferOptions 
                xmlns:gmd="http://www.isotc211.org/2005/gmd" 
                xmlns:gco="http://www.isotc211.org/2005/gco" 
                xmlns:gmx="http://www.isotc211.org/2005/gmx"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                >
                    <gmd:MD_DigitalTransferOptions>
                        <gmd:onLine>
                            <gmd:CI_OnlineResource>
                                <gmd:linkage>
                                <gmd:URL>
                                %s
                                </gmd:URL>
                                </gmd:linkage>
                                <gmd:protocol>
                                    <gmx:Anchor xlink:href="http://www.w3.org/TR/xlink">WWW:LINK</gmx:Anchor>
                                </gmd:protocol>
                                <gmd:applicationProfile>
                                    <gmx:Anchor xlink:href="http://inspire.ec.europa.eu/metadata-codelist/SpatialDataServiceType/other">other</gmx:Anchor>
                                </gmd:applicationProfile>
                                <gmd:description>
                                   <gmx:Anchor xlink:href="http://inspire.ec.europa.eu/metadata-codelist/OnLineDescriptionCode/accessPoint">access point</gmx:Anchor>
                                </gmd:description>
                                <gmd:function>
                                    <gmd:CI_OnLineFunctionCode codeList="http://standards.iso.org/ittf/PubliclyAvailableStandards/ ISO_19139_Schemas/resources/Codelist/gmxCodelists.xml#CI_OnLineFunctionCode" codeListValue="information">information</gmd:CI_OnLineFunctionCode>
					            </gmd:function>
                            </gmd:CI_OnlineResource>
                        </gmd:onLine>
                    </gmd:MD_DigitalTransferOptions>
                </gmd:transferOptions>""" % viewer_url
                MD_Distribution.append(self._parse_str(viewer))

                # Download options for vector layers
                if is_vector:
                    if layer.download:
                        # !!! WARNING: gets a layer_name but it is actually the qgs_layer_id
                        download_url =  getattr(settings, 'CATALOG_URL_SCHEME', 'http') + \
                                        '://' + getattr(settings, 'CATALOG_HOST', 'localhost') + \
                                        ( '' if port == '80' else ':' + port )  + \
                                        reverse('core-vector-api-ext', kwargs={
                                            'project_type': 'qdjango',
                                            'mode_call': 'shp',
                                            'project_id': layer.project_id,
                                            'layer_name': layer.qgs_layer_id,
                                            'ext': 'zip'
                                        })
                        # <gmd:protocol>
                        #     <gco:CharacterString>http</gco:CharacterString>
                        # </gmd:protocol>
                        download = u"""
                        <gmd:transferOptions 
                            xmlns:gmd="http://www.isotc211.org/2005/gmd" 
                            xmlns:gco="http://www.isotc211.org/2005/gco" 
                            xmlns:gmx="http://www.isotc211.org/2005/gmx" 
                            xmlns:xlink="http://www.w3.org/1999/xlink"
                            >
                            <gmd:MD_DigitalTransferOptions>
                                <gmd:onLine>
                                    <gmd:CI_OnlineResource>
                                        <gmd:linkage>
                                            <gmd:URL>
                                            %s
                                            </gmd:URL>
                                        </gmd:linkage>
                                        <gmd:protocol>
                                            <gmx:Anchor xlink:href="https://registry.geodati.gov.it/metadata-codelist/ProtocolValue/www-download">WWW:DOWNLOAD-1.0-http--download</gmx:Anchor>
                                        </gmd:protocol>
                                        <gmd:applicationProfile>
                                            <gmx:Anchor xlink:href="http://inspire.ec.europa.eu/metadata-codelist/SpatialDataServiceType/other">other</gmx:Anchor>
                                        </gmd:applicationProfile>
                                        <gmd:name gco:nilReason="missing">
                                            <gco:CharacterString/>
                                        </gmd:name>
                                        <gmd:description gco:nilReason="missing">
                                            <gmx:Anchor xlink:href="http://inspire.ec.europa.eu/metadata-codelist/OnLineDescriptionCode/accessPoint">access point</gmx:Anchor>
                                        </gmd:description>
                                        <gmd:function>
                                            <gmd:CI_OnLineFunctionCode codeList="http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/Codelist/ML_gmxCodelists.xml#CI_OnLineFunctionCode" codeListValue="download">download</gmd:CI_OnLineFunctionCode>
                                        </gmd:function>
                                    </gmd:CI_OnlineResource>
                                </gmd:onLine>
                            </gmd:MD_DigitalTransferOptions>
                        </gmd:transferOptions>""" % download_url

                        MD_Distribution.append(self._parse_str(download))

            except Exception as ex:
                logger.warning('Error fetching layer information from %s: %s' % (result.identifier, ex))
                pass

        # Lineage
        lineageText = record.lineage if record.lineage is not None else _(
            "Unknown")
        lineage = u"""<gmd:lineage xmlns:gmd="http://www.isotc211.org/2005/gmd" xmlns:gco="http://www.isotc211.org/2005/gco">
        <gmd:LI_Lineage>
          <gmd:statement>
            <gco:CharacterString>%s</gco:CharacterString>
          </gmd:statement>
        </gmd:LI_Lineage>
        </gmd:lineage>
        """ % lineageText
        DQ_DataQuality.append(self._parse_str(lineage))

        # Order fixes (element is correct but order is wrong)
        hierarchyLevel = node.xpath(
            '//gmd:hierarchyLevel', namespaces=self.namespaces)[0]
        node.remove(hierarchyLevel)
        node.insert(4, hierarchyLevel)

        # Add referenceSystemInfo
        referenceSystemInfo = u"""
        <gmd:referenceSystemInfo xmlns:gmd="http://www.isotc211.org/2005/gmd" xmlns:gco="http://www.isotc211.org/2005/gco">
            <gmd:MD_ReferenceSystem>
            <gmd:referenceSystemIdentifier>
                <gmd:RS_Identifier>
                <gmd:code>
                    <gco:CharacterString>%s</gco:CharacterString>
                </gmd:code>
                <gmd:codeSpace>
                    <gco:CharacterString>http://www.epsg-registry.org/</gco:CharacterString>
                </gmd:codeSpace>
                </gmd:RS_Identifier>
            </gmd:referenceSystemIdentifier>
            </gmd:MD_ReferenceSystem>
        </gmd:referenceSystemInfo>
        """ % record.crs

        metadataStandardVersion = node.xpath(
            '//gmd:metadataStandardVersion', namespaces=node.nsmap)[0]
        metadataStandardVersion.getparent().insert(metadataStandardVersion.getparent(
        ).index(metadataStandardVersion) + 1, self._parse_str(referenceSystemInfo))

        # Patch metadataStandardVersion
        metadataStandardVersion.getchildren()[0].text = '2.0'
        metadataStandardName = node.xpath(
            '//gmd:metadataStandardName', namespaces=node.nsmap)[0]
        metadataStandardName.getchildren()[0].text = 'Linee Guida RNDT'

        # Move topic category and extent to the end
        if esn in ['summary', 'full']:
            # Clear all topic categories
            topicCategories = node.xpath('//gmd:topicCategory', namespaces=node.nsmap)
            if not len(topicCategories):
                topicCategory = et.SubElement(MD_DataIdentification, util.nspath_eval(
                'gmd:topicCategory', self.namespaces))
                et.SubElement(topicCategory, util.nspath_eval('gmd:MD_TopicCategoryCode', self.namespaces)
                          ).text = result.topic_category if result.topic_category else 'planningCadastre'
            else:
                for topicCategory in topicCategories:
                    MD_DataIdentification.remove(topicCategory)
                    MD_DataIdentification.append(topicCategory)

            extent = node.xpath(
                '//gmd:extent', namespaces=self.namespaces)[0]
            extent.getparent().remove(extent)
            MD_DataIdentification.append(extent)


        # Patch uselimitation
        if record.inspire_use_limitation:
            ns = node.nsmap
            ns['gco'] = 'http://www.isotc211.org/2005/gco'
            node.xpath('//gmd:useLimitation/gco:CharacterString', namespaces=ns)[0].text = record.inspire_use_limitation

        return node
