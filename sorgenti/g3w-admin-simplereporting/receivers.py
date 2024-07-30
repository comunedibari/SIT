# coding=utf-8
""""
    Signal receiver module fo simplereporting.
.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2021-04-12'
__copyright__ = 'Copyright 2015 - 2021, Gis3w'


from django.conf import settings
from django.dispatch import receiver
from core.signals import initconfig_plugin_start
from .models import SimpleRepoProject


@receiver(initconfig_plugin_start)
def set_initconfig_value(sender, **kwargs):
    """
    Set SimpleReporting data for client initconfig api
    """

    # check il project has a simplereporting profile saved
    srp = SimpleRepoProject.objects.filter(project_id=kwargs['project'])

    # if project saved and vector layer for reporting is set
    if len(srp) == 0 or not srp[0].simplerepo_layer.layer:
        return None

    if not sender.request.user.has_perm('qdjango.change_layer', srp[0].simplerepo_layer.layer):
        return None

    return {
        'simplereporting': {
            'gid': f"qdjango:{kwargs['project']}",
            'tool_position': getattr(settings, 'SIMPLEREPORTING_TOOL_POSITION', 'sidebar'),
            'plugins': {
                'editing': {
                    'visible': sender.request.user.pk != None
                },
            },
            'layers': [
                {
                    'qgs_layer_id': srp[0].simplerepo_layer.layer.qgs_layer_id,
                }
            ]
        }
    }

