# coding=utf-8
"""
    Test Law base class
.. note:: This program is free software; you can redistribute it and/or modify
     it under the terms of the Mozilla Public License 2.0.
"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2019-06-19'
__copyright__ = 'Copyright 2019, GIS3W'

from django.conf import settings
from django.test import TestCase
from django.utils import translation
from django.apps import apps
from usersmanage.models import User
from usersmanage.configs import G3W_VIEWER1, \
    G3W_VIEWER2, \
    G3W_EDITOR2, \
    G3W_EDITOR1
import os
import ogr
import gdal


class BaseLawTestCase(TestCase):

    fixtures = [
        'law/tests/data/TestLawData.json'
    ]

    @classmethod
    def setUpClass(cls):

        translation.activate(settings.LANGUAGE_CODE[:2])
        super(BaseLawTestCase, cls).setUpClass()

        AuthGroup = apps.get_app_config('auth').get_model('Group')
        Permission = apps.get_app_config('auth').get_model('Permission')
        ContentType = apps.get_app_config('contenttypes').get_model('ContentType')
        Group = apps.get_app_config('core').get_model('Group')

        # add base group to g3w-admin database
        roles = {}
        for gname in (G3W_VIEWER2, G3W_VIEWER1, G3W_EDITOR2, G3W_EDITOR1):
            agroup, created = AuthGroup.objects.get_or_create(name=gname)
            roles[gname] = agroup
            if not created:
                pass


        # give permissions to Editor Level 1
        editorPermission = agroup.permissions.all()
        permissionsToAdd = (
            Permission.objects.get(codename='add_user'),
            Permission.objects.get(codename='add_group', content_type=ContentType.objects.get_for_model(Group)),

        )
        for perm in permissionsToAdd:
            if perm not in editorPermission:
                agroup.permissions.add(perm)

        test_user1 = User.objects.create_user(username='admin01')
        test_user1.set_password('admin01')
        test_user1.is_staff = True
        test_user1.is_superuser = True
        test_user1.save()

        # create editor and viewers, and editor and viewr group
        for euser in ['editor1', 'editor1.2', 'editor1.3']:
            user = User.objects.create_user(username=euser)
            user.set_password(euser)
            user.save()
            user.groups.add(roles[G3W_EDITOR1])

        for euser in ['editor2', 'editor2.2', 'editor2.3']:
            user = User.objects.create_user(username=euser)
            user.set_password(euser)
            user.save()
            user.groups.add(roles[G3W_EDITOR2])

        for euser in ['viewer1', 'viewer1.2', 'viewer1.3']:
            user = User.objects.create_user(username=euser)
            user.set_password(euser)
            user.save()
            user.groups.add(roles[G3W_VIEWER1])



    @classmethod
    def tearDownClass(cls):
        super(BaseLawTestCase, cls).tearDownClass()

    def tearDown(self):
        super(BaseLawTestCase, self).tearDown()
