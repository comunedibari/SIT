# coding=utf-8
""""Geolocalexls views

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2021-06-09'
__copyright__ = 'Copyright 2015 - 2021, Gis3w'


from django.views.generic import edit, TemplateView
from django.urls import reverse
from .forms import GeolocaleXlsForm, Geolocation

import logging

logger = logging.getLogger('geolocalexls')


class GeolocaleXlsView(edit.FormView):

    template_name = "geolocalexls/gelocale_form.html"
    form_class = GeolocaleXlsForm

    def get_success_url(self):
        return reverse("geolocalexls:geolocate")

    def form_valid(self, form):

        # geolocation input_data
        try:
            geolocation = form.geolocation if form.geolocation else Geolocation(**form.cleaned_data)
            geolocation.geolocate()

            return geolocation.export_shp()
        except Exception as e:
            logger.error(e)
            return self.render_to_response(self.get_context_data(form=form, errors=e))


class GeolocaleXlsActionView(TemplateView):

    template_name = "geolocalexls/gelocale_action.html"


class LoadDataInfoView(TemplateView):
    """
    View to show info html for load data
    """
    template_name = 'geolocalexls/loaddatainfo.html'




