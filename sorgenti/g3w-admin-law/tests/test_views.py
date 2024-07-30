# coding=utf-8
"""
    Test law module views
.. note:: This program is free software; you can redistribute it and/or modify
     it under the terms of the Mozilla Public License 2.0.
"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2019-06-19'
__copyright__ = 'Copyright 2019, GIS3W'


from django.test.client import Client
from django.urls import reverse
from law.models import Laws
from .base import BaseLawTestCase


class LawViewsTests(BaseLawTestCase):

    def setUp(self):

        self.client = Client()

    def test_create_law(self):
        """
        Test creation of anew law
        :return:
        """

        # test login perform
        login = self.client.login(username='admin01', password='admin01')
        self.assertTrue(login)

        url = reverse('law-add')

        # create post
        post_data = {
            'name': u'Law for testing',
            'description': u'A new law for testing framework',
            'fromdate': '01/01/1970',
            'todate': '10/01/1970',
        }

        response = self.client.post(url, post_data)

        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.url, reverse('law-list'))

        # check data save
        laws = Laws.objects.filter(name=post_data['name'])

        self.assertEqual(len(laws), 1)
