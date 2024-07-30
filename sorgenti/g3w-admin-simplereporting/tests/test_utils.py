# coding=utf-8
""""Testing utile functions for SimpleReporting module.

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2021-04-13'
__copyright__ = 'Copyright 2015 - 2021, Gis3w'


from guardian.shortcuts import assign_perm, get_anonymous_user
from qdjango.models import Layer
from editing.models import G3WEditingLayer
from simplereporting.utils.models import allowed_layers_for_reporting
from simplereporting.models import SimpleRepoProject
from .base import SimpleReportingTestBase


class SimpleReportingUtilsViews(SimpleReportingTestBase):

    def test_allowed_layers_for_reporting(self):
        """Test homonymous function"""

        # Create a SimpleReporting project
        srproject = SimpleRepoProject(project=self.project.instance, note="test note")
        srproject.save()

        # Create a reporting vector layer
        point_layer = Layer.objects.get(name='point')
        line_layer = Layer.objects.get(name='line')
        polygon_layer = Layer.objects.get(name='polygon')

        # non editing state activated no layer into queryset
        qs = allowed_layers_for_reporting(srproject.simplerepo_layer)
        self.assertEqual(len(qs), 0)

        # active editing for line and polygon
        G3WEditingLayer.objects.create(app_name='qdjango', layer_id=point_layer.pk)
        G3WEditingLayer.objects.create(app_name='qdjango', layer_id=polygon_layer.pk)

        # grant anonymous user to point layer
        assign_perm('qjango.change_layer', get_anonymous_user(), point_layer)

        # only point layer into resulting queryset
        qs = allowed_layers_for_reporting(srproject.simplerepo_layer)
        self.assertEqual(len(qs), 1)
        self.assertEqual(qs[0], point_layer)


