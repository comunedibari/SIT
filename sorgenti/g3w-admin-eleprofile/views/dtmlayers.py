# coding=utf-8
""""
    EleProProject dtm layers views.
.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2020-07-13'
__copyright__ = 'Copyright 2015 - 2020, Gis3w'


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
from eleprofile.models import EleProProject, EleProDTM
from eleprofile.forms import DTMForm


class DTMListView(ListView):
    """List DTM layer and path layers view."""

    template_name = 'eleprofile/dtms_list.html'
    model = EleProDTM


    @method_decorator(
        permission_required(
            'eleprofile.change_eleproproject',
            (EleProProject, 'pk', 'eleproproject_pk'),
            return_403=True))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def get_queryset(self):
        """ Get only EleProDTM elements filtered bu eleproproject pk"""

        return EleProDTM.objects.filter(elepro_project_id=self.kwargs['eleproproject_pk'])

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        # add eleproproject_instance
        context['eleproproject'] = EleProProject.objects.get(pk=self.kwargs['eleproproject_pk'])
        return context


class DTMAddView(G3WRequestViewMixin, CreateView):
    """
    Create view for DTM Layer and pth layers project
    """
    form_class = DTMForm
    template_name = 'eleprofile/dtm_form.html'

    @method_decorator(
        permission_required(
            'eleprofile.change_eleproproject',
            (EleProProject, 'pk', 'eleproproject_pk'),
            return_403=True))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()

        # set 'initial' value fo eleproproject
        kwargs['initial']['elepro_project'] = self.kwargs['eleproproject_pk']

        return kwargs

    def get_success_url(self):
        """ Return correct url by Eleproproject instance"""

        return reverse('eleprofile-dtmlayer-list', args=[self.kwargs['eleproproject_pk']])


class DTMUpdateView(G3WRequestViewMixin, UpdateView):
    """
    Update view for DTM Layer and pth layers project
    """
    model = EleProDTM
    form_class = DTMForm
    template_name = 'eleprofile/dtm_form.html'

    @method_decorator(
        permission_required(
            'eleprofile.change_eleproproject',
            (EleProProject, 'pk', 'eleproproject_pk'),
            return_403=True))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()

        # set 'initial' value fo eleproproject
        kwargs['initial']['elepro_project'] = self.kwargs['eleproproject_pk']

        return kwargs

    def get_success_url(self):
        """ Return correct url by Eleproproject instance"""

        return reverse('eleprofile-dtmlayer-list', args=[self.kwargs['eleproproject_pk']])


class DTMDeleteView(G3WAjaxDeleteViewMixin, SingleObjectMixin, View):
    """
    Delete Ajax view for DTM Layer and path layers project
    """
    model = EleProDTM

    @method_decorator(
        permission_required(
            'eleprofile.change_eleproproject',
            (EleProProject, 'pk', 'eleproproject_pk'),
            return_403=True))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)