# coding=utf-8
""""Test for Catalog async tasks

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

"""

__author__ = 'elpaso@itopen.it'
__date__ = '2019-01-14'
__copyright__ = 'Copyright 2019, Gis3w'



from django.test import TestCase
from django.test.client import RequestFactory, Client
from django.http import HttpResponse
from django.core.management import call_command
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models.signals import post_save, post_delete
from django.core.management import call_command

from catalog.models import Catalog, Record

from core.models import Group, MacroGroup, G3WSpatialRefSys
from .base import BaseCatalogTestCase


class TasksTestCase(BaseCatalogTestCase):

    def test_invalidate_all_catalogs(self):
        """Test that the invalidate_all_catalogs task runs with no errors,
        and returns the correct result."""

        catalog, is_new = Catalog.objects.get_or_create(name='cswtest_global')

        self.assertEqual(catalog.record_set.count(), 0)
        Catalog.register_catalog_record_provider(self.record_factory,
                                      scope=Catalog.SCOPE.GROUP)
        self.assertEqual(catalog.record_set.count(), 0)
        catalog.record_set.all().delete()
        self.assertEqual(catalog.record_set.count(), 0)
        self.assertFalse(catalog.is_valid)

        call_command('regenerate_catalogs')

        catalog = Catalog.objects.all()[0]
        self.assertTrue(catalog.is_valid)
        self.assertEqual(catalog.record_set.count(), 1)

    def test_catalog_provider_signals(self):
        """Test that the provider signals invalidate the catalog"""

        catalog, is_new = Catalog.objects.get_or_create(name='catalogtest_global')
        assert is_new
        self.assertFalse(catalog.is_valid)
        call_command('regenerate_catalogs')
        catalog = Catalog.objects.get(pk=catalog.pk)
        self.assertTrue(catalog.is_valid)

        class TestModel(models.Model):
            class Meta:
                app_label='Catalog'

        class TestModel2(models.Model):
            class Meta:
                app_label='Catalog'

        self.assertEqual(catalog.record_set.count(), 0)
        Catalog.register_catalog_record_provider(self.record_factory,
                                      scope=Catalog.SCOPE.GROUP, senders=[TestModel])

        self.assertEqual(catalog.record_set.count(), 0)
        post_save.send(sender=TestModel)
        catalog = Catalog.objects.get(pk=catalog.pk)
        self.assertFalse(catalog.is_valid)
        call_command('regenerate_catalogs')
        catalog = Catalog.objects.get(pk=catalog.pk)
        self.assertTrue(catalog.is_valid)

        self.assertEqual(catalog.record_set.count(), 1)

        # Trigger invalidate
        post_save.send_robust(sender=TestModel)
        self.assertEqual(catalog.record_set.count(), 1)

        # Clear and check with disconnected model
        catalog.record_set.all().delete()
        self.assertEqual(catalog.record_set.count(), 0)
        post_delete.send(sender=TestModel2)

        self.assertEqual(catalog.record_set.count(), 0)

        # Check with delete
        # Trigger invalidate
        post_delete.send_robust(sender=TestModel)
        call_command('regenerate_catalogs')
        self.assertEqual(catalog.record_set.count(), 1)

