# -*- coding: utf-8 -*-
from __future__ import unicode_literals, absolute_import
""""Portal module filters

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2019-08-04'
__copyright__ = 'Copyright 2019, Gis3w'


from django.contrib.auth.models import AnonymousUser
from django.urls import resolve
from django.db.models import Q
from rest_framework.filters import BaseFilterBackend
from core.models import *
from qdjango.models import Project


class UserGroupFilter(BaseFilterBackend):
    """A filter backend for portal module"""

    def filter_queryset(self, request, queryset, view):
        """
        Return a filtered queryset by guardian grant
        """
        queryset = get_objects_for_user(request.user, 'core.view_group', Group).order_by('order') \
                 | get_objects_for_user(AnonymousUser(), 'core.view_group', Group).order_by('order')

        return queryset


class UserProjectFilter(BaseFilterBackend):
    """A filter backend for portal module for qdjango project"""

    def filter_queryset(self, request, queryset, view):
        """
        Return a filtered queryset by guardian grant
        """
        queryset = get_objects_for_user(request.user, 'qdjango.view_project', Project).order_by('title') \
                 | get_objects_for_user(AnonymousUser(), 'qdjango.view_project', Project).order_by('title')

        return queryset


class GroupProjectFilter(BaseFilterBackend):
    """A filter backend for portal module for qdjango project , filter by group"""

    def filter_queryset(self, request, queryset, view):
        """
        Return a filtered queryset by group_id
        """
        if 'group_id' in view.kwargs:
            queryset = queryset.filter(group_id=view.kwargs['group_id'])

        return queryset


class MacroGroupGroupFilter(BaseFilterBackend):
    """A filter backend for portal module for group, filter by macrogroup"""

    def filter_queryset(self, request, queryset, view):
        """
        Return a filtered queryset by macrogroup_id
        """
        if 'macrogroup_id' in view.kwargs:
            queryset = queryset.filter(macrogroups__pk=view.kwargs['macrogroup_id'])

        # check for group without macrogroup
        if resolve(request.path_info).url_name == 'portal-group-without-macrogroup-api-list':
            queryset = queryset.filter(macrogroups__pk=None)

        return queryset


class PanoramicProjectFilter(BaseFilterBackend):
    """A filter backend for portal module for qdjango project , filter by not panoramic"""

    def filter_queryset(self, request, queryset, view):

        # get number of project; if only one skip panoramic exclude query:
        if len(queryset) > 1:
            queryset = queryset.filter(~Q(pk__in=[g.project_id for g in GroupProjectPanoramic.objects.all()]))

        return queryset

class ByMacroGroupFilter(BaseFilterBackend):
    """
    A filter to usa a specify MacroGroup as filter for qdjango projects
    """

    def filter_queryset(self, request, queryset, view):

        # Get Groups by specify macrogroup
        groups = Group.objects.filter(macrogroups__name=getattr(settings, 'ALTAMURA_MAGROGROUP_NAME', 'ALTAMURA'))

        if resolve(request.path_info).url_name == 'portal-project-api-list':
            queryset = queryset.filter(group__pk__in=[g.pk for g in groups])

        if resolve(request.path_info).url_name in ('portal-group-api-list', 'portal-group-without-macrogroup-api-list'):
            queryset = queryset.filter(pk__in=[g.pk for g in groups])

        return queryset


class EmptyMacroGroupFilter(BaseFilterBackend):
    """
    return empty list
    """

    def filter_queryset(self, request, queryset, view):
        queryset = queryset.filter(pk=-9999)

        return queryset


