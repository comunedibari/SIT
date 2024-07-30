# coding=utf-8
""""Eleprofile base module test.

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2020-07-09'
__copyright__ = 'Copyright 2015 - 2020, Gis3w'

from django.test import override_settings
from django.core.files import File
from qdjango.tests.base import \
    QdjangoTestBase, \
    CoreGroup, \
    G3WSpatialRefSys, \
    QgisProject
import os

CURRENT_PATH = os.getcwd()
TEST_BASE_PATH = '/eleprofile/tests/data/'
DATASOURCE_PATH = f'{CURRENT_PATH}{TEST_BASE_PATH}geodata'
QGS_FILE = 'elevation_profile_test.qgs'

@override_settings(
    DATASOURCE_PATH=DATASOURCE_PATH,
    LANGUAGE_CODE='en',
    LANGUAGES = (
        ('en', 'English'),
    )
)
class EleprofileTestBase(QdjangoTestBase):

    @classmethod
    def setUpTestData(cls):
        # main project group
        cls.project_group = CoreGroup(name='GroupEleProfile', title='GroupEleProfile', header_logo_img='',
                                      srid=G3WSpatialRefSys.objects.get(auth_srid=3857))

        cls.project_group.save()

        qgis_project_file = File(open('{}{}{}'.format(CURRENT_PATH, TEST_BASE_PATH, QGS_FILE), 'r'))
        cls.project = QgisProject(qgis_project_file)
        cls.project.group = cls.project_group
        cls.project.save()
