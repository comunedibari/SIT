# coding=utf-8
""""Base class for catalog tests

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

"""

__author__ = 'elpaso@itopen.it'
__date__ = '2019-01-14'
__copyright__ = 'Copyright 2019, Gis3W'


from django.test import TransactionTestCase
from django.test.client import RequestFactory, Client
from django.http import HttpResponse
from django.core.management import call_command
from django.core.exceptions import ValidationError
from django.utils import translation
from django.conf import settings

from catalog.models import Catalog, Record
from core.models import Group, MacroGroup, G3WSpatialRefSys
from usersmanage.models import User, Group as UserGroup
from django.test.utils import override_settings


class BaseCatalogTestCase(TransactionTestCase):

    __record_counter = 0

    @classmethod
    def record_factory(cls, groups=[], object_id=None, identifier_prefix='catalogtest'):
        """Test factory for records"""
        cls.__record_counter += 1
        return [
            {
                'identifier': "%s.%s" % (identifier_prefix, cls.__record_counter),
                'typename': 'type_1',
                'service_type': 'WMS',
                'service_type_version': '1.1.0',
                'source': 'http://localhost/ows/',
            }
        ]

    @classmethod
    def setUpClass(cls):
        """Setup"""

        # Log all queries settings.DEBUG = True
        Catalog.unregister_all()
        translation.activate(settings.LANGUAGE_CODE[:2])

        # TransactionTestcase does not call setUpTestData

        # Usersers
        # Admin level 1
        cls.test_user_admin1 = User.objects.create_user(username='admin01', password='admin01')
        cls.test_user_admin1.is_superuser = True
        cls.test_user_admin1.save()

        # Editor level 1
        cls.test_user1 = User.objects.create_user(username='user1', password='user1')
        cls.group = UserGroup.objects.get(name='Editor Level 1')
        cls.test_user1.groups.add(cls.group)
        cls.test_user1.save()

        super(BaseCatalogTestCase, cls).setUpClass()

    def setUp(self):
        """Creates helper objects for the tests"""
        # Get or create a srid
        srid, _ = G3WSpatialRefSys.objects.get_or_create(srid=4326, auth_srid=4326, auth_name='EPSG')
        srid.proj4text= " +proj=longlat +datum=WGS84 +no_defs"
        srid.stext  = 'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]"'
        srid.save()
        self.group, _ = Group.objects.get_or_create(name='catalogtest_group', srid=srid)
        self.group.save()
        self.child_group, _ = Group.objects.get_or_create(name='catalogtest__child_group', srid=srid)
        self.child_group.save()
        self.macrogroup, _ = MacroGroup.objects.get_or_create(title='catalogtest_macro_group')
        self.macrogroup.save()
        self.child_group.macrogroups.add(self.macrogroup)


    @classmethod
    def tearDownClass(cls):
        """Cleanup groups"""
        # Cleanup
        super(BaseCatalogTestCase, cls).tearDownClass()

    def tearDown(self):
        """Cleanup catalogs"""
        super(BaseCatalogTestCase, self).tearDown()
        # Make some groups and macrogroups
        Group.objects.filter(name__startswith='catalogtest_').delete()
        MacroGroup.objects.filter(title__startswith='catalogtest_').delete()
        Catalog.objects.filter(name__startswith='catalogtest_').delete()
        Catalog.unregister_all()
