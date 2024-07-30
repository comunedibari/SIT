# coding=utf-8
""""
    Test API SimpleReporting app.
.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2020-04-12'
__copyright__ = 'Copyright 2015 - 2021, Gis3w'


from django.test import Client
from django.urls import reverse
from guardian.shortcuts import assign_perm, get_anonymous_user
from .base import SimpleReportingTestBase

from simplereporting.models import \
    SimpleRepoProject, \
    SimpleRepoLayer, \
    Layer

import json


class SimpleReportingAPIViews(SimpleReportingTestBase):

    def setUp(self):
        self.client = Client()

    def test_initconfig_plugin_start(self):
        """ Test initconfig api"""

        # Create a SimpleReporting project
        srproject = SimpleRepoProject(project=self.project.instance, note="test note")
        srproject.save()

        # Create a reporting vector layer
        simplerepo_layer = Layer.objects.get(name='point')
        srproject.simplerepo_layer.layer = simplerepo_layer
        srproject.simplerepo_layer.save()


        # api client instance
        self.assertTrue(self.client.login(
            username=self.test_admin1.username, password=self.test_admin1.username))

        url = reverse('group-map-config',
                      args=[self.project_group.slug, 'qdjango', self.project.instance.pk])

        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        jcontent = json.loads(response.content)

        # check simplereporting into plugins section
        self.assertTrue('simplereporting' in jcontent['group']['plugins'])

        plugin = jcontent['group']['plugins']['simplereporting']

        # check gid and TYPES
        self.assertEqual(plugin['gid'], 'qdjango:{}'.format(
            self.project.instance.pk))
        self.assertTrue(plugin['plugins']['editing'])

        layers = [
            {
                'qgs_layer_id': simplerepo_layer.qgs_layer_id
            }
        ]
        self.assertEqual(plugin['layers'], layers)

        self.client.logout()

        # check for editing plugin not visible
        # permission to anonymous user to project
        assign_perm('view_project', get_anonymous_user(), self.project.instance)

        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        jcontent = json.loads(response.content)

        self.assertFalse(jcontent['group']['plugins']['simplereporting']['plugins']['editing']['visible'])





