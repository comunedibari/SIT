# coding=utf-8
""""Simplereporting base module test.

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2021-04-12'
__copyright__ = 'Copyright 2015 - 2021, Gis3w'

from django.test import override_settings
from django.core.files import File
from qdjango.tests.base import \
    QdjangoTestBase, \
    CoreGroup, \
    G3WSpatialRefSys, \
    QgisProject
import os

CURRENT_PATH = os.getcwd()
TEST_BASE_PATH = '/simplereporting/tests/data/'
DATASOURCE_PATH = f'{CURRENT_PATH}{TEST_BASE_PATH}geodata'
QGS_FILE = 'for_testing_simplereproting.qgs'

@override_settings(
    DATASOURCE_PATH=DATASOURCE_PATH,
    LANGUAGE_CODE='en',
    LANGUAGES = (
        ('en', 'English'),
    )
)
class SimpleReportingTestBase(QdjangoTestBase):

    @classmethod
    def setUpTestData(cls):
        # main project group
        cls.project_group = CoreGroup(name='GroupSimpleReporting', title='GroupSimpleReporting', header_logo_img='',
                                      srid=G3WSpatialRefSys.objects.get(auth_srid=3857))

        cls.project_group.save()

        qgis_project_file = File(open('{}{}{}'.format(CURRENT_PATH, TEST_BASE_PATH, QGS_FILE), 'r'))
        cls.project = QgisProject(qgis_project_file)
        cls.project.group = cls.project_group
        cls.project.save()
