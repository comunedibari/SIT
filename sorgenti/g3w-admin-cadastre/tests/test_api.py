# coding=utf-8
"""
   Test cadastre module API.
.. note:: This program is free software; you can redistribute it and/or modify
     it under the terms of the Mozilla Public License 2.0.
"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2019-12-04'
__copyright__ = 'Copyright 2019, GIS3W'

from django.test import override_settings
from django.urls import reverse
from rest_framework.test import APIClient
from .base import CadastreTestsBase, CODICE_COMUNE2
from cadastre.models import Config
from cadastre.configs import CADASTRE_LAYERS
import json


class CadastreAPItests(CadastreTestsBase):

    @override_settings(
        G3W_CLIENT_SEARCH_ENDPOINT='ows',
        CADASTRE_SEARCHES=['CF']
    )
    def test_initconfig_plugin_start(self):
        """ test plugin section of init map gropu api"""

        # create instance config
        config = Config(project=self.project.instance, codice_comune=CODICE_COMUNE2)
        config.save()

        # api client instance
        client = APIClient()
        self.assertTrue(client.login(username=self.test_user_admin1.username, password=self.test_user_admin1.username))

        url = reverse('group-map-config', args=[self.project_group.slug, 'qdjango', self.project.instance.pk])

        response = client.get(url)
        self.assertEqual(response.status_code, 200)
        jcontent = json.loads(response.content)

        # check 'cadastre' into plugins section
        self.assertTrue('cadastre' in jcontent['group']['plugins'])

        plugin = jcontent['group']['plugins']['cadastre']

        # check gid
        self.assertEqual(plugin['gid'], 'qdjango:{}'.format(self.project.instance.pk))

        # check 'details' section
        self.assertEqual(plugin['details']['fabbricato']['url'],
                         reverse('cadastre-api-fabbricato', args=[self.project.instance.pk]))

        # cxf table config is not set so it used default layer name from config
        layer_catasto = self.project.instance.layer_set.filter(origname=list(CADASTRE_LAYERS.keys())[0])[0]

        # check 'layers' section
        self.assertEqual(plugin['layers']['catasto'][0]['id'], layer_catasto.qgs_layer_id)

        # call to api map
        url = reverse('group-project-map-config', args=[
            self.project_group.slug,
            'qdjango',
            self.project.instance.pk
        ])

        response = client.get(url)
        self.assertEqual(response.status_code, 200)
        jcontent = json.loads(response.content)

        # check for search section
        ids_search = {s['id']: s for s in jcontent['search']}
        self.assertTrue('catasto_data_by_cf' in ids_search.keys())

        # check for search options
        options = ids_search['catasto_data_by_cf']['options']
        self.assertEqual(options['layerid'], options['querylayerid'])
        self.assertEqual(options['layerid'], layer_catasto.qgs_layer_id)

        search_by_cf_url = reverse('cadastre-searchbycf', args=[self.project.instance.pk])
        self.assertEqual(options['queryurl'], search_by_cf_url)

        # NO CADASTRE SEARCH SETTINGS
        # ---------------------------

        with self.settings(CADASTRE_SEARCHES=[]):
            response = client.get(url)
            self.assertEqual(response.status_code, 200)
            jcontent = json.loads(response.content)

            # check for search section
            ids_search = {s['id']: s for s in jcontent['search']}
            self.assertFalse('catasto_data_by_cf' in ids_search.keys())
            self.assertFalse('catasto_data_by_name_surname' in ids_search.keys())

        # SEARCH SETTINGS = ['CF', 'NS']
        # ---------------------------

        with self.settings(CADASTRE_SEARCHES=['CF', 'NS']):
            response = client.get(url)
            self.assertEqual(response.status_code, 200)
            jcontent = json.loads(response.content)

            # check for search section
            ids_search = {s['id']: s for s in jcontent['search']}
            self.assertTrue('catasto_data_by_cf' in ids_search.keys())
            self.assertTrue('catasto_data_by_name_surname' in ids_search.keys())
            
            cf_search = ids_search['catasto_data_by_cf']
            ns_search = ids_search['catasto_data_by_name_surname']

            self.assertEqual(len(cf_search['options']['filter']), 1)
            self.assertEqual(len(ns_search['options']['filter']), 2)

            self.assertEqual(cf_search['options']['queryurl'], search_by_cf_url)
            self.assertEqual(ns_search['options']['queryurl'], search_by_cf_url)

        # SEARCH SETTINGS = ['NS']
        # Cliente endpoint API
        # ---------------------------

        with self.settings(CADASTRE_SEARCHES=['NS'], G3W_CLIENT_SEARCH_ENDPOINT='api'):
            response = client.get(url)
            self.assertEqual(response.status_code, 200)
            jcontent = json.loads(response.content)

            # check for search section
            ids_search = {s['id']: s for s in jcontent['search']}
            self.assertFalse('catasto_data_by_cf' in ids_search.keys())
            self.assertTrue('catasto_data_by_name_surname' in ids_search.keys())

            ns_search = ids_search['catasto_data_by_name_surname']

            self.assertEqual(ns_search['options']['queryurl'],reverse('cadastre-searchbycf-api',
                                 args=[self.project.instance.pk, layer_catasto.qgs_layer_id]))










