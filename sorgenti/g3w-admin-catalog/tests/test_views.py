# coding=utf-8
"""
Catalog test views
.. note:: This program is free software; you can redistribute it and/or modify
     it under the terms of the Mozilla Public License 2.0.
"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2020-02-26'
__copyright__ = 'Copyright 2020, GIS3W'

from django.test.client import Client
from django.urls import reverse
from .base import BaseCatalogTestCase


class CatalogViewsTestCase(BaseCatalogTestCase):

    def test_acl(self):
        """ Test ACL on admin views """

        # instance client
        client = Client()

        # try anonymous user: login required
        # ========================================================
        url_list = reverse('catalog:csw_index')
        response = client.get(url_list)
        self.assertEqual(response.status_code, 302)

        url_create = reverse('catalog:create')
        response = client.get(url_create)
        self.assertEqual(response.status_code, 302)

        # try editor1 user: denied
        # ========================================================
        self.assertTrue(client.login(username=self.test_user1.username, password=self.test_user1.username))

        response = client.get(url_list)
        self.assertEqual(response.status_code, 403)

        response = client.get(url_create)
        self.assertEqual(response.status_code, 403)

        client.logout()

        # try admin01 user: pass
        # ========================================================
        self.assertTrue(client.login(username=self.test_user_admin1.username, password=self.test_user_admin1.username))

        response = client.get(url_list)
        self.assertEqual(response.status_code, 200)

        response = client.get(url_create)
        self.assertEqual(response.status_code, 200)

        # TODO: add update and delete test?

        client.logout()

