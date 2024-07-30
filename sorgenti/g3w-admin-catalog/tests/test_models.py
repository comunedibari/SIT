# coding=utf-8
""""Tests for Catalog

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

"""

__author__ = 'elpaso@itopen.it'
__date__ = '2019-01-12'
__copyright__ = 'Copyright 2019, Gis3w'

import datetime

from django.core.exceptions import ValidationError
from django.core.management import call_command
from django.http import HttpResponse
from django.test import TestCase
from django.test.client import Client, RequestFactory

from catalog.models import Catalog, Record
from core.models import G3WSpatialRefSys, Group, MacroGroup

from .base import BaseCatalogTestCase


class CatalogTestCase(BaseCatalogTestCase):

    def test_catalog_model_validation(self):
        """Test that the scope and the fks are checked"""

        # Check default scope (global)
        catalog, is_new = Catalog.objects.get_or_create(
            name='catalogtest_global')
        assert is_new

        with self.assertRaises(ValidationError):
            catalog.scope = Catalog.SCOPE.GROUP
            catalog.save()

        with self.assertRaises(ValidationError):
            catalog.scope = Catalog.SCOPE.MACROGROUP
            catalog.save()

        with self.assertRaises(ValidationError):
            catalog, _ = Catalog.objects.get_or_create(
                name='catalogtest_group', scope=Catalog.SCOPE.GROUP)

        with self.assertRaises(ValidationError):
            catalog, _ = Catalog.objects.get_or_create(
                name='catalogtest_macrogroup', scope=Catalog.SCOPE.MACROGROUP)

        catalog.inspire_enabled = True
        with self.assertRaises(ValidationError):
            catalog.save()

        for inspire_field in catalog.inspire_required_fields().keys():
            setattr(catalog, inspire_field, 'a value')
        catalog.inspire_enabled = True
        catalog.inspire_date = datetime.datetime.now()
        catalog.identification_abstract = "Some words"
        catalog.identification_title = "Some title"
        catalog.scope = Catalog.SCOPE.GLOBAL
        catalog.inspire_geographical_extent = '9 45 7 46'
        catalog.save()

    def test_catalog_manager(self):
        """Test is_active manager"""

        # Check default scope (global)
        catalog, is_new = Catalog.objects.get_or_create(
            name='catalogtest_global_active')
        assert is_new
        catalog, is_new = Catalog.objects.get_or_create(
            name='catalogtest_global_not_active', is_active=False)
        assert is_new

        self.assertEquals(Catalog.objects.filter(
            name__startswith='catalogtest_').count(), 2)
        self.assertEquals(Catalog.active.filter(
            name__startswith='catalogtest_').count(), 1)

    def test_catalog_records(self):
        """Test that the scope and the fks are checked"""

        # Check default scope (global)
        catalog, is_new = Catalog.objects.get_or_create(
            name='catalogtest_global')
        assert is_new

        self.assertEqual(catalog.record_set.count(), 0)
        Catalog.register_catalog_record_provider(self.record_factory,
                                                 scope=Catalog.SCOPE.GROUP)

        # Rebuild the catalog
        catalog.invalidate()
        self.assertEqual(catalog.record_set.count(), 1)

        # Check new adding catalog correct
        record = catalog.record_set.all()[0]
        self.assertEqual(record.catalog, catalog)

        # Check XML
        self.assertEqual(catalog.record_set.all()[0].xml, '')

    def test_inspire(self):
        """Test inspire fields and validation"""

        catalog, is_new = Catalog.objects.get_or_create(
            name='catalogtest_global')
        catalog.inspire_enabled = True
        with self.assertRaises(ValidationError):
            catalog.save()
        for inspire_field in catalog.inspire_required_fields().keys():
            setattr(catalog, inspire_field, 'a value')
        catalog.inspire_enabled = True
        catalog.inspire_date = datetime.datetime.now()
        catalog.inspire_geographical_extent = '9 45 7 46'
        catalog.save()

    def test_rndt(self):
        """Test RNDT fields and validation"""

        catalog, is_new = Catalog.objects.get_or_create(
            name='catalogtest_global')
        catalog.rndt_enabled = True
        with self.assertRaises(ValidationError):
            catalog.save()
        for rndt_field in catalog.rndt_fields().keys():
            setattr(catalog, rndt_field, 'a value')

        # RNDT implies inspire
        catalog.inspire_enabled = False
        catalog.rndt_enabled = True
        with self.assertRaises(ValidationError):
            catalog.save()

        for inspire_field in catalog.inspire_required_fields().keys():
            setattr(catalog, inspire_field, 'a value')
        catalog.inspire_enabled = False  # Will be set automatically from clean()
        catalog.inspire_date = datetime.datetime.now()
        catalog.identification_abstract = "Some words"
        catalog.inspire_geographical_extent = '9 45 7 46'
        catalog.save()
