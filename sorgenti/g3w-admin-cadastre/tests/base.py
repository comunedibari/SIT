# coding=utf-8
"""
Test base module for cadastre
.. note:: This program is free software; you can redistribute it and/or modify
     it under the terms of the Mozilla Public License 2.0.
"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2019-10-24'
__copyright__ = 'Copyright 2019, GIS3W'

from django.test import override_settings, TestCase
from django.core.files import File
from core.models import Group as CoreGroup, G3WSpatialRefSys
from usersmanage.models import User, Group as UserGroup, GroupRole
from qdjango.utils.data import QgisProject
from qdjango.models import Layer
import os

CURRENT_PATH = os.getcwd()
TEST_BASE_PATH = '{}/cadastre/tests/data/'.format(CURRENT_PATH)
QGS_TEST_BASE_PATH = '/qdjango/tests/data/'
DATASOURCE_PATH = '{}{}un-progetto-data'.format(CURRENT_PATH, QGS_TEST_BASE_PATH)

# DOCFA TEST DATA
TEST_DOCFA_ZIP = 'docfa/DOCFA_2016_01.zip'
TEST_VALIDATE_NOT_ALL_FILE_DOCFA_ZIP = 'docfa/test_validate_not all_file_fornitura_DOCFA.zip'
TEST_VALIDATE_NOT_CORRECT_NUMERATION_FILE_DOCFA_ZIP = 'docfa/test_validate_not_correct_numeration_fornitura_DOCFA.zip'
TEST_VALIDATE_DIFFERENT_COMUNE_FILE_DOCFA_ZIP = 'docfa/test_validate_different_comune_fornitura_DOCFA.zip'
TEST_VALIDATE_NOT_CORRECT_FILENAME_FILE_DOCFA_ZIP = 'docfa/test_validate_name_docfa_file.zip'
QGS_FILE = 'gruppo-1_un-progetto_qgis34.qgs'
CADASTRE_QGS_FILE = 'test_cadastre.qgs'
CADASTRE_QGS_FILE_2 = 'test_cadastre_2_layers.qgs'

CODICE_COMUNE = 'D891' #Gambara
CODICE_COMUNE2 = 'B648' #Capannori


@override_settings(
    CACHES={
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'some',
        }
    },
    DATASOURCE_PATH=TEST_BASE_PATH,
    G3WADMIN_LOCAL_MORE_APPS=[
        'cadastre',
    ],
    LANGUAGE_CODE='it',
    LANGUAGES=(
        ('it', 'Italiano'),
    )
)
class CadastreTestsBase(TestCase):
    """ Cadastre test class base"""

    fixtures = [
                'BaseLayer.json',
                'G3WMapControls.json',
                'G3WSpatialRefSys.json',
                'G3WGeneralDataSuite.json',
                'Test_IstatCodiciUi.json'
                ]

    databases = '__all__'

    @classmethod
    def setUpTestData(cls):

        # Admin level 1
        cls.test_user_admin1 = User.objects.create_user(username='admin01', password='admin01')
        cls.test_user_admin1.is_superuser = True
        cls.test_user_admin1.save()

        # Editor Level 1
        cls.test_user_editor1 = User.objects.create_user(username='user_editor1', password='user_editor1')
        cls.editor_group1 = UserGroup.objects.get(name='Editor Level 1')
        cls.test_user_editor1.groups.add(cls.editor_group1)
        cls.test_user_editor1.save()

        # Editor Level 2
        cls.test_user_editor2 = User.objects.create_user(username='user_editor2', password='user_editor2')
        cls.editor_group2 = UserGroup.objects.get(name='Editor Level 2')
        cls.test_user_editor2.groups.add(cls.editor_group2)
        cls.test_user_editor2.save()

        # User Group Editor
        cls.user_group_editor_a = UserGroup(name='User Group Editor A')
        cls.user_group_editor_a.save()
        GroupRole(group=cls.user_group_editor_a, role='editor').save()
        cls.test_user_editor2.groups.add(cls.user_group_editor_a)

        # Viewer Level 1
        cls.test_user_viewer1 = User.objects.create_user(username='user_viewer1', password='user_viewer1')
        cls.viewer_group1 = UserGroup.objects.get(name='Viewer Level 1')
        cls.test_user_viewer1.groups.add(cls.viewer_group1)
        cls.test_user_viewer1.save()

        cls.test_user_viewer2 = User.objects.create_user(username='user_viewer2', password='user_viewer2')
        cls.test_user_viewer2.groups.add(cls.viewer_group1)
        cls.test_user_viewer2.save()

        # User Group Viewer
        cls.user_group_viewer_a = UserGroup(name='User Group Viewer A')
        cls.user_group_viewer_a.save()
        GroupRole(group=cls.user_group_viewer_a, role='viewer').save()
        cls.test_user_viewer1.groups.add(cls.user_group_viewer_a)

        # main project group
        cls.project_group = CoreGroup(name='Group1', title='Group1', header_logo_img='',
                                      srid=G3WSpatialRefSys.objects.get(auth_srid=3003))
        cls.project_group.save()

        qgis_project_file = File(open('{}{}'.format(TEST_BASE_PATH, CADASTRE_QGS_FILE), 'r'))
        cls.project = QgisProject(qgis_project_file)
        cls.project.title = 'A project'
        cls.project.group = cls.project_group
        cls.project.save()

        qgis_project_file_2l = File(open('{}{}'.format(TEST_BASE_PATH, CADASTRE_QGS_FILE_2), 'r'))
        cls.project2l = QgisProject(qgis_project_file_2l)
        cls.project2l.title = 'A project with 2 layers'
        cls.project2l.group = cls.project_group
        cls.project2l.save()