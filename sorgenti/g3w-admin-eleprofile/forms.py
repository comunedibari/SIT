# coding=utf-8
""""
Eleprofile module forms.
.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2020-07-13'
__copyright__ = 'Copyright 2015 - 2020, Gis3w'

from django.forms.models import ModelForm
from django.utils.translation import ugettext_lazy as _
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Div, HTML, Row, Field, Hidden
# from usersmanage.forms import G3WACLForm
from usersmanage.utils import crispyBoxACL, userHasGroups
from usersmanage.configs import G3W_EDITOR1
from core.mixins.forms import G3WRequestFormMixin, G3WFormMixin
from qdjango.models import Layer
from .models import EleProProject, EleProDTM


class ProjectForm(G3WFormMixin, G3WRequestFormMixin, ModelForm):
    """
    Form for EleProProject model.
    """
    class Meta:
        model = EleProProject
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.helper = FormHelper(self)
        self.helper.form_tag = False
        self.helper.layout = Layout(
                                Div(
                                    Div(
                                        Div(
                                            Div(
                                                HTML("<h3 class='box-title'><i class='fa fa-file'></i> {}</h3>".format(
                                                    _('Project'))),
                                                css_class='box-header with-border'
                                            ),
                                            Div(
                                                'project',
                                                Field('note', css_class='wys5'),
                                                css_class='box-body',
                                            ),
                                            css_class='box box-success'
                                        ),
                                        css_class='col-md-12'
                                    ),
                                    css_class='row'
                                ),
                            )


class DTMForm(G3WFormMixin, G3WRequestFormMixin, ModelForm):
    """
        Form for EleProProject model.
        """

    class Meta:
        model = EleProDTM
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # build queryset for DTM layer and path layers
        self.fields['dtm_layer'].queryset = Layer.objects.filter(
            project_id=EleProProject.objects.get(pk=kwargs['initial']['elepro_project']).project_id,
            layer_type__in=('raster', 'gdal')
        )

        self.fields['layers'].queryset = Layer.objects.filter(
            project_id=EleProProject.objects.get(pk=kwargs['initial']['elepro_project']).project_id,
            geometrytype__in=('LineString', 'MultiLineString')
        )

        self.helper = FormHelper(self)
        self.helper.form_tag = False
        self.helper.layout = Layout(
                                Div(
                                    Div(
                                        Div(
                                            Div(
                                                HTML("<h3 class='box-title'><i class='fa fa-file'></i> {}</h3>".format(
                                                    _('DTM Layer and pth layers'))),
                                                css_class='box-header with-border'
                                            ),
                                            Div(
                                                Field('elepro_project', type='hidden'),
                                                'dtm_layer',
                                                'dtm_delta',
                                                'layers',
                                                Field('note', css_class='wys5'),
                                                css_class='box-body',
                                            ),
                                            css_class='box box-success'
                                        ),
                                        css_class='col-md-12'
                                    ),
                                    css_class='row'
                                ),
                            )