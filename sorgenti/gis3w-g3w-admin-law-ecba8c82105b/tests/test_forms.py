# coding=utf-8
"""
    Test law module forms
.. note:: This program is free software; you can redistribute it and/or modify
     it under the terms of the Mozilla Public License 2.0.
"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2019-06-19'
__copyright__ = 'Copyright 2019, GIS3W'


from django.test.client import RequestFactory
from django.urls import reverse
from usersmanage.models import User
from law.forms import LawForm
from .base import BaseLawTestCase


class LawFormsTests(BaseLawTestCase):

    def setUp(self):

        test_user1 = User.objects.get(username='admin01')

        self.request = RequestFactory()
        self.request.user = test_user1

    def test_permissions_law(self):

        form = LawForm(request=self.request)

        self.assertFalse(form.is_valid())

        test_editor1 = User.objects.get(username='editor1')
        test_editor2 = User.objects.get(username='editor2')
        test_viewer1 = User.objects.get(username='viewer1')

        form_data = {
            'name': 'Test permission law',
            'description': 'Test',
            'fromdate': '01/01/1970',
            'todate': '10/01/1970',

            'editor_user': test_editor1.pk,
            'editor2_user': test_editor2.pk,
            'viewer_users': [test_viewer1.pk]

        }

        form = LawForm(data=form_data, request=self.request)
        self.assertTrue(form.is_valid())

        law = form.save()

        self.assertTrue(test_editor1.has_perm('law.change_laws', law))
        self.assertTrue(test_editor1.has_perm('law.delete_laws', law))
        self.assertTrue(test_editor1.has_perm('law.manage_articles', law))
        self.assertTrue(test_editor1.has_perm('law.view_laws', law))

        self.assertTrue(test_editor2.has_perm('law.manage_articles', law))
        self.assertTrue(test_editor2.has_perm('law.view_laws', law))

        self.assertTrue(test_viewer1.has_perm('law.view_laws', law))

        form_data.pop('editor_user')
        kwargs = {
            'initial': {
                'editor_user': test_editor1.pk,
                'editor2_user': test_editor2.pk
            }
        }
        form = LawForm(data=form_data, request=self.request, instance=law, **kwargs)
        self.assertTrue(form.is_valid())
        law = form.save()

        self.assertFalse(test_editor1.has_perm('law.change_laws', law))

