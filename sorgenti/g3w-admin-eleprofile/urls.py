# coding=utf-8
""""

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2020-07-09'
__copyright__ = 'Copyright 2015 - 2020, Gis3w'

from django.urls import path
from django.contrib.auth.decorators import login_required
from base.urls import G3W_SITETREE_I18N_ALIAS
from .views import \
    ProjectsListView, \
    ProjectAddView, \
    ProjectUpdateView, \
    ProjectDeleteView, \
    DTMListView, \
    DTMAddView, \
    DTMUpdateView, \
    DTMDeleteView

# For sitree bar translation
G3W_SITETREE_I18N_ALIAS.append('eleprofile')

urlpatterns = [

    # For projects
    # ------------
    path('projects/', login_required(ProjectsListView.as_view()), name='eleprofile-project-list'),
    path('projects/add/', login_required(ProjectAddView.as_view()), name='eleprofile-project-add'),
    path('projects/update/<int:pk>/', login_required(ProjectUpdateView.as_view()), name='eleprofile-project-update'),
    path('projects/delete/<int:pk>/', login_required(ProjectDeleteView.as_view()), name='eleprofile-project-delete'),

    # For DTM Layers
    path('projects/dtm/<int:eleproproject_pk>/', login_required(DTMListView.as_view()),
         name='eleprofile-dtmlayer-list'),
    path('projects/dtm/<int:eleproproject_pk>/add/', login_required(DTMAddView.as_view()),
         name='eleprofile-dtmlayer-add'),
    path('projects/dtm/<int:eleproproject_pk>/update/<int:pk>/', login_required(DTMUpdateView.as_view()),
         name='eleprofile-dtmlayer-update'),
    path('projects/dtm/<int:eleproproject_pk>/delete/<int:pk>/', login_required(DTMDeleteView.as_view()),
         name='eleprofile-dtmlayer-delete'),
]