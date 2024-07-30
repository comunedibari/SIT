# coding=utf-8
""""Simpolerteporting views module

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2021-04-08'
__copyright__ = 'Copyright 2015 - 2021, Gis3w'

from django.views.generic import \
    ListView, \
    CreateView, \
    UpdateView, \
    View
from django.views.generic.detail import SingleObjectMixin
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from guardian.decorators import permission_required
from core.mixins.views import G3WRequestViewMixin, G3WAjaxDeleteViewMixin
from simplereporting.models import SimpleRepoProject
from simplereporting.forms import SimpleRepoProjectForm


class SimpleRepoProjectsListView(ListView):
    """List simple reporting projects view."""
    template_name = 'simplereporting/projects_list.html'
    model = SimpleRepoProject

    @method_decorator(permission_required('simplereporting.add_simplerepoproject', return_403=True))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)


class SimpleRepoProjectAddView(G3WRequestViewMixin, CreateView):
    """
    Create view for single reporting project
    """
    form_class = SimpleRepoProjectForm
    template_name = 'simplereporting/project_form.html'
    success_url = reverse_lazy('simplereporting-project-list')

    @method_decorator(permission_required('simplereporting.add_singlerepoproject', return_403=True))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)


class SimpleRepoProjectUpdateView(G3WRequestViewMixin, UpdateView):
    """
    Update view for SimpleRepoProject model
    """
    model = SimpleRepoProject
    form_class = SimpleRepoProjectForm
    template_name = 'simplereporting/project_form.html'
    success_url = reverse_lazy('simplereporting-project-list')

    @method_decorator(
        permission_required('eleprofile.change_simplerepoproject', (SimpleRepoProject, 'pk', 'pk'), return_403=True))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)


class SimpleRepoProjectDeleteView(G3WAjaxDeleteViewMixin, SingleObjectMixin, View):
    """
    Delete SimpleRepoProject model Ajax view
    """
    model = SimpleRepoProject

    @method_decorator(
        permission_required('eleprofile.delete_simplerepoproject', (SimpleRepoProject, 'pk', 'pk'), return_403=True))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)