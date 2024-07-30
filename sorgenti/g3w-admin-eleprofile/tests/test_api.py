# coding=utf-8
""""
    Test API eleprofile app.
.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2020-07-14'
__copyright__ = 'Copyright 2015 - 2020, Gis3w'


from django.test import Client
from django.urls import reverse
from .base import EleprofileTestBase

from eleprofile.models import \
    EleProDTM, \
    EleProProject, \
    Layer

import json


class TestAPIViews(EleprofileTestBase):

    def setUp(self):
        self.client = Client()

    def test_initconfig_plugin_start(self):
        """ Test initconfig api"""

        # Create a eleproproject
        epp = EleProProject(project=self.project.instance, note="test note")
        epp.save()

        # Create a DTM layer
        dtm_layer = Layer.objects.get(name='dtm_3857')
        line_layer = Layer.objects.get(name='paths')

        epdtm = EleProDTM(elepro_project=epp, dtm_layer=dtm_layer, note='note dtm layer for update')
        epdtm.save()
        epdtm.layers.add(line_layer)

        # api client instance
        self.assertTrue(self.client.login(
            username=self.test_admin1.username, password=self.test_admin1.username))

        url = reverse('group-map-config',
                      args=[self.project_group.slug, 'qdjango', self.project.instance.pk])

        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        jcontent = json.loads(response.content)

        # check archiweb into plugins section
        self.assertTrue('eleprofile' in jcontent['group']['plugins'])

        plugin = jcontent['group']['plugins']['eleprofile']

        # check gid and TYPES
        self.assertEqual(plugin['gid'], 'qdjango:{}'.format(
            self.project.instance.pk))

        layers = [
            {
                'api': reverse('eleprofile-api-calculate-no-fid', args=[epdtm.pk]),
                'layer_id': line_layer.qgs_layer_id
            }
        ]
        self.assertEqual(plugin['layers'], layers)

        self.client.logout()

    def test_calculate_rest_api(self):
        """ Test for /eleprofile/api/calculate/ api"""

        # Create a eleproproject
        epp = EleProProject(project=self.project.instance, note="test note")
        epp.save()

        # Create a DTM layer
        dtm_layer = Layer.objects.get(name='dtm_3857')
        line_layer = Layer.objects.get(name='paths')

        epdtm = EleProDTM(elepro_project=epp, dtm_layer=dtm_layer, note='note dtm layer for update')
        epdtm.save()
        epdtm.layers.add(line_layer)

        url = reverse('eleprofile-api-calculate-no-fid', args=[epdtm.pk])

        # not user logged
        response = self.client.get(url)
        self.assertTrue(response.status_code, 200)
        jcontent = json.loads(response.content)

        jres_aspected = {
            "result": False,
            "error": {
                "code": "servererror",
                "message": "A error server is occured!",
                "data": "No qgs_layer_id parameter into url"
            }
        }

        self.assertEqual(jcontent, jres_aspected)

        # no EleProDTM object into Db
        url = reverse('eleprofile-api-calculate-fid', args=[10, line_layer.qgs_layer_id, 1])

        response = self.client.get(url)
        self.assertTrue(response.status_code, 200)
        jcontent = json.loads(response.content)

        jres_aspected = {
            "result": False,
            "error": {
                "code": "servererror",
                "message": "A error server is occured!",
                "data": "DTM project object not found into DB"
            }
        }

        self.assertEqual(jcontent, jres_aspected)

        # no Layer object into DB
        url = reverse('eleprofile-api-calculate-fid', args=[epdtm.pk, 'xxxx', 1])

        response = self.client.get(url)
        self.assertTrue(response.status_code, 200)
        jcontent = json.loads(response.content)

        jres_aspected = {
            "result": False,
            "error": {
                "code": "servererror",
                "message": "A error server is occured!",
                "data": "Layer not set into a profile project"
            }
        }

        self.assertEqual(jcontent, jres_aspected)

        # no Layer Feature found
        url = reverse('eleprofile-api-calculate-fid', args=[epdtm.pk, line_layer.qgs_layer_id, 1000])

        response = self.client.get(url)
        self.assertTrue(response.status_code, 200)
        jcontent = json.loads(response.content)

        jres_aspected = {
            "result": False,
            "error": {
                "code": "servererror",
                "message": "A error server is occured!",
                "data": "Fid not found into layer"
            }
        }

        self.assertEqual(jcontent, jres_aspected)

        # GOOD response
        #============================
        url = reverse('eleprofile-api-calculate-fid', args=[epdtm.pk, line_layer.qgs_layer_id, 1])

        response = self.client.get(url)
        self.assertTrue(response.status_code, 200)
        jcontent = json.loads(response.content)

        self.assertTrue(jcontent['result'])
        self.assertTrue(len(jcontent['profile']) > 0)
        self.assertEqual(jcontent['profile'][0], [
            1210553.2483800442,
            5347217.388365882,
            486.3775243640075,
            0
        ])
        self.assertEqual(jcontent['profile'][-1], [
            1211119.9163129758,
            5347164.652771447,
            461.4100209982926,
            700
        ])





