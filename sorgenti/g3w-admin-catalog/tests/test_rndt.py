# coding=utf-8
""""Test RNDT classes

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

"""

__author__ = 'elpaso@itopen.it'
__date__ = '2019-02-21'
__copyright__ = 'Copyright 2019, Gis3w'


import datetime
import os
import re
from lxml import etree
import unittest

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.management import call_command
from django.http import HttpResponse
from django.test import override_settings
from django.test.client import Client, RequestFactory
from django.urls import reverse
from django.utils import translation

from catalog.models import Catalog, Record
from catalog.rndt import service_metadata
from catalog.views import *

from django.contrib.auth.models import AnonymousUser

from .base import BaseCatalogTestCase

from guardian.shortcuts import assign_perm

# Import some real data from QDJANGO
from qdjango.ows import QDJANGO_TESTDATA_REQUEST
from qdjango.models import Project, Layer
from qdjango.utils.catalog_provider import catalog_provider

from core.models import G3WSpatialRefSys, Group, MacroGroup

from .base import BaseCatalogTestCase


@unittest.skipIf('qdjango' not in settings.INSTALLED_APPS, 'This test requires qdjango')
@override_settings(QDJANGO_MODE_REQUEST=QDJANGO_TESTDATA_REQUEST)
@override_settings(MEDIA_ROOT=os.path.join(os.path.realpath(os.path.dirname(__file__)), 'testdata'))
@override_settings(G3WADMIN_OWS_TESTDATA_DIR=os.path.join(os.path.realpath(os.path.dirname(__file__)), 'testdata'))
class RndtTestCase(BaseCatalogTestCase):

    # Set to True to regenerate reference XML
    regenerate_reference = False

    fixtures = [
        "test_core.json",
        "test_qdjango.json",
    ]

    def xml_compare(self, actual, reference_file_name, overwrite_reference=False):
        """Compare XML line by line"""

        if overwrite_reference:
            with open(os.path.join(os.path.dirname(__file__), 'testdata', reference_file_name), 'w+') as reference:
                reference.write(actual)

        with open(os.path.join(os.path.dirname(__file__), 'testdata', reference_file_name)) as expected:
            expected_lines = expected.readlines()
            xml_lines = actual.split('\n')
            for i in range(len(expected_lines)):
                if '<gco:Date' in xml_lines[i] or 'timestamp' in xml_lines[i]:
                    continue
                ex = re.sub(r':[\d:]+', '',  expected_lines[i]).strip()
                ac = re.sub(r':[\d:]+', '',  xml_lines[i]).strip()
                self.assertEqual(ac, ex, "line %s differs:\n%s\n%s" %
                                 (i, xml_lines[i], expected_lines[i]))

    def _tag_tree(self, element, level=0):
        result = (' '*level) + element.tag + '\n'
        for c in element.getchildren():
            result += self._tag_tree(c, level+1)
        return result

    def xml_structure_compare(self, actual, reference_file_name):
        """Compare XML tags tree structure"""

        parser = etree.XMLParser(remove_blank_text=True, remove_comments=True)
        referencexml = etree.parse(reference_file_name, parser).getroot()

        rectree = self._tag_tree(actual).split('\n')
        i = 0
        xml_lines = self._tag_tree(referencexml).split('\n')
        for t in xml_lines:
            try:
                self.assertEqual(t, rectree[i], "%s: %s != %s - %s" % (i, t, rectree[i], reference_file_name))
            except Exception as ex:
                # Print lines
                print("Last 5 lines before error:")
                print("-" * 80)
                for line_no in range(max(0, i - 5), i):
                    print(xml_lines[line_no])
                raise ex
                print("-" * 80)
            i+=1

    @classmethod
    def setUpClass(cls):
        """Setup a catalog"""

        super(RndtTestCase, cls).setUpClass()

    def setUp(self):
        catalog, is_new = Catalog.objects.get_or_create(
            name='catalogtest_global')

        catalog.inspire_temp_extent = '1910-01-01/2119-01-01'
        catalog.inspire_conformity_service = 'conformant'
        catalog.inspire_contact_email = 'email@mail.com'
        catalog.inspire_gemet_keywords = [
            'Atmospheric conditions', 'Cadastral parcels']
        catalog.inspire_languages_supported = ['ita', 'dan', 'fre']
        catalog.inspire_default_language = 'ita'
        catalog.inspire_contact_phone = '+390706064325'
        catalog.inspire_contact_email = 'eell.urb.infocarto@regione.sardegna.it'
        catalog.inspire_contact_url = 'http://www.sardegnaterritorio.it'
        catalog.inspire_geographical_extent = '7.0 44.0 9.0 45.0'
        catalog.inspire_contact_organization = "Ufficio Regionale RNDT"
        catalog.inspire_enabled = True

        # Enable RNDT
        catalog.rndt_enabled = True
        catalog.identification_title = 'Service Abstract Test Suite'
        catalog.identification_accessconstraints = 'Dato pubblico (cfr. art. 1 Codice Amministrazione Digitale)'
        catalog.identification_abstract = 'Il servizio WMS (Web Map Service) permette di visualizzare le cartografie che la Regione Autonoma della Sardegna mette a disposizione all\'interno del Sistema Informativo Territoriale Regionale.'
        catalog.rndt_codice_ipa = 'R_SARDEG'

        for rndt_field in catalog.rndt_required_fields().keys():
            if rndt_field.find('date') >= 0:
                setattr(catalog, rndt_field, datetime.datetime.now())
            else:
                pass  # No defaults

        catalog.save()
        self.catalog = catalog

        for project in Project.objects.all():
            assign_perm('view_project', AnonymousUser(), project)
        for layer in Layer.objects.all():
            assign_perm('view_layer', AnonymousUser(), layer)

        Catalog.register_catalog_record_provider(catalog_provider,
                                                 scope=Catalog.SCOPE.GLOBAL,
                                                 senders=[Layer])
        catalog.invalidate_all_catalogs()

        self.assertEqual(catalog.record_set.count(), 2)

        # Modify the publication date and other data
        for rec in Record.objects.all():
            rec.publication_date = datetime.date(2010, 1, 1)
            rec.rndt_distributor_contact_organization = "My Test Org"
            rec.rndt_distributor_contact_email = "email@test.org"
            rec.rndt_distributor_contact_phone = "001122334455"
            rec.rndt_distributor_contact_url = "https://www.test.org"
            rec.inspire_use_limitation = "Dalle 8 alle 8 il 31 febbraio di ogni anno"
            rec.alternate_title = 'cicco'
            rec.save()

        # Patch only one record with pointOfContact overrides
        rec = Record.objects.get(identifier__contains='world')
        rec.inspire_contact_organization = "My Inspire Test Org"
        rec.inspire_contact_email = "emailinspire@test.org"
        rec.inspire_contact_phone = "009999999999"
        rec.inspire_contact_url = "https://www.testinspire.org"
        rec.inspire_owner_contact_organization = "My Inspire Test Owner"
        rec.inspire_owner_contact_email = "emailinspireowner@test.org"
        rec.inspire_owner_contact_phone = "00888888888"
        rec.inspire_ownercontact_url = "https://www.testinspireowner.org"
        rec.save()

    def test_service_metadata(self):
        """Test service XML metadata"""

        xml = service_metadata(self.catalog, 'http://localhost:8000')
        metadata_record = etree.fromstring(xml)

        if not os.environ.get('SKIP_SCHEMA_VALIDATION'):
            schema = etree.XMLSchema(file=os.path.join(
                os.path.dirname(__file__), 'RNDT_XSD/gis3w_wrapper.xsd'))
            try:
                schema.assertValid(metadata_record)
            except etree.DocumentInvalid as xml_errors:
                raise xml_errors
            if 'xml_errors' in locals():
                print("List of errors:\r\n", xml_errors.error_log)

        self.xml_compare(
            xml, 'rndt_service_metadata_expected.xml', self.regenerate_reference)

        # Check tags with AGID reference
        reference_path = os.path.join(os.path.dirname(__file__), 'testdata', 'rndt_service_metadata_expected_AgID.xml')
        self.xml_structure_compare(metadata_record, reference_path)


    def test_data_metadata(self):
        """Test service XML metadata"""

        req = RequestFactory().get(
            reverse('catalog:csw_by_slug', args=[self.catalog.slug]))
        # Request records
        self.assertEqual(self.catalog.record_set.count(), 2)
        response = self.client.get(reverse('catalog:csw_by_slug', args=[self.catalog.slug]) +
                                   '?SERVICE=CSW&REQUEST=GetRecords&ELEMENTSETNAME=full&VERSION=2.0.2'
                                   '&TYPENAMES=csw%3ARecord&resulttype=results&OUTPUTSCHEMA=http://www.isotc211.org/2005/gmd')

        xml = etree.fromstring(response.content)

        # Get two records
        records = xml.getchildren()[1].findall(
            '{http://www.isotc211.org/2005/gmd}MD_Metadata')

        # Record1 is "bluemarble", record2 is "world"
        if 'bluemarble' in records[0].xpath('//gmd:fileIdentifier/gco:CharacterString', namespaces=records[1].nsmap)[0].text:
            record1_index = 0
            record2_index = 1
        else:
            record1_index = 1
            record2_index = 0

        record1 = etree.tostring(records[record1_index], pretty_print=True)
        record2 = etree.tostring(records[record2_index], pretty_print=True)


        # Smoke test for RNDT
        self.assertTrue('parentIdentifier' in record1)
        self.assertTrue('parentIdentifier' in record2)

        if not os.environ.get('SKIP_SCHEMA_VALIDATION'):
            for record in (record1, record2):
                # ITgmd is enough for data
                schema = etree.XMLSchema(file=os.path.join(os.path.dirname(
                    __file__), 'RNDT_XSD/ISO_19139_Schemas/ITgmd/ITgmd.xsd'))
                try:
                    schema.assertValid(etree.fromstring(record))
                except etree.DocumentInvalid as xml_errors:
                    raise xml_errors
                if 'xml_errors' in locals():
                    print("List of errors:\r\n", xml_errors.error_log)

        self.xml_compare(
            record1, 'rndt_data_metadata_expected_rec1.xml', self.regenerate_reference)
        self.xml_compare(
            record2, 'rndt_data_metadata_expected_rec2.xml', self.regenerate_reference)

        # Specific test for publication date
        element = etree.fromstring(record1)
        self.assertEqual(len(element.xpath('//gco:Date[contains(text(),\'2010-01-01\')]', namespaces=element.nsmap)), 1)

        element = etree.fromstring(record2)
        keywords = [k.text for k in element.xpath('//gmd:descriptiveKeywords//gmd:keyword/gco:CharacterString', namespaces=element.nsmap)]
        self.assertTrue('keyword_from_layer2' in keywords)
        self.assertTrue('keyword_from_layer1' in keywords)
        self.assertTrue('keyword1' in keywords)
        self.assertTrue('keyword2' in keywords)

        # Check tags with AGID reference
        reference_path = os.path.join(os.path.dirname(__file__), 'testdata', 'rndt_data_metadata_expected_rec1_AgID.xml')

        self.xml_structure_compare(records[record1_index], reference_path)

