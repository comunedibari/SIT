# coding=utf-8
""""Singleprofile forms module

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2021-04-08'
__copyright__ = 'Copyright 2015 - 2021, Gis3w'


from django.forms.models import ModelForm
from django.utils.translation import ugettext_lazy as _
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Div, HTML, Row, Field, Hidden
# from usersmanage.forms import G3WACLForm
from usersmanage.utils import crispyBoxACL, userHasGroups
from usersmanage.configs import G3W_EDITOR1
from core.mixins.forms import G3WRequestFormMixin, G3WFormMixin
from .models import SimpleRepoProject, SimpleRepoLayer
from .utils.models import allowed_layers_for_reporting


class SimpleRepoProjectForm(G3WFormMixin, G3WRequestFormMixin, ModelForm):
    """
    Form for EleProProject model.
    """
    class Meta:
        model = SimpleRepoProject
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
                                                Field('project', css_class='select2'),
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


class SimpleRepoLayerForm(G3WFormMixin, G3WRequestFormMixin, ModelForm):
    """
        Form for SimpleRepoLayer model.
        """

    class Meta:
        model = SimpleRepoLayer
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # build queryset for reporting vector layer
        self.fields['layer'].queryset = allowed_layers_for_reporting(self.instance)

        self.helper = FormHelper(self)
        self.helper.form_tag = False
        self.helper.layout = Layout(
                                Div(
                                    Div(
                                        Div(
                                            Div(
                                                HTML("<h3 class='box-title'><i class='fa fa-file'></i> {}</h3>".format(
                                                    _('Reporting vector layer'))),
                                                css_class='box-header with-border'
                                            ),
                                            Div(
                                                Field('simplerepo_project', type='hidden'),
                                                'layer',
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