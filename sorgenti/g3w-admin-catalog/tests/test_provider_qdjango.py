# -*- coding: utf-8 -*-
""""Test qdjango catalog records provider

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

"""
from __future__ import unicode_literals

__author__ = 'elpaso@itopen.it'
__date__ = '2019-01-15'
__copyright__ = 'Copyright 2019, Gis3W'

from unittest import skipIf
import os
from django.conf import settings
from django.test import override_settings
from django.contrib.auth.models import AnonymousUser

from .base import BaseCatalogTestCase
from guardian.shortcuts import assign_perm

from qdjango.ows import QDJANGO_TESTDATA_REQUEST
from qdjango.models import Project, Layer
from qdjango.utils.catalog_provider import catalog_provider
from catalog.models import Record, Catalog

@skipIf('qdjango' not in settings.INSTALLED_APPS, 'This test requires qdjango')
@override_settings(QDJANGO_MODE_REQUEST=QDJANGO_TESTDATA_REQUEST)
@override_settings(MEDIA_ROOT=os.path.join(os.path.realpath(os.path.dirname(__file__)), 'testdata'))
@override_settings(G3WADMIN_OWS_TESTDATA_DIR=os.path.join(os.path.realpath(os.path.dirname(__file__)), 'testdata'))
class QDjangoProviderTest(BaseCatalogTestCase):
    """Test QDjango catalog record provider"""

    fixtures = [
        "test_core.json",
        "test_qdjango.json",
    ]

    def setUp(self):
        super(QDjangoProviderTest, self).setUp()
        for project in Project.objects.all():
            assign_perm('view_project', AnonymousUser(), project)
        for layer in Layer.objects.all():
            assign_perm('view_layer', AnonymousUser(), layer)

    def test_qdjango_record_provider(self):
        """Test harvest on all catalogs"""
        Catalog.register_catalog_record_provider(catalog_provider,
                                        scope=Catalog.SCOPE.GROUP,
                                        senders=[Layer])
        catalog, is_new = Catalog.objects.get_or_create(name='catalogtest_global')
        assert is_new
        catalog.invalidate_all_catalogs()

        catalog2, is_new = Catalog.objects.get_or_create(name='catalogtest_global2')
        assert is_new
        catalog2.invalidate_all_catalogs()

        self.assertEqual(catalog.record_set.count(), 2)

        # Check that we have one record with two links, WMS and WFS
        provider = catalog.registry().values()[0]
        records = provider.record_factory()
        self.assertEqual(records[0]['format'], 'image/jpeg,image/png,application/xml')
        self.assertEqual(records[1]['format'], 'image/jpeg,image/png')
        identifiers = sorted([v['identifier'] for v in records])
        self.assertEqual(identifiers, ['ows.qdjango.world.2', 'wms.qdjango.bluemarble.1'])


    def test_qdjango_record_provider_single(self):
        """Test harvest on single catalog"""
        Catalog.register_catalog_record_provider(catalog_provider,
                                        scope=Catalog.SCOPE.GROUP,
                                        senders=[Layer])
        catalog, is_new = Catalog.objects.get_or_create(name='catalogtest_global')
        assert is_new
        self.assertEqual(len(catalog.invalidate()), 2)
        self.assertEqual(catalog.record_set.count(), 2)


    def test_record_changes_are_kept(self):
        """Test that a record change is not invalidated when the catalog changes"""

        Catalog.register_catalog_record_provider(catalog_provider,
                                        scope=Catalog.SCOPE.GROUP,
                                        senders=[Layer])
        catalog, is_new = Catalog.objects.get_or_create(name='catalogtest_global')
        assert is_new
        self.assertEqual(len(catalog.invalidate()), 2)
        self.assertEqual(catalog.record_set.count(), 2)
        record = catalog.record_set.all().order_by('pk')[1]
        record.title = 'new title'
        record.save()
        identifier = record.identifier
        self.assertEqual(len(catalog.invalidate()), 2)
        self.assertEqual(catalog.record_set.count(), 2)
        record = catalog.record_set.get(identifier=identifier)
        self.assertEqual(record.title, 'new title')
