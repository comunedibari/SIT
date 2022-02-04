# coding=utf-8
""""Geolocalexls forms

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2021-06-09'
__copyright__ = 'Copyright 2015 - 2021, Gis3w'


from django.conf import settings
from django import forms
from django.utils.translation import ugettext_lazy as _
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Div, HTML, Row, Field, Hidden
from core.models import G3WSpatialRefSys
from cadastre.models import IstatCodiciUi
from .geolocation import Geolocation, GeolocationValidationError

# Add models for ISTAT code comune is 'cadastre' module is active
if 'cadastre' in settings.G3WADMIN_LOCAL_MORE_APPS:
    from cadastre.models import ConfigImportCxf


import os

import logging

logger = logging.getLogger('geolocalexls')


class GeolocaleFileField(forms.FileField):
    """Custom FileField with validation by file extension"""

    EXTENSIONS = ('.csv', '.xls', '.xlsx')

    def validate(self, value):

        super().validate(value)
        file_extension = os.path.splitext(value.name)[1]
        if file_extension.lower() not in self.EXTENSIONS:
            raise forms.ValidationError(
                 (_('Invalid file extension: only ') + f"{', '.join(self.EXTENSIONS)}"),
                 code='invalid'
            )

FILE_TYPES = [
        ('with_xy', _('With coordinates (x,y)')),
        ('with_addresses', _('With addresses'))
    ]

CSV_SEPARATOR = [
    ('comma', _(", (comma)")),
    ('semicolon', _("; (semicolon)"))
]

if 'cadastre' in settings.G3WADMIN_LOCAL_MORE_APPS:
    FILE_TYPES.append(('with_cadastral', _('With cadastral parcels (sheet, parcels, section)')))


class ComuneCodeModelChoiceField(forms.ModelChoiceField):
    """Custom ModelChoiceField for ISTAT comune code get from ConfigImportCxf Model"""
    def label_from_instance(self, obj):
        icui = IstatCodiciUi.objects.get(codice_catastale_del_comune=obj.codice_comune)
        return f"{icui.denominazione_in_italiano} ({icui.denominazione_provincia}) - {icui.codice_catastale_del_comune}"


class SRIDModelChoiceField(forms.ModelChoiceField):
    """Custom ModelChoiceField for G3WSpatialRefSys Model"""
    def label_from_instance(self, obj):
        return f"EPSG:{obj.srid}"


class GeolocaleXlsForm(forms.Form):
    """Form for geolocation files"""

    geolocation = None # instance of Geolocation class

    file_type = forms.ChoiceField(label=_('File type you want to geolocate'), choices=FILE_TYPES, widget=forms.Select)
    input_file = GeolocaleFileField(label=_('File you wanto to gelocate'),
                                    help_text=_('File extentions support: .csv, .xls. .xlsx'))
    output_filename = forms.CharField(label=_('Output file name'),
               help_text=_('(Optional) Specify a output file name, if not set original spreed sheet file name used'),
               required=False,
               max_length=400)
    srid_input_file = SRIDModelChoiceField(G3WSpatialRefSys.objects.all(), required=False, to_field_name='srid')
    csv_separator = forms.ChoiceField(label=_('CSV separator'), required=False, choices=CSV_SEPARATOR,
                                      widget=forms.Select,
                                      help_text=_('For CSV file type only, choose column separator'))

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        csv_separator_form_field = Field('csv_separator', css_class='select2', style="width:100%;")
        # For cadastral data, set ISTAT Comune cadastral code
        if 'cadastre' in settings.G3WADMIN_LOCAL_MORE_APPS:
            self.fields['comune_code'] = ComuneCodeModelChoiceField(ConfigImportCxf.objects.all(), required=False,
                                                                    to_field_name='codice_comune')
            self.declared_fields['comune_code'] = self.fields['comune_code']

            srid_form_field = Field('srid_input_file', css_class='select2', style="width:100%;")

            args = ['file_type', csv_separator_form_field, srid_form_field, 'comune_code', 'input_file',
                    'output_filename']
        else:
            args = ['file_type', csv_separator_form_field, 'input_file', 'output_filename']

        self.helper = FormHelper(self)
        self.helper.form_tag = False
        self.helper.layout = Layout(
            Div(
                Div(
                    Div(
                        Div(
                            HTML("<h3 class='box-title'><i class='fa fa-file-excel-o'></i> {}</h3>".format(
                                _('Geolocation file'))),
                            css_class='box-header with-border'
                        ),
                        Div(
                            *args,
                            css_class='box-body',
                        ),
                        css_class='box box-success'
                    ),
                    css_class='col-md-12'
                ),
                css_class='row'
            ),
        )

    def clean(self):

        self.cleaned_data = super().clean()

        # if file_type is cadastral check not empty comune_code
        if 'file_type' in self.cleaned_data and self.cleaned_data['file_type'] == 'with_cadastral':
            if not self.cleaned_data['comune_code']:
                raise forms.ValidationError(_('With Cadastral file type, comune code doesn\'t have to be empty'))

        # if file_type is xy check not empty srid_input_file
        if 'file_type' in self.cleaned_data and self.cleaned_data['file_type'] == 'with_xy':
            if not self.cleaned_data['srid_input_file']:
                raise forms.ValidationError(
                    _('With (x,y) file type, SRID of input file doesn\'t have to be empty'))

        # validate by file_type
        if self.is_valid():
            try:
                self.geolocation = Geolocation(**self.cleaned_data)
                self.geolocation.validate_input_data()
            except GeolocationValidationError as gve:
                raise forms.ValidationError(gve)

        return self.cleaned_data

    def is_valid(self):
        return super().is_valid()


