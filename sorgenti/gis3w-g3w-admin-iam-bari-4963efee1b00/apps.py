# coding=utf-8
""""

IAM Bari app config

.. note:: This program is free software; you can redistribute it and/or modify
          it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'elpaso@itopen.it'
__date__ = '2021-10-19'
__copyright__ = 'Copyright 2021, Gis3W'


from django.apps import AppConfig
import os


class IamBariConfig(AppConfig):
    name = 'iam_bari'
    verbose_name = "IAM Bari"

    def ready(self):
        from django.conf import settings
        settings.TEMPLATES[0]['DIRS'].insert(
            0, os.path.join(os.path.dirname(__file__), 'templates'))

        settings.AUTHENTICATION_BACKENDS = list(
            settings.AUTHENTICATION_BACKENDS)
        settings.AUTHENTICATION_BACKENDS.append(
            'iam_bari.overrides.oidc_auth_backend.IAMOIDCAB')
