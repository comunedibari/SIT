# coding=utf-8
"""" Geolocalexls mdule urls

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2021-06-09'
__copyright__ = 'Copyright 2015 - 2021, Gis3w'

from django.urls import path
from django.contrib.auth.decorators import login_required
from base.urls import G3W_SITETREE_I18N_ALIAS
from .views import GeolocaleXlsView, GeolocaleXlsActionView, LoadDataInfoView

G3W_SITETREE_I18N_ALIAS.append('geolocalexls')

app_name = 'geolocalexls'

urlpatterns = [
    path('action/', login_required(GeolocaleXlsView.as_view()), name='geolocate'),
    path('action/result', login_required(GeolocaleXlsActionView.as_view()), name='action-result'),

    # info/help
    path('action/info/', login_required(LoadDataInfoView.as_view()), name='loaddata-info'),
]