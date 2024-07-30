# coding=utf-8
""""
    Models utilities for SimpleReporting module.
.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2021-04-12'
__copyright__ = 'Copyright 2015 - 2021, Gis3w'

from qdjango.models import Layer
from guardian.shortcuts import get_objects_for_user, get_anonymous_user
from simplereporting.models import GEO_TYPE_VECTOR_LAYER_ALLOWED
from editing.models import G3WEditingLayer


def get_editing_layer_ids(project):
    """
    Get list of layer ids with editing state activated

    :param project: Qdjango project instance
    :return: Lsit of qdjango layer ids
    """

    return [l.layer_id for l in
            G3WEditingLayer.objects.filter(app_name='qdjango', layer_id__in=[l.pk for l in project.layer_set.all()])]


def allowed_layers_for_reporting(simplerepo_layer):
    """
    Return queryset of layer available reporting vector layer:
    only layer in `editing` mode and with geometry type = GEO_TYPE_VECTOR_LAYER_ALLOWED

    :param simplerepo_layer: SimpleReporting layer model instance
    :return: Qdjango Layer model QuerySet
    """

    return Layer.objects.filter(
            project=simplerepo_layer.simplerepo_project.project,
            geometrytype__in=GEO_TYPE_VECTOR_LAYER_ALLOWED,
            pk__in=get_editing_layer_ids(simplerepo_layer.simplerepo_project.project)
        )
