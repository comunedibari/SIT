# coding=utf-8
"""

mozilla_django_oidc urls

.. note:: This program is free software; you can redistribute it and/or modify
          it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'elpaso@itopen.it'
__date__ = '2021-10-19'
__copyright__ = 'Copyright 2021, Gis3W'

from django.urls import path, include

app_name = 'oidc'
urlpatterns = [
    path('', include('mozilla_django_oidc.urls')),
]
