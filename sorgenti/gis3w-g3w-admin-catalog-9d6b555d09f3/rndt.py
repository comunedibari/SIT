# coding=utf-8
""""RNDT metadata generator

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

"""
from __future__ import unicode_literals

__author__ = 'elpaso@itopen.it'
__date__ = '2019-02-21'
__copyright__ = 'Copyright 2019, Gis3w'


import copy
from io import StringIO
from django.urls import reverse
from django.utils.translation import ugettext_lazy as _
from lxml import etree

NAMESPACES = {
    "gmd": "http://www.isotc211.org/2005/gmd",
    "xsi": "http://www.w3.org/2001/XMLSchema-instance",
    "xlink": "http://www.w3.org/1999/xlink",
    "srv": "http://www.isotc211.org/2005/srv",
    "gml": "http://www.opengis.net/gml/3.2",
    "gts": "http://www.isotc211.org/2005/gts",
    "gss": "http://www.isotc211.org/2005/gss",
    "gsr": "http://www.isotc211.org/2005/gsr",
    "gco": "http://www.isotc211.org/2005/gco",
}


def _add(ns, name, attrs={}, text=None, parent=None):
    """Helper to add elements"""

    if parent is not None:
        e = etree.SubElement(
            parent, "{%s}%s" % (NAMESPACES[ns], name), nsmap=NAMESPACES)
    else:
        e = etree.Element("{%s}%s" % (NAMESPACES[ns], name), nsmap=NAMESPACES)
    if text is not None:
        e.text = text
    for a, v in attrs.items():
        e.attrib[a] = v
    return e


def service_metadata_xml(catalog, base_url):
    """Generate service metadata XML

    :param catalog: catalog instance
    :type catalog: Catalog instance
    :param base_url: base URL of this server
    :type base_url: str
    :return: xml metadata as xml instance
    :rtype: lxml Element instance
    """

    def _parse_str(text):
        parser = etree.XMLParser(remove_blank_text=True)
        return etree.parse(StringIO(text), parser).getroot()

    root = etree.Element(
        "{http://www.isotc211.org/2005/gmd}MD_Metadata", nsmap=NAMESPACES)
    identifier = _add('gmd', 'fileIdentifier', parent=root)
    _add('gco', 'CharacterString', {}, catalog.rndt_file_identifier, identifier)
    language = _add('gmd', 'language', parent=root)
    _add('gmd',
         'LanguageCode',
         {
             'codeList': 'http://www.loc.gov/standards/iso639',
             'codeListValue': catalog.inspire_default_language,
         },
         catalog.inspire_default_language,
         language
         )

    cs = _add('gmd', 'characterSet', parent=root)
    _add('gmd',
         'MD_CharacterSetCode',
         {
             'codeList': 'http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/ML_gmxCodelists.xml#MD_CharacterSetCode',
             'codeListValue': 'utf8',
         },
         'utf8',
         cs)
    # Parent is same: flat model
    parent_identifier = _add('gmd', 'parentIdentifier', parent=root)
    _add('gco', 'CharacterString', {},
         catalog.rndt_file_identifier, parent_identifier)

    hierarchyLevel = _add('gmd', 'hierarchyLevel', parent=root)
    MD_ScopeCode = _add('gmd',
                        'MD_ScopeCode',
                        {
                            'codeList': 'http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/ML_gmxCodelists.xml#MD_ScopeCode',
                            'codeListValue': 'service',
                        },
                        "%s" % _('Service'),
                        parent=hierarchyLevel
                        )

    contact = _add('gmd', 'contact', parent=root)
    CI_ResponsibleParty = _add('gmd', 'CI_ResponsibleParty', parent=contact)
    organisationName = _add('gmd', 'organisationName',
                            parent=CI_ResponsibleParty)
    _add('gco', 'CharacterString', {},
         catalog.inspire_contact_organization, organisationName)
    contactInfo = _add('gmd', 'contactInfo', parent=CI_ResponsibleParty)
    CI_Contact = _add('gmd', 'CI_Contact', parent=contactInfo)
    phone = _add('gmd', 'phone', parent=CI_Contact)
    CI_Telephone = _add('gmd', 'CI_Telephone', parent=phone)
    voice = _add('gmd', 'voice', parent=CI_Telephone)
    _add('gco', 'CharacterString', {},
         catalog.inspire_contact_phone, voice)
    address = _add('gmd', 'address', parent=CI_Contact)
    CI_Address = _add('gmd', 'CI_Address', parent=address)
    electronicMailAddress = _add(
        'gmd', 'electronicMailAddress', parent=CI_Address)
    _add('gco', 'CharacterString', {},
         catalog.inspire_contact_email, parent=electronicMailAddress)
    onlineResource = _add('gmd', 'onlineResource', parent=CI_Contact)
    CI_OnlineResource = _add('gmd', 'CI_OnlineResource', parent=onlineResource)
    linkage = _add(
        'gmd', 'linkage', parent=CI_OnlineResource)
    _add('gmd', 'URL', {},
         catalog.inspire_contact_url, parent=linkage)

    role = _add('gmd', 'role', parent=CI_ResponsibleParty)
    CI_RoleCode = _add('gmd',
                       'CI_RoleCode',
                       {
                           'codeList': 'http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/ML_gmxCodelists.xml#CI_RoleCode',
                           'codeListValue': 'pointOfContact',
                       },
                       'pointOfContact',
                       parent=role
                       )

    dateStamp = _add('gmd', 'dateStamp', parent=root)
    Date = _add('gco', 'Date', text=catalog.inspire_date.strftime(
        '%Y-%m-%d'), parent=dateStamp)

    metadataStandardName = _add('gmd', 'metadataStandardName', parent=root)
    _add('gco', 'CharacterString', {},
         'DM - Regole tecniche RNDT', parent=metadataStandardName)
    metadataStandardVersion = _add(
        'gmd', 'metadataStandardVersion', parent=root)
    _add('gco', 'CharacterString', {},
         '10 novembre 2011', parent=metadataStandardVersion)


    identificationInfo = _add('gmd', 'identificationInfo', parent=root)
    SV_ServiceIdentification = _add(
        'srv', 'SV_ServiceIdentification', parent=identificationInfo)

    def _add_citation(text, wrapper, parent):
        citation = _add('gmd', wrapper, parent=parent)
        CI_Citation = _add('gmd', 'CI_Citation', parent=citation)
        title = _add('gmd', 'title', parent=CI_Citation)
        _add('gco', 'CharacterString', {}, text, parent=title)
        return CI_Citation

    CI_Citation = _add_citation(
        catalog.identification_title, 'citation', SV_ServiceIdentification)


    def _add_date(typeName, typeDesc, dateValue, parent):
        date = _add('gmd', 'date', parent=parent)
        CI_Date = _add('gmd', 'CI_Date', parent=date)
        date = _add('gmd', 'date', parent=CI_Date)
        _add('gco', 'Date', text=dateValue, parent=date)
        dateType = _add('gmd', 'dateType', parent=CI_Date)
        _add('gmd',
             'CI_DateTypeCode',
             {
                 'codeList': 'http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/ML_gmxCodelists.xml#CI_DateTypeCode',
                 'codeListValue': typeName,
             },
             "%s" % typeDesc,
             parent=dateType
             )

    # TODO: get sensible values from catalog data for "creation" and "revision"
    _add_date('publication', _('Publication'),
              catalog.inspire_date.strftime('%Y-%m-%d'), parent=CI_Citation)

    identifier = _add('gmd', 'identifier', parent=CI_Citation)
    MD_Identifier = _add('gmd', 'MD_Identifier', parent=identifier)
    code = _add('gmd', 'code', parent=MD_Identifier)
    _add('gco', 'CharacterString',
         text=catalog.rndt_metadata_identifier, parent=code)


    citedResponsibleParty = _add('gmd', 'citedResponsibleParty', parent=CI_Citation)

    # Copy responsible party
    CI_ResponsibleParty2 = copy.deepcopy(CI_ResponsibleParty)
    CI_RoleCode = CI_ResponsibleParty2.xpath('//gmd:CI_RoleCode', namespaces=CI_ResponsibleParty2.nsmap)[0]
    CI_RoleCode.text = 'owner'
    CI_RoleCode.attrib['codeListValue'] = 'owner'

    citedResponsibleParty.append(CI_ResponsibleParty2)

    abstract = _add('gmd', 'abstract', parent=SV_ServiceIdentification)
    _add('gco', 'CharacterString',
         text=catalog.identification_abstract, parent=abstract)

    pointOfContact = _add('gmd', 'pointOfContact',
                          parent=SV_ServiceIdentification)
    pointOfContact.append(copy.deepcopy(CI_ResponsibleParty))

    # GEMET kw
    if catalog.inspire_gemet_keywords:

        descriptiveKeywords = _add(
            'gmd', 'descriptiveKeywords', parent=SV_ServiceIdentification)
        MD_Keywords = _add('gmd', 'MD_Keywords', parent=descriptiveKeywords)

        for kw in catalog.inspire_gemet_keywords:
            keyword = _add('gmd', 'keyword', parent=MD_Keywords)
            _add('gco', 'CharacterString', text=kw, parent=keyword)

        thesaurusName = _add('gmd', 'thesaurusName', parent=MD_Keywords)
        CI_Citation = _add('gmd', 'CI_Citation', parent=thesaurusName)
        title = _add('gmd', 'title', parent=CI_Citation)

        # TODO: move these values to config:
        _add('gco', 'CharacterString',
             text='GEMET - INSPIRE themes, version 1.0', parent=title)
        _add_date('publication', _('Publication'), '2008-06-01', CI_Citation)

    # Add values from not-GEMET keywords
    if catalog.identification_keywords:

        descriptiveKeywords = _add(
            'gmd', 'descriptiveKeywords', parent=SV_ServiceIdentification)
        MD_Keywords = _add('gmd', 'MD_Keywords', parent=descriptiveKeywords)

        for kw in catalog.identification_keywords.split(','):
            keyword = _add('gmd', 'keyword', parent=MD_Keywords)
            _add('gco', 'CharacterString', text=kw, parent=keyword)

    # Add inspire kw infoMapAccessService
    infoMapAccessService = u"""<gmd:descriptiveKeywords  xmlns:gmd="http://www.isotc211.org/2005/gmd" xmlns:gco="http://www.isotc211.org/2005/gco">
        <gmd:MD_Keywords>
          <gmd:keyword>
            <gco:CharacterString>infoMapAccessService</gco:CharacterString>
          </gmd:keyword>
        </gmd:MD_Keywords>
    </gmd:descriptiveKeywords>
    """
    SV_ServiceIdentification.append(_parse_str(infoMapAccessService))

    # Constraints
    resourceConstraints = _add(
        'gmd', 'resourceConstraints', parent=SV_ServiceIdentification)
    MD_Constraints = _add('gmd', 'MD_Constraints', parent=resourceConstraints)
    useLimitation = _add('gmd', 'useLimitation', parent=MD_Constraints)
    _add('gco', 'CharacterString', text="%s" %
         _('No conditions apply'), parent=useLimitation)

    resourceConstraints_legal = _add(
        'gmd', 'resourceConstraints', parent=SV_ServiceIdentification)
    MD_LegalConstraints = _add(
        'gmd', 'MD_LegalConstraints', parent=resourceConstraints_legal)
    restrictions = catalog.identification_accessconstraints or (
        "%s" % 'Altri vincoli')

    accessConstraints = _add('gmd', 'accessConstraints',
                             parent=MD_LegalConstraints)
    MD_RestrictionCode = _add(
        'gmd',
        'MD_RestrictionCode',
        {
            'codeList': 'http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/gmxCodelists.xml#MD_RestrictionCode',
            'codeListValue': 'otherRestrictions',
        },
        text= 'Altri vincoli',  ## "%s" % _('Other restrictions'),
        parent=accessConstraints
    )
    useConstraints = _add('gmd', 'useConstraints', parent=MD_LegalConstraints)
    useConstraints.append(copy.deepcopy(MD_RestrictionCode))
    otherConstraints = _add('gmd', 'otherConstraints',
                            parent=MD_LegalConstraints)
    _add('gco', 'CharacterString', text=restrictions, parent=otherConstraints)

    # Security constraints
    resourceConstraints = u"""<gmd:resourceConstraints xmlns:gmd="http://www.isotc211.org/2005/gmd" xmlns:gco="http://www.isotc211.org/2005/gco">
    <gmd:MD_SecurityConstraints>
        <gmd:classification>
        <gmd:MD_ClassificationCode
            codeList="http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/gmxCodelists.xml#MD_ClassificationCode"
            codeListValue="unclassified" codeSpace="domainCode">unclassified</gmd:MD_ClassificationCode>
        </gmd:classification>
    </gmd:MD_SecurityConstraints>
    </gmd:resourceConstraints>"""
    SV_ServiceIdentification.append(_parse_str(resourceConstraints))

    # serviceType
    serviceType = _add('srv', 'serviceType', parent=SV_ServiceIdentification)
    _add('gco', 'LocalName', {'codeSpace': "www.w3c.org"}, text='discovery', parent=serviceType)

    # Extent
    extent = _add('srv', 'extent', parent=SV_ServiceIdentification)
    EX_Extent = _add('gmd', 'EX_Extent', parent=extent)
    geographicElement = _add('gmd', 'geographicElement', parent=EX_Extent)
    EX_GeographicBoundingBox = _add(
        'gmd', 'EX_GeographicBoundingBox', parent=geographicElement)
    server_extent = catalog.inspire_geographical_extent.split(' ')
    # SWNE
    extent_dict = dict(zip(['south', 'west', 'north', 'east'], server_extent))
    for c in ['west', 'east', 'south', 'north']:
        v = extent_dict[c]
        p = _add('gmd', '%sBound%s' % (c, 'Longitude' if c in (
            'west', 'east') else 'Latitude'), parent=EX_GeographicBoundingBox)
        _add('gco', 'Decimal', text=v, parent=p)

    # couplingType (loose = svincolato, tight = vincolato)
    couplingType = _add('srv', 'couplingType', parent=SV_ServiceIdentification)
    _add(
        'srv',
        'SV_CouplingType',
        {
            'codeList': 'http://www.isotc211.org/2005/iso19119/resources/Codelist/gmxCodelists.xml#SV_CouplingType',
            'codeListValue': 'tight'
        },
        text="%s" % 'vincolato',
        parent=couplingType)

    # Service operations

    def _addOperation(name, invocation, onlineResource):
        containsOperations = _add(
            'srv', 'containsOperations', parent=SV_ServiceIdentification)
        SV_OperationMetadata = _add(
            'srv', 'SV_OperationMetadata', parent=containsOperations)
        operationName = _add('srv', 'operationName',
                             parent=SV_OperationMetadata)
        _add('gco', 'CharacterString', text=name, parent=operationName)
        DCP = _add('srv', 'DCP', parent=SV_OperationMetadata)
        _add('srv',
             'DCPList',
             {
                 'codeList': '#DCPList',
                 'codeListValue': 'WebServices'
             },
             text='WebServices',
             parent=DCP)
        invocationName = _add('srv', 'invocationName',
                              parent=SV_OperationMetadata)
        _add('gco', 'CharacterString', text=invocation, parent=invocationName)
        connectPoint = _add('srv', 'connectPoint', parent=SV_OperationMetadata)
        CI_OnlineResource = _add(
            'gmd', 'CI_OnlineResource', parent=connectPoint)
        linkage = _add(
            'gmd', 'linkage', parent=CI_OnlineResource)
        _add('gmd', 'URL', {},
             onlineResource, parent=linkage)

    onlineResource = base_url + \
        reverse('catalog:rndt_by_slug', args=[catalog.slug])
    invocation = 'SERVICE=CSW&REQUEST=GetRecords' \
        '&ELEMENTSETNAME=full&VERSION=2.0.2&TYPENAMES=csw%3ARecord&' \
        'resulttype=results&OUTPUTSCHEMA=http://www.isotc211.org/2005/gmd'
    _addOperation('GetRecords', invocation, onlineResource)
    invocation = 'SERVICE=CSW&REQUEST=GetCapabilities&OUTPUTSCHEMA=http://www.isotc211.org/2005/gmd'
    _addOperation('GetCapabilities', invocation, onlineResource)

    # Operates on
    _add(
        'srv',
        'operatesOn',
        {
            '{%s}href' % NAMESPACES['xlink']: 'http://www.rndt.gov.it/RNDT/CSW?request=GetRecordById'
            '&service=CSW&version=2.0.2&id=%s'
            '&ELEMENTSETNAME=full&OUTPUTSCHEMA=http://www.isotc211.org/2005/gmd'
            % catalog.rndt_file_identifier
        },
        parent=SV_ServiceIdentification)


    # Online resource (not mandatory?)
    distributionInfo = _add('gmd', 'distributionInfo', parent=root)
    MD_Distribution = _add('gmd', 'MD_Distribution', parent=distributionInfo)
    transferOptions = _add('gmd', 'transferOptions', parent=MD_Distribution)
    MD_DigitalTransferOptions = _add('gmd', 'MD_DigitalTransferOptions', parent=transferOptions)
    online = _add('gmd', 'onLine', parent=MD_DigitalTransferOptions)
    CI_OnlineResource = _add('gmd', 'CI_OnlineResource', parent=online)
    linkage = _add(
        'gmd', 'linkage', parent=CI_OnlineResource)
    _add('gmd', 'URL', {},
         onlineResource, parent=linkage)

    # TODO: Optional EX_TemporalExtent

    # Data quality
    dataQualityInfo = _add('gmd', 'dataQualityInfo', parent=root)
    DQ_DataQuality = _add('gmd', 'DQ_DataQuality', parent=dataQualityInfo)
    scope = _add('gmd', 'scope', parent=DQ_DataQuality)
    DQ_Scope = _add('gmd', 'DQ_Scope', parent=scope)
    level = _add('gmd', 'level', parent=DQ_Scope)
    _add(
        'gmd',
        'MD_ScopeCode',
        {
            'codeList': 'http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/gmxCodelists.xml#MD_ScopeCode',
            'codeListValue': 'service',
        },
        text="%s" % _('Service'),
        parent=level
    )

    report = _add('gmd', 'report', parent=DQ_DataQuality)
    DQ_DomainConsistency = _add('gmd', 'DQ_DomainConsistency', parent=report)
    result = _add('gmd', 'result', parent=DQ_DomainConsistency)
    DQ_ConformanceResult = _add('gmd', 'DQ_ConformanceResult', parent=result)

    # Manuale RNDT – 2.1.5.2Conformità: specifiche

    CI_Citation = _add_citation("%s" % _('Commission Regulation (EU) No 1089/2010 of 23 November 2010 implementing '
                                         'Directive 2007/2/EC of the European Parliament and of the Council as regards interoperability '
                                         'of spatial data sets and services'), 'specification', DQ_ConformanceResult)

    _add_date('publication', _('Publication'),
              '2010-12-08', parent=CI_Citation)

    explanation = _add('gmd', 'explanation', parent=DQ_ConformanceResult)
    _add('gco', 'CharacterString', text="%s" % _('Please refer to the supplied specifications.'), parent=explanation)

    # INSPIRE Conformance
    #(conformant, notConformant, notEvaluated)
    if catalog.inspire_conformity_service is not None and catalog.inspire_conformity_service != 'notEvaluated':
        pass_ = _add('gmd', 'pass', parent=DQ_ConformanceResult)
        _add('gco', 'Boolean', text='true' if catalog.inspire_conformity_service == 'conformant' else 'false',
             parent=pass_)
    else:
        _add('gmd', 'pass', {'{%s}nilReason' %
                             NAMESPACES['gco']: "unknown"}, parent=DQ_ConformanceResult)

    return root


def service_metadata(catalog, base_url):
    """Generate service metadata XML

    :param catalog: catalog instance
    :type catalog: Catalog instance
    :param base_url: base URL of this server
    :type base_url: str
    :return: xml metadata
    :rtype: str
    """

    return etree.tostring(service_metadata_xml(catalog, base_url), pretty_print=True)
