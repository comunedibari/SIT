# coding=utf-8
""""SimpleReporting views for reporting vector layers

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
from django.urls import reverse_lazy, reverse
from django.utils.decorators import method_decorator
from guardian.decorators import permission_required
from core.mixins.views import G3WRequestViewMixin, G3WAjaxDeleteViewMixin
from simplereporting.models import SimpleRepoProject, SimpleRepoLayer
from simplereporting.forms import SimpleRepoLayerForm


class SimpleProLayerUpdateView(G3WRequestViewMixin, UpdateView):
    """
    Update view for Reporting Vector Layer
    """
    model = SimpleRepoLayer
    form_class = SimpleRepoLayerForm
    template_name = 'simplereporting/layer_form.html'
    success_url = reverse_lazy('simplereporting-project-list')

    @method_decorator(
        permission_required(
            'simplereporting.change_simplerepoproject',
            (SimpleRepoProject, 'pk', 'simplerepoproject_pk'),
            return_403=True))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def get_object(self, queryset=None):
        return SimpleRepoLayer.objects.get(simplerepo_project_id=self.kwargs.get('simplerepoproject_pk'))
