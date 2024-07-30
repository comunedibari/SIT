# coding=utf-8
""""Forms for Catalog views

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

"""

__author__ = 'elpaso@itopen.it'
__date__ = '2019-01-14'
__copyright__ = 'Copyright 2019, Gis3w'


from django.forms import ModelForm, MultipleChoiceField
from django.utils.translation import ugettext, ugettext_lazy as _
from django.core.exceptions import ValidationError
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Div, Submit, HTML, Button, Row, Field
from crispy_forms.bootstrap import AppendedText, PrependedText

from core.mixins.forms import G3WFormMixin
from .models import Catalog, Record


class BootstrapForm(ModelForm):

    def __init__(self, *args, **kwargs):
        super(BootstrapForm, self).__init__(*args, **kwargs)
        for name, field in self.fields.items():
            if hasattr(field, 'max_choices'):
                attrs = {
                    'class': 'form-check list-unstyled'
                }
            else:
                attrs = {
                    'class': 'form-control'
                }
            self.fields[name].widget.attrs.update(attrs)


class CatalogForm(G3WFormMixin, BootstrapForm):

    inspire_languages_supported = MultipleChoiceField(choices=Catalog.LANGUAGE_CHOICES,
                                                      label=_('INSPIRE languages supported'), required=False)
    inspire_gemet_keywords = MultipleChoiceField(choices=Catalog.INSPIRE_GEMET_THEMES, required=False, label=_('INPIRE gemet keywords'),
                                                help_text="{} | {}".format(_('a comma-seperated keyword list of GEME INSPIRE theme keywords about the service (see http://inspire.ec.europa.eu/schemas/common/1.0/enums/enum_eng.xsd, complexType inspireTheme_eng)'),
                                                        _('DCAT-US: <a href="https://resources.data.gov/resources/dcat-us/#keyword">"<i>keyword</i>"</a>')))

    def __init__(self, *args, **kwargs):
        super(CatalogForm, self).__init__(*args, **kwargs)

        self.helper = FormHelper(self)
        self.helper.form_tag = False
        self.helper.layout = Layout(
            Div(
                Div(
                    # COLUMN SN
                    # =========================================================
                    Div(
                        Div(
                            Div(
                                Div(
                                    HTML("<h3 class='box-title'><i class='fa fa-file'></i> {}</h3>".format(
                                        _('General data'))),
                                    css_class='box-header with-border'
                                ),
                                Div(
                                    'name',
                                    'is_active',
                                    'is_valid',
                                    'order',
                                    Field('scope', css_class='select2', style="width:100%;"),
                                    Field('group', css_class='select2', style="width:100%;"),
                                    Field('macrogroup', css_class='select2', style="width:100%;"),
                                    css_class='box-body',

                                ),
                                css_class='box box-success'
                            ),
                            css_class='col-md-12'
                        ),
                        Div(
                            Div(
                                Div(
                                    HTML("<h3 class='box-title'><i class='fa fa-file'></i> {}</h3>".format(
                                        _('Catalog provider'))),
                                    css_class='box-header with-border'
                                ),
                                Div(
                                    'provider_name',
                                    'provider_url',
                                    css_class='box-body',

                                ),
                                css_class='box box-success'
                            ),
                            css_class='col-md-12'
                        ),
                        Div(
                            Div(
                                Div(
                                    HTML("<h3 class='box-title'><i class='fa fa-file'></i> {}</h3>".format(
                                        _('Metadata informations'))),
                                    css_class='box-header with-border'
                                ),
                                Div(
                                    Field('inspire_default_language', css_class='select2', style="width:100%;"),
                                    HTML('<div id="div_id_inspire_charset" class="form-group">'
                                         '<label for="id_inspire_charset" class="control-label">{}</label>'
                                         '<div class="controls">'
                                         '<input disabled type="text" name="inspire_charset" value="utf8" id="id_inspire_charset" class="form-control textinput textInput form-control" maxlength="255">'
                                         '<p id="hint_id_inspire_charset" class="help-block"></p>'
                                         '</div>'
                                         '</div>'.format(_('Charset metadata'))),
                                    HTML('<div id="div_id_inspire_hierarchical_level" class="form-group">'
                                         '<label for="id_inspire_hierarchical_level" class="control-label">{}</label>'
                                         '<div class="controls">'
                                         '<input disabled type="text" name="inspire_hierarchical_level" value="dataset" id="id_inspire_hierarchical_level" class="form-control textinput textInput form-control" maxlength="255">'
                                         '<p id="hint_inspire_hierarchical_level" class="help-block"></p>'
                                         '</div>'
                                         '</div>'.format(_('Hierarchical level'))),
                                    'inspire_contact_organization',
                                    'inspire_contact_email',
                                    'inspire_contact_url',
                                    'inspire_contact_phone',
                                    'inspire_date',
                                    HTML('<div id="div_id_inspire_standard_name" class="form-group">'
                                         '<label for="id_inspire_standard_name" class="control-label">{}</label>'
                                         '<div class="controls">'
                                         '<input disabled type="text" name="inspire_standard_name" value="Linee Guida RNDT" id="id_inspire_standard_name" class="form-control textinput textInput form-control" maxlength="255">'
                                         '<p id="hint_inspire_standard_name" class="help-block"></p>'
                                         '</div>'
                                         '</div>'.format(_('Standard name'))),
                                    HTML('<div id="div_id_inspire_standard_version" class="form-group">'
                                         '<label for="id_inspire_standard_version" class="control-label">{}</label>'
                                         '<div class="controls">'
                                         '<input disabled type="text" name="inspire_standard_version" value="2.0" id="id_inspire_standard_version" class="form-control textinput textInput form-control" maxlength="255">'
                                         '<p id="hint_inspire_standard_version" class="help-block"></p>'
                                         '</div>'
                                         '</div>'.format(_('Standard version'))),
                                    css_class='box-body',

                                ),
                                css_class='box box-warning'
                            ),
                            css_class='col-md-12'
                        ),
                        Div(
                            Div(
                                Div(
                                    HTML("<h3 class='box-title'><i class='fa fa-file'></i> {}</h3>".format(
                                        _('INSPIRE'))),
                                    css_class='box-header with-border'
                                ),
                                Div(
                                    'inspire_enabled',
                                    Field('inspire_languages_supported', css_class='select2', style="width:100%;"),
                                    Field('inspire_gemet_keywords', css_class='select2', style="width:100%;"),
                                    css_class='box-body',

                                ),
                                css_class='box box-warning'
                            ),
                            css_class='col-md-12'
                        ),
                        Div(
                            Div(
                                Div(
                                    HTML("<h3 class='box-title'><i class='fa fa-file'></i> {}</h3>".format(_('RNDT'))),
                                    css_class='box-header with-border'
                                ),
                                Div(
                                    'rndt_enabled',
                                    'rndt_codice_ipa',
                                    css_class='box-body',

                                ),
                                css_class='box box-error'
                            ),
                            css_class='col-md-12'
                        ),
                        css_class='row'
                    ),
                    css_class='col-md-6'
                ),
                Div(
                    # COLONNA DX
                    # =========================================================
                    Div(
                        Div(
                            Div(
                                Div(
                                    HTML("<h3 class='box-title'><i class='fa fa-file'></i> {}</h3>".format(
                                        _('Catalog specifications'))),
                                    css_class='box-header with-border'
                                ),
                                Div(
                                    'identification_title',
                                    'identification_abstract',
                                    'identification_keywords',
                                    'identification_keywords_type',
                                    'identification_fees',
                                    'identification_accessconstraints',
                                    Field('inspire_conformity_service', css_class='select2', style="width:100%;"),
                                    'inspire_temp_extent',
                                    'inspire_geographical_extent',
                                    css_class='box-body',

                                ),
                                css_class='box box-success'
                            ),
                            css_class='col-md-12'
                        ),
                        Div(
                            Div(
                                Div(
                                    HTML(
                                        "<h3 class='box-title'><i class='fa fa-file'></i> {}</h3>".format(
                                            _('Catalog contact'))),
                                    css_class='box-header with-border'
                                ),
                                Div(
                                    'contact_name',
                                    'contact_position',
                                    'contact_address',
                                    'contact_city',
                                    'contact_postalcode',
                                    'contact_country',
                                    'contact_phone',
                                    'contact_fax',
                                    'contact_email',
                                    'contact_url',
                                    'contact_hours',
                                    'contact_instructions',
                                    'contact_role',
                                    css_class='box-body',

                                ),
                                css_class='box box-success'
                            ),
                            css_class='col-md-12'
                        ),
                        css_class='row'
                    ),
                    css_class='col-md-6'
                ),
                css_class='row'
            ),
        )

    class Meta:
        model = Catalog
        fields = '__all__'


class RecordForm(G3WFormMixin, BootstrapForm):

    keywords = MultipleChoiceField(choices=Catalog.INSPIRE_GEMET_THEMES, label=_('Keywords'),
                                   help_text="{} | {}".format(
            _('Record keywords - a comma-seperated keyword list of GEMET INSPIRE theme keywords about the service (see http://inspire.ec.europa.eu/schemas/common/1.0/enums/enum_eng.xsd, complexType inspireTheme_eng)'),
            _('DCAT-US: <a href="https://resources.data.gov/resources/dcat-us/#keyword">"<i>keyword</i>"</a>')
            ))

    def _set_required_fields(self):
        """
        Set required fields, set her not in model for invalidate catalog procedure
        :return: No data
        """

        fields = ['abstract', 'lineage', 'access_constraints_inspire']
        for f in fields:
            self.fields[f].required = True

    def __init__(self, *args, **kwargs):
        super(RecordForm, self).__init__(*args, **kwargs)

        # Set required fields
        self._set_required_fields()

        self.helper = FormHelper(self)
        self.helper.form_tag = False
        self.helper.layout = Layout(
            Div(
                Div(
                    # COLUMN SN
                    # =======================================================
                    Div(
                        Div(
                            Div(
                                Div(
                                    HTML("<h3 class='box-title'><i class='fa fa-file'></i> {}</h3>".format(
                                        _('Data identification'))),
                                    css_class='box-header with-border'
                                ),
                                Div(

                                    # set hidden field for catalog fk father
                                    Field('catalog', type='hidden'),
                                    'title',
                                    'creation_date',
                                    'publication_date',
                                    'revision_date',
                                    'modified_date',
                                    HTML('<div id="div_id_presentation_format" class="form-group">'
                                         '<label for="id_presentation_format" class="control-label">{}</label>'
                                         '<div class="controls">'
                                         '<input disabled type="text" name="presentation_format" value="mapDigital" id="id_presentation_format" class="form-control textinput textInput form-control" maxlength="255">'
                                         '<p id="hint_presentation_format" class="help-block"></p>'
                                         '</div>'
                                         '</div>'.format(_('Presentation format'))),
                                    'inspire_owner_contact_organization',
                                    'inspire_owner_contact_phone',
                                    'inspire_owner_contact_email',
                                    'inspire_owner_contact_url',
                                    'identifier',
                                    'abstract',
                                    Field('keywords', css_class='select2', style="width:100%;"),
                                    'inspire_contact_organization',
                                    'inspire_contact_phone',
                                    'inspire_contact_email',
                                    'inspire_contact_url',
                                    HTML('<div id="div_id_inspire_data_charset" class="form-group">'
                                         '<label for="id_inspire_data_charset" class="control-label">{}</label>'
                                         '<div class="controls">'
                                         '<input disabled type="text" name="inspire_data_charset" value="utf8" id="id_inspire_charset" class="form-control textinput textInput form-control" maxlength="255">'
                                         '<p id="hint_id_inspire_data_charset" class="help-block"></p>'
                                         '</div>'
                                         '</div>'.format(_('Charset data'))),
                                    'denominator',
                                    Field('language', css_class='select2', style="width:100%;"),
                                    Field('topic_category', css_class='select2', style="width:100%;"),
                                    # 'bounding_box',
                                    # 'crs',
                                    # 'lineage',
                                    # 'accuracy',

                                    css_class='box-body',

                                ),
                                css_class='box box-success'
                            ),
                            css_class='col-md-12'
                        ),
                        css_class='row'
                    ),
                    css_class='col-md-6'
                ),
                Div(
                    # COLUMN DX
                    # =======================================================
                    Div(
                        Div(
                            Div(
                                Div(
                                    HTML("<h3 class='box-title'><i class='fa fa-file'></i> {}</h3>".format(
                                        _('Data constraints'))),
                                    css_class='box-header with-border'
                                ),
                                Div(
                                    'inspire_use_limitation',
                                    Field('access_constraints_inspire', css_class='select2'),
                                    'usability_constraints',
                                    Field('eu_license', css_class='select2'),
                                    #'security_constraints',
                                    css_class='box-body'
                                ),
                                css_class='box box-success'
                            ),
                            css_class='col-md-12'
                        ),
                        Div(
                            Div(
                                Div(
                                    HTML("<h3 class='box-title'><i class='fa fa-file'></i> {}</h3>".format(
                                        _('Data extension'))),
                                    css_class='box-header with-border'
                                ),
                                Div(
                                    'bounding_box',
                                    'temporal_extent_begin',
                                    'temporal_extent_end',
                                    css_class='box-body'
                                ),
                                css_class='box box-success'
                            ),
                            css_class='col-md-12'
                        ),
                        Div(
                            Div(
                                Div(
                                    HTML("<h3 class='box-title'><i class='fa fa-file'></i> {}</h3>".format(
                                        _('Data quality'))),
                                    css_class='box-header with-border'
                                ),
                                Div(
                                    HTML('<div id="div_id_quality_level" class="form-group">'
                                         '<label for="id_quality_level" class="control-label">{}</label>'
                                         '<div class="controls">'
                                         '<input disabled type="text" name="quality_level" value="dataset" id="id_quality_level" class="form-control textinput textInput form-control" maxlength="255">'
                                         '<p id="hint_quality_level" class="help-block"></p>'
                                         '</div>'
                                         '</div>'.format(_('Quality level'))),
                                    'accuracy',
                                    'lineage',
                                    HTML('<div id="div_id_compliance_level" class="form-group">'
                                         '<label for="id_compliance_level" class="control-label">{}</label>'
                                         '<div class="controls">'
                                         '<input disabled type="text" name="compliance_level" value="{}" id="id_compliance_level" class="form-control textinput textInput form-control" maxlength="255">'
                                         '<p id="hint_compliance_level" class="help-block"></p>'
                                         '</div>'
                                         '</div>'.format(_('Compliance level'),
                                                         _(self.instance.catalog.inspire_conformity_service if self.instance.catalog.inspire_conformity_service else '_'))),
                                    css_class='box-body'
                                ),
                                css_class='box box-success'
                            ),
                            css_class='col-md-12'
                        ),
                        Div(
                            Div(
                                Div(
                                    HTML("<h3 class='box-title'><i class='fa fa-file'></i> {}</h3>".format(
                                        _('Reference system'))),
                                    css_class='box-header with-border'
                                ),
                                Div(
                                    'crs',
                                    css_class='box-body'
                                ),
                                css_class='box box-success'
                            ),
                            css_class='col-md-12'
                        ),
                        Div(
                            Div(
                                Div(
                                    HTML("<h3 class='box-title'><i class='fa fa-file'></i> {}</h3>".format(
                                        _('Data distribution'))),
                                    css_class='box-header with-border'
                                ),
                                Div(
                                    'format',
                                    'rndt_distributor_contact_organization',
                                    'rndt_distributor_contact_phone',
                                    'rndt_distributor_contact_email',
                                    'rndt_distributor_contact_url',
                                    'rndt_resource_maintenance_frequency',
                                    css_class='box-body'
                                ),
                                css_class='box box-success'
                            ),
                            css_class='col-md-12'
                        ),
                        css_class='row'
                    ),
                    css_class='col-md-6'
                ),
                # hidden fields
                Field('g3w_project_type', type='hidden'),
                Field('g3w_layer_id', type='hidden'),
                css_class='row'
            ),

        )

    def clean_eu_license(self):
        """ Validation eu_licence input relative to usability_constraints"""

        if 'usability_constraints' in  self.cleaned_data and self.cleaned_data['usability_constraints'] and \
                self.cleaned_data['eu_license']:
            raise ValidationError(
                _(f"Is not possible set value for 'Usability constraints' and 'Usability constraints - data license' "
                  f"at the same time: set one of two or nothing."))

        return self.cleaned_data['eu_license']

    class Meta:
        model = Record
        fields = '__all__'


