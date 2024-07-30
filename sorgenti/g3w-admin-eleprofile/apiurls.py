# coding=utf-8
""""
    Apiurls module for eleprofile app.
.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2020-07-14'
__copyright__ = 'Copyright 2015 - 2020, Gis3w'

from django.urls import path
from .api.views import ProfileCalculateApiView


urlpatterns = [
    path('api/calculate/<int:eleprodtm_pk>/', ProfileCalculateApiView.as_view(),
         name='eleprofile-api-calculate-no-fid'),
    path('api/calculate/<int:eleprodtm_pk>/<str:qgs_layer_id>/<int:fid>/', ProfileCalculateApiView.as_view(),
         name='eleprofile-api-calculate-fid'),
]