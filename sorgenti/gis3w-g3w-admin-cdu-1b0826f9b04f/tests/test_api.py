# coding=utf-8
""""
CDU module test for API
.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2020-10-28'
__copyright__ = 'Copyright 2015 - 2020, Gis3w'


from qdjango.tests.base import QdjangoTestBase, CoreGroup, File, G3WSpatialRefSys, QgisProject, override_settings
from django.urls import reverse
from rest_framework.test import APIClient
from .utils import add_cdu_config
import json
import os

CURRENT_PATH = os.getcwd()
TEST_BASE_PATH = '/cdu/tests/data/'
DATASOURCE_PATH = '{}{}'.format(CURRENT_PATH, TEST_BASE_PATH)
QGS_FILE = 'cdu_test_qgis310.qgs'
ODT_CDU_TEMPLATE = 'template_cdu.odt'


@override_settings(DATASOURCE_PATH=DATASOURCE_PATH)
class CDUTestAPI(QdjangoTestBase):

    @classmethod
    def setUpClass(cls):
        super(CDUTestAPI, cls).setUpClass()

        cls.client = APIClient()

    @classmethod
    def setUpTestData(cls):
        # main project group
        cls.project_group = CoreGroup(name='Group1', title='Group1', header_logo_img='',
                                      srid=G3WSpatialRefSys.objects.get(auth_srid=4326))

        cls.project_group.save()

        qgis_project_file = File(open('{}{}{}'.format(CURRENT_PATH, TEST_BASE_PATH, QGS_FILE), 'r', encoding='utf-8'))

        # Replace name property with only file name without path to simulate UploadedFileWithId instance.
        qgis_project_file.name = qgis_project_file.name.split('/')[-1]
        cls.project = QgisProject(qgis_project_file)
        cls.project.group = cls.project_group
        cls.project.save()
        qgis_project_file.close()

        # Create a CDU profile.
        cls.cdu_config = add_cdu_config(cls.project.instance, open('{}{}{}'.format(CURRENT_PATH, TEST_BASE_PATH, ODT_CDU_TEMPLATE), 'rb'))

    @classmethod
    def tearDownClass(cls):
        cls.project.instance.delete()
        cls.cdu_config.delete()
        super().tearDownClass()

    def _testApiCall(self, view_name, args, kwargs={}, data=None, method='POST', username='admin01'):
        """Utility to make test calls for admin01 user"""

        path = reverse(view_name, args=args)
        if kwargs:
            path += '?'
            parts = []
            for k, v in kwargs.items():
                parts.append(k + '=' + v)
            path += '&'.join(parts)

        # Auth
        self.assertTrue(self.client.login(username=username, password=username))
        if data:
            if method == 'POST':
                response = self.client.post(path, data=data)
            elif method == 'PUT':
                response = self.client.put(path, data=data, content_type='application/json')
            self.assertTrue(response.status_code in (200, 201))
        else:
            if method == 'DELETE':
                response = self.client.delete(path)
                self.assertEqual(response.status_code, 204)
            else:
                response = self.client.get(path)
                self.assertEqual(response.status_code, 200)
        self.client.logout()
        return response

    def test_initconfig_plugin_start(self):
        """Test data added to API client config"""

        response = self._testApiCall('group-map-config',
                      args=[self.project_group.slug, 'qdjango', self.project.instance.pk])

        jcontent = json.loads(response.content)

        # check qplotly into plugins section
        self.assertTrue('cdu' in jcontent['group']['plugins'])

        plugin = jcontent['group']['plugins']['cdu']

        self.assertEqual(plugin['gid'], 'qdjango:{}'.format(
            self.project.instance.pk))

        self.assertEqual(len(jcontent['group']['plugins']['cdu']['configs']), 1)

        c = jcontent['group']['plugins']['cdu']['configs'][0]

        # check main config data

        self.assertEqual(c['id'], self.cdu_config.pk)
        self.assertEqual(c['name'], 'CDU TEST')
        self.assertEqual(c['api'], reverse('cdu-api-calculate-id', kwargs={'id': self.cdu_config.pk}))
        self.assertEqual(c['docurl'], reverse('cdu-config-createdoc', kwargs={'id': self.cdu_config.pk}))
        self.assertEqual(c['uploadurl'], reverse('cdu-upload'))
        self.assertEqual(c['layerCatasto'], self.cdu_config.layer_catasto().layer.qgs_layer_id)
        self.assertEqual(c['outputformat'], self.cdu_config.output_format)
        self.assertEqual(c['map_image'], self.cdu_config.map_image)

        # check search section
        search = {
            'id': 'CDU TEST',
            'name': 'Ricerca per foglio e particella catastali',
            'options': {
                'layerid': self.cdu_config.layer_catasto().layer.qgs_layer_id,
                'querylayerid': self.cdu_config.layer_catasto().layer.qgs_layer_id,
                'queryurl': None,
                'filter': [
                    {
                        'attribute': self.cdu_config.layer_catasto().getFieldFoglio(),
                        'op': 'eq',
                        'label': self.cdu_config.layer_catasto().getAliasFieldsCatasto()['foglio'],
                        'input': {
                            'type': 'textfield',
                            'options': {
                                'blanktext': ''
                            }
                        },
                        'logicop': 'AND'
                    },
                    {
                        'attribute': self.cdu_config.layer_catasto().getFieldParticella(),
                        'op': 'eq',
                        'label': self.cdu_config.layer_catasto().getAliasFieldsCatasto()['particella'],
                        'input': {
                            'type': 'textfield',
                            'options': {
                                'blanktext': ''
                            }
                        },
                        'logicop': 'AND'
                    },
                    {
                        'attribute': self.cdu_config.layer_catasto().getFieldSezione(),
                        'op': 'eq',
                        'label': self.cdu_config.layer_catasto().getAliasFieldsCatasto()['sezione'],
                        'input': {
                            'type': 'textfield',
                            'options': {
                                'blanktext': ''
                            }
                        },
                        'logicop': 'AND'
                    }
                ]
            },

        }

        self.assertEqual(c['search'], search)

        # check layer against
        self.assertEqual(len(c['results']['layers']), 1)

        a_layers = self.cdu_config.layers_against()
        a_layer = a_layers[0]

        layer = {
            'tessuti_definitivo4_oss': {
                'name': 'tessuti_definitivo4_oss',
                'title': 'Tessuti definitivo4 oss',
                'id': a_layer.layer.qgs_layer_id,
                'fields': a_layer.getLayerFieldsData()
            }
        }

        self.assertEqual(c['results']['layers'][0], layer)








