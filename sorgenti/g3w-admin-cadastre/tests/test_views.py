# coding=utf-8
"""
    Cadastre test views
.. note:: This program is free software; you can redistribute it and/or modify
     it under the terms of the Mozilla Public License 2.0.
"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2019-12-04'
__copyright__ = 'Copyright 2019, GIS3W'

from django.test import Client
from django.urls import reverse
from cadastre.models import Config
from .base import CadastreTestsBase, CODICE_COMUNE, CODICE_COMUNE2
import json


class CadastreTestView(CadastreTestsBase):

    def test_config_views(self):

        # instace client
        client = Client()
        self.assertTrue(client.login(username=self.test_user_admin1.username, password=self.test_user_admin1.username))

        # Test list page
        url_list = reverse('cadastre-config')
        response = client.get(url_list)
        self.assertEqual(response.status_code, 200)

        # Test empty load form add page
        url = reverse('cadastre-config-add')
        response = client.get(url)
        self.assertEqual(response.status_code, 200)

        # Test create
        url = reverse('cadastre-config-add')
        response = client.post(url, {
            'codice_comune': CODICE_COMUNE,
            'project': self.project.instance.pk,
            'layers': [self.project.instance.layer_set.all()[0].pk]
        })

        # redirect to configs list page
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.url, url_list)
        self.assertEqual(Config.objects.all().count(), 1)
        self.assertEqual(len(Config.objects.all()[0].configlayer_set.all()), 1)

        # Test update
        config = Config.objects.all()[0]
        url = reverse('cadastre-config-update', args=[config.pk])
        response = client.post(url, {
            'id': config.pk,
            'codice_comune': CODICE_COMUNE2,
            'project': self.project.instance.pk,
            'layers': [self.project.instance.layer_set.all()[0].pk]
        })

        # redirect to configs list page
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.url, url_list)
        config.refresh_from_db()
        self.assertEqual(config.codice_comune, CODICE_COMUNE2)

        # Test delete by ajax call
        url = reverse('cadastre-config-delete', args=[config.pk])
        response = client.post(url, {
            'id': config.pk,
        })
        self.assertEqual(response.status_code, 200)
        jcontent = json.loads(response.content)
        self.assertEqual(jcontent['status'], 'ok')
        self.assertEqual(Config.objects.all().count(), 0)


        client.logout()

    def test_layers_config_view(self):
        """Test for LayerConfigView"""

        client = Client()
        url = reverse("cadastre-config-project-layers")

        response = client.get(url)

        # test login_reuired
        self.assertEqual(response.status_code, 302)

        # test 403
        self.assertTrue(client.login(username=self.test_user_editor1.username, password=self.test_user_editor1.username))
        response = client.get(url)
        self.assertEqual(response.status_code, 403)
        client.logout()

        # test response
        self.assertTrue(client.login(username=self.test_user_admin1.username, password=self.test_user_admin1.username))
        url += f'?project_id={self.project.instance.pk}'
        response = client.get(url)

        self.assertEqual(response.status_code, 200)
        jres = json.loads(response.content)

        self.assertEqual(jres, {'layers': [{'id': self.project.instance.layer_set.all()[0].pk, 'text': 'catasto', 'selected': False}]})

        # Check for response with layer selected
        # Create Config instance with layers
        config = Config.objects.create(project=self.project.instance, codice_comune='A662')
        config.configlayer_set.create(layer=self.project.instance.layer_set.all()[0])

        # without config_id parameter
        response = client.get(url)

        self.assertEqual(response.status_code, 200)
        jres = json.loads(response.content)

        self.assertEqual(jres, {'layers': [{'id': self.project.instance.layer_set.all()[0].pk, 'text': 'catasto', 'selected': False}]})

        # wit config_id parameter
        url += f"&config_id={config.pk}"
        response = client.get(url)

        self.assertEqual(response.status_code, 200)
        jres = json.loads(response.content)

        self.assertEqual(jres, {'layers': [{'id': self.project.instance.layer_set.all()[0].pk, 'text': 'catasto', 'selected': True}]})





