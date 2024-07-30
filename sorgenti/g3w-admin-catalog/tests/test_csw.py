# coding=utf-8
""""Test for CSW endpoints

Set the env var SKIP_SCHEMA_VALIDATION to skip slow XSD validation

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

"""

__author__ = 'elpaso@itopen.it'
__date__ = '2019-01-14'
__copyright__ = 'Copyright 2019, Gis3w'

import datetime
import os
from lxml import etree
import unittest

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.management import call_command
from django.http import HttpResponse
from django.test import TestCase
from django.test.client import Client, RequestFactory
from django.urls import reverse
from django.utils import translation

from catalog.models import Catalog, Record
from catalog.views import *
from core.models import G3WSpatialRefSys, Group, MacroGroup

from .base import BaseCatalogTestCase


class CswTestCase(BaseCatalogTestCase):

    fixtures = [
        "test_core.json",
        "test_qdjango.json",
    ]

    def test_urls(self):
        """Test urls"""

        catalog, is_new = Catalog.objects.get_or_create(
            name='catalogtest_global')
        group_catalog, is_new = Catalog.objects.get_or_create(
            name='catalogtest_group', scope=Catalog.SCOPE.GROUP, group=self.group)
        macrogroup_catalog, is_new = Catalog.objects.get_or_create(
            name='catalogtest_macrogroup', scope=Catalog.SCOPE.MACROGROUP, macrogroup=self.macrogroup)

        url = reverse('catalog:csw_by_slug', args=['catalogtest_global'])
        self.assertEqual(url, '/%s/catalog/csw/catalogtest_global/' %
                         settings.LANGUAGE_CODE[:2])
        url = reverse('catalog:csw_by_slug', args=['catalogtest_group'])
        self.assertEqual(url, '/%s/catalog/csw/catalogtest_group/' %
                         settings.LANGUAGE_CODE[:2])
        url = reverse('catalog:csw_by_slug', args=['catalogtest_macrogroup'])
        self.assertEqual(
            url, '/%s/catalog/csw/catalogtest_macrogroup/' % settings.LANGUAGE_CODE[:2])

        url = reverse('catalog:csw_by_pk', args=[catalog.pk])
        self.assertEqual(url, '/%s/catalog/csw/%s/' %
                         (settings.LANGUAGE_CODE[:2], catalog.pk))

    def test_csv_views(self):
        """Test Catalog CSW views"""

        catalog, is_new = Catalog.objects.get_or_create(
            name='catalogtest_global')
        group_catalog, is_new = Catalog.objects.get_or_create(
            name='catalogtest_group', scope=Catalog.SCOPE.GROUP, group=self.group)
        macrogroup_catalog, is_new = Catalog.objects.get_or_create(
            name='catalogtest_macrogroup', scope=Catalog.SCOPE.MACROGROUP, macrogroup=self.macrogroup)

        req = RequestFactory().get(
            reverse('catalog:csw_by_slug', args=[catalog.slug]))
        csw_settings = get_pycsw_settings(req, catalog)

        self.assertEqual(
            csw_settings['server']['url'], 'http://testserver/it/catalog/csw/%s/' % catalog.slug)

        # Now compile some fields of the catalog
        catalog.contact_name = 'John Doe'
        catalog.save()
        self.assertEqual(get_pycsw_settings(req, catalog)[
                         'metadata:main']['contact_name'], catalog.contact_name)

        response = self.client.get(reverse('catalog:csw_by_slug', args=[
                                   catalog.slug]) + '?SERVICE=CSW&REQUEST=GetCapabilities')
        self.assertEqual(response.status_code, 200)

    def test_inspire(self):
        """Test inspire capabilities"""

        catalog, is_new = Catalog.objects.get_or_create(
            name='catalogtest_global')
        for inspire_field in catalog.inspire_required_fields().keys():
            setattr(catalog, inspire_field, 'a value' if inspire_field.find('date') < 0 else datetime.datetime.now())

        catalog.inspire_temp_extent = '1910-01-01/2119-01-01'
        catalog.inspire_conformity_service = 'conformant'
        catalog.inspire_contact_email = 'email@mail.com'
        catalog.inspire_gemet_keywords = ['Atmospheric conditions', 'Cadastral parcels']
        catalog.inspire_languages_supported = ['ita', 'dan' , 'fre']
        catalog.inspire_default_language = 'ita'
        catalog.inspire_geographical_extent = '9 45 7 46'
        catalog.inspire_enabled = True

        catalog.save()
        response = self.client.get(reverse('catalog:csw_by_slug', args=[
                                   catalog.slug]) + '?&VERSION=2.0.2&SERVICE=CSW&REQUEST=GetCapabilities')
        self.assertEqual(response.status_code, 200)
        self.assertTrue('inspire_ds:ExtendedCapabilities'.encode() in response.content)

        # Validate schema
        # This is very slow: skip with env var "SKIP_SCHEMA_VALIDATION"
        if not os.environ.get('SKIP_SCHEMA_VALIDATION'):
            xmldoc = etree.fromstring(response.content)
            xmlschema = etree.XMLSchema(file=os.path.join(os.path.dirname(__file__), 'schema_wrappers/getcapabilities_2_0_2.xsd'))
            xmlschema.assertValid(xmldoc)

        # Now test disabled:
        catalog.inspire_enabled = False
        catalog.save()
        response = self.client.get(reverse('catalog:csw_by_slug', args=[
                                   catalog.slug]) + '?SERVICE=CSW&REQUEST=GetCapabilities')
        self.assertEqual(response.status_code, 200)
        self.assertFalse('inspire_ds:ExtendedCapabilities'.encode() in response.content)

