# coding=utf-8
""""
    Receivers module for eleprofile django app.
.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2020-07-14'
__copyright__ = 'Copyright 2015 - 2020, Gis3w'


from django.dispatch import receiver
from django.urls import reverse
from core.signals import initconfig_plugin_start
from .models import EleProProject


@receiver(initconfig_plugin_start)
def set_initconfig_value(sender, **kwargs):
    """
    Set eleprofile data for client initconfig api
    """

    # check il project has a elevation profile saved
    epp = EleProProject.objects.filter(project_id=kwargs['project'])

    if len(epp) == 0:
        return None

    # get every path layer
    layers = []
    for ep in epp:
        for dtm in ep.dtm_layers.all():
            for l in dtm.layers.all():
                layers.append({
                    'layer_id': l.qgs_layer_id,
                    'api': reverse('eleprofile-api-calculate-no-fid', args=[dtm.pk])
                })

    toret = {
        'eleprofile': {
            'gid': f"qdjango:{kwargs['project']}",
            'layers': layers
        }
    }

    return toret
