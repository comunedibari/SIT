# coding=utf-8
"""Eleprofile views module.

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2020-07-09'
__copyright__ = 'Copyright 2015 - 2020, Gis3w'


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
from .models import EleProProject
from .forms import ProjectForm


class ProjectsListView(ListView):
    """List projects view."""
    template_name = 'eleprofile/projects_list.html'
    model = EleProProject

    @method_decorator(permission_required('eleprofile.add_eleproproject', return_403=True))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)


class ProjectAddView(G3WRequestViewMixin, CreateView):
    """
    Create view for eleprofile project
    """
    form_class = ProjectForm
    template_name = 'eleprofile/project_form.html'
    success_url = reverse_lazy('eleprofile-project-list')

    @method_decorator(permission_required('eleprofile.add_eleproproject', return_403=True))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)


class ProjectUpdateView(G3WRequestViewMixin, UpdateView):
    """
    Update view for EleProProject model
    """
    model = EleProProject
    form_class = ProjectForm
    template_name = 'eleprofile/project_form.html'
    success_url = reverse_lazy('eleprofile-project-list')

    editor_permission = ['change_laws', 'view_laws']
    editor2_permission = 'view_laws'
    viewer_permission = 'view_laws'

    @method_decorator(
        permission_required('eleprofile.change_eleproproject', (EleProProject, 'pk', 'pk'), return_403=True))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)


class ProjectDeleteView(G3WAjaxDeleteViewMixin, SingleObjectMixin, View):
    """
    Delete EleProProject model Ajax view
    """
    model = EleProProject

    @method_decorator(
        permission_required('eleprofile.delete_eleproproject', (EleProProject, 'pk', 'pk'), return_403=True))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)