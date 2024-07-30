# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.apps import AppConfig
from django.core.exceptions import ImproperlyConfigured


class FrontendConfig(AppConfig):
    name = 'frontend'

    def ready(self):
        from django.conf import settings
        settings.TEMPLATES[0]['OPTIONS']['context_processors'].append('frontend.context_processors.add_return_address')
