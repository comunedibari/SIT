# coding=utf-8
""""Simpolerteporting urls module

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2021-04-08'
__copyright__ = 'Copyright 2015 - 2021, Gis3w'

from django.urls import path
from django.contrib.auth.decorators import login_required
from base.urls import G3W_SITETREE_I18N_ALIAS
from .views import (
    SimpleRepoProjectsListView,
    SimpleRepoProjectAddView,
    SimpleRepoProjectUpdateView,
    SimpleRepoProjectDeleteView,
    SimpleProLayerUpdateView,
    QrcodeGeneratorView
)


# For sitree bar translation
G3W_SITETREE_I18N_ALIAS.append('simplereporting')

urlpatterns = [

    # For projects
    # ------------
    path('projects/', login_required(SimpleRepoProjectsListView.as_view()), name='simplereporting-project-list'),
    path('projects/add/', login_required(SimpleRepoProjectAddView.as_view()), name='simplereporting-project-add'),
    path('projects/update/<int:pk>/', login_required(SimpleRepoProjectUpdateView.as_view()), name='simplereporting-project-update'),
    path('projects/delete/<int:pk>/', login_required(SimpleRepoProjectDeleteView.as_view()), name='simplereporting-project-delete'),

    # For reporting layer
    # -------------------
    path('projects/ropolayer/<int:simplerepoproject_pk>/', login_required(SimpleProLayerUpdateView.as_view()),
         name='simplereporting-layer-update'),

    # For general views
    # -------------------

    # Qrcode
    path('qrcode/', QrcodeGeneratorView.as_view(),
         name='simplereporting-qrcode'),
]