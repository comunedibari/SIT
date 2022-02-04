from django.forms import \
    ModelForm, \
    Form, \
    ChoiceField, \
    MultipleChoiceField, \
    CheckboxSelectMultiple, \
    CharField, \
    ModelChoiceField, \
    Select, \
    HiddenInput
from django.utils.translation import ugettext, ugettext_lazy as _
from django_file_form.forms import FileFormMixin
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Div, HTML, Field
from guardian.shortcuts import get_objects_for_user
from django_file_form.forms import UploadedFileField
from usersmanage.utils import get_fields_by_user, crispyBoxACL, userHasGroups, get_viewers_for_object, \
    get_user_groups_for_object, AuthGroup, User
from usersmanage.forms import G3WACLForm
from core.mixins.forms import *
from core.utils import unicode2ascii
from usersmanage.configs import *
from .models import Configs, Layer, Project
import json
import six


class cduFormMixin(object):

    def getChoicesFields(self, layer):
        fields = []
        database_columns = json.loads(layer.database_columns)
        datasource = layer.datasource
        for f in database_columns:

            # exclude geom fields
            if datasource.find("({})".format(f['name'])) == -1:
                fields.append((f['name'], "{} ({})".format(f['name'], f['type'])))
        return fields


class ProjectModelChoiceField(ModelChoiceField):
    """
    Build a human readable Qdjango project label options.
    Project name + Map Group belonging.
    """
    def label_from_instance(self, obj):
        label = super(ProjectModelChoiceField, self).label_from_instance(obj)
        return u"{} (Group: {})".format(label, obj.group.name)


class cduConfigInitForm(G3WFormMixin, G3WRequestFormMixin, G3WACLForm, ModelForm):
    """
    Form with title description Project map file and file template ODT
    """

    viewer_groups = (G3W_VIEWER1, )

    # change options for project select
    project = ProjectModelChoiceField(
        queryset=Project.objects.all(),
        required=True,
        widget=Select()
    )

    def __init__(self, *args, **kwargs):

        # set initial users and user groups
        self._init_users(**kwargs)
        self._init_user_groups(**kwargs)

        super(cduConfigInitForm, self).__init__(*args, **kwargs)

        # change ows_user field label
        self.fields['viewer_users'].label = _('User users')

        self.fields['project'].queryset = get_objects_for_user(self.request.user, 'change_project', Project)

        self.helper = FormHelper(self)
        self.helper.form_tag = False

        # Check if ACLBox must added
        # True only if superuser or Editor level 1
        self.aclbox = self.request.user.is_superuser or userHasGroups(self.request.user, [G3W_EDITOR1, G3W_EDITOR2])
        kwargs_project_field = {}
        #if not aclbox:
        #    kwargs_project_field['readonly'] = True

        self.helper.layout = Layout(
            Div(
                Div(
                    Div(
                        Div(
                            HTML("<h3 class='box-title'><i class='fa fa-file'></i> {}</h3>".format(
                                _('CDU project settings'))),
                            css_class='box-header with-border'
                        ),
                        Div(
                            Field('project', css_class='select2', **kwargs_project_field),
                            css_class='box-body',

                        ),
                        css_class='box box-default'
                    ),
                    css_class='col-md-12'
                ),
                crispyBoxACL(self, boxCssClass='col-md-12') if self.aclbox else None,
                Div(
                    Div(
                        Div(
                            HTML("<h3 class='box-title'><i class='fa fa-file'></i> {}</h3>".format(_('CDU base settings'))),
                            css_class='box-header with-border'
                        ),
                        Div(
                            'title',
                            Field('description', css_class='wys5'),
                            'odtfile',
                            'output_format',
                            'map_image',
                            css_class='box-body',

                        ),
                        css_class='box box-default'
                    ),
                    css_class='col-md-12'
                ),
                css_class='row'
            ),
        )

    class Meta:
        model = Configs
        fields = '__all__'

    def _setViewerUserQueryset(self, **kwargs):
        """
        Set query set for viewers chosen fields
        Take from viewers set into parent project group by Editor Level 1
        :return: None
        """
        # get viewer from parent if not editor level 2

        if userHasGroups(self.request.user, [G3W_EDITOR2]):

            # get viewers from groups
            viewers = get_viewers_for_object(self.instance, self.request.user, 'view_configs')
            # get queryset
            self.fields['viewer_users'].queryset = User.objects.filter(groups__name__in=self.viewer_groups,
                                                                       pk__in=[v.pk for v in viewers])
        else:
            super(cduConfigInitForm, self)._setViewerUserQueryset(**kwargs)

    def _set_user_groups_queryset(self):
        """
        Set query set for viewer user groups chosen fields
        Take from viewer user groups set into parent project group by Editor Level 1
        :return: None
        """
        if userHasGroups(self.request.user, [G3W_EDITOR2]):
            viewer_user_groups = get_user_groups_for_object(self.instance, self.request.user, 'view_configs', 'viewer')

            # get queryset
            self.fields['viewer_user_groups'].queryset = AuthGroup.objects.filter(
                pk__in=[v.pk for v in viewer_user_groups])
        else:
            super(cduConfigInitForm, self)._set_user_groups_queryset()

    def save(self, commit=True):
        instance = super(cduConfigInitForm, self).save(commit=commit)
        if self.aclbox:
            self._ACLPolicy()

        # add permission to editor1 if current user is editor1
        if userHasGroups(self.request.user, [G3W_EDITOR1]):
            self.instance.addPermissionsToEditor(self.request.user)
        return instance


class cduConfigCatastoLayerForm(Form):
    """
    Form for selection of catasto layer and against layers
    """

    catastoLayer = ChoiceField(label=_('Cadastre layer'), initial=10)
    againstLayers = MultipleChoiceField(widget=CheckboxSelectMultiple())
    against_group_layers = MultipleChoiceField(help_text=_('Select 1 first level layer group or choose single layers'),
                                               required=False)
    project_tree = CharField(widget=HiddenInput, required=False)

    def __init__(self,*args, **kwargs):

        #fill catastoLayer choices
        self.project = kwargs.get('project', None)
        self.layers_tree = kwargs.get('layers_tree', None)
        if self.project:
            kwargs.pop('project')
            kwargs.pop('layers_tree')

        super(cduConfigCatastoLayerForm, self).__init__(*args, **kwargs)
        layers = Layer.objects.filter(project=self.project).values_list('id', 'name')

        # get group layers
        group_layers = []
        for l in self.layers_tree:
            if isinstance(l[0], six.string_types) and l[0].startswith('g_'):
                group_layers.append((l[0][2:], l[0][2:]))

        self.fields['catastoLayer'].choices = [(None, '------')] + list(layers)
        self.fields['againstLayers'].choices = list(layers)
        self.fields['against_group_layers'].choices = group_layers

        self.helper = FormHelper(self)
        self.helper.form_tag = False
        self.helper.layout = Layout(
            Div(
                Div(
                    Div(
                        Div(
                            HTML("<h3 class='box-title'><i class='fa fa-file'></i> {}</h3>".format(
                                _('CDU layers choice'))),
                            css_class='box-header with-border'
                        ),
                        Div(
                            Field('catastoLayer', css_class='select2'),
                            'against_group_layers',
                            'project_tree',
                            'againstLayers',
                            css_class='box-body',

                        ),
                        css_class='box box-success'
                    ),
                    css_class='col-md-12'
                ),
                css_class='row'
            )
        )


class cduCatastoLayerFieldsForm(Form, cduFormMixin):
    """
    Form for select catasto fields and set against alias layers
    """
    foglio = ChoiceField(label=_('Sheet'), choices=())
    particella = ChoiceField(label=_('Parcel'), choices=())
    sezione = ChoiceField(label=_('Section'), choices=(), required=False)

    plusFieldsCatasto = MultipleChoiceField(label=_('Plus fields'), choices=(), required=False)

    def __init__(self, *args, **kwargs):
        self.catastoLayerFormData = kwargs.get('catastoLayerFormData', None)
        if self.catastoLayerFormData:
            kwargs.pop('catastoLayerFormData')
        super(cduCatastoLayerFieldsForm, self).__init__(*args, **kwargs)

        # get fields of catasto
        self._setFieldsCatasto()
        self._setPlusFieldsCatasto();
        self._setAliasLayers()

        self.helper = FormHelper(self)
        self.helper.form_tag = False
        self.helper.layout = Layout(
            Div(
                Div(
                    Div(
                        Div(
                            HTML("<h3 class='box-title'><i class='fa fa-file'></i> {}</h3>".format(
                                _('CDU Catasto fields'))),
                            css_class='box-header with-border'
                        ),
                        Div(
                            Field('foglio', css_class='select2'),
                            Field('particella', css_class='select2'),
                            Field('sezione', css_class='select2'),
                            'plusFieldsCatasto',
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
                                _('CDU Against layers aliases'))),
                            css_class='box-header with-border'
                        ),
                        Div(
                            *self.fieldsAliasLayers,
                            css_class='box-body'
                        ),
                        css_class='box box-success'
                    ),
                    css_class='col-md-12'
                ),
                css_class='row'
            ),
        )

    def _setFieldsCatasto(self):
        """
        Get layers from project and builds select for 'particella' and 'foglio' and 'sezione' field
        """
        self.catastoLayer = Layer.objects.get(pk=self.catastoLayerFormData['catastoLayer'])

        # get fields for foglio and particelle from database_columns
        self.fields['particella'].choices = self.fields['foglio'].choices = \
            self.getChoicesFields(self.catastoLayer)

        self.fields['sezione'].choices = [(None, '')] + self.fields['particella'].choices

    def _setPlusFieldsCatasto(self):
        """
        Set fields from catasto layer to use in template and results.
        """
        # get fields for PlusFields
        self.fields['plusFieldsCatasto'].choices = self.getChoicesFields(self.catastoLayer)

    def _setAliasLayers(self):
        """
        Set alias for catasto lasyer and other agaiint layers to show in results and template odt.
        """
        againstLayers = self.catastoLayerFormData['againstLayers']
        layers = Layer.objects.filter(pk__in=againstLayers)

        self.fieldsAliasLayers = []
        for layer in layers:
            layer_name = layer.name.rstrip()
            fieldName = unicode2ascii(layer_name)
            self.fieldsAliasLayers.append(fieldName)
            self.fields[fieldName] = CharField(label=layer_name, max_length=200, required=False)


class cduAgainstLayerFieldsForm(Form, cduFormMixin):
    """
    Form to select against fields to show in results
    """
    def __init__(self,*args,**kwargs):
        self.catastoLayerFormData = kwargs.get('catastoLayerFormData', None)
        if self.catastoLayerFormData:
            kwargs.pop('catastoLayerFormData')
        self.catastoLayerFieldsFormData = kwargs.get('catastoLayerFieldsFormData', None)
        if self.catastoLayerFieldsFormData:
            kwargs.pop('catastoLayerFieldsFormData')
        super(cduAgainstLayerFieldsForm, self).__init__(*args, **kwargs)

        # set fields of catasto
        self._setAliasFieldsCatasto()
        self._setAliasPlusFieldsCatasto()
        self._setFieldsAgainstLayers()

        self.helper = FormHelper(self)
        self.helper.form_tag = False

        layoutElements = [
            Div(
                Div(
                    Div(
                        HTML("<h3 class='box-title'><i class='fa fa-file'></i> {}</h3>".format(
                            _('CDU cadastre fields aliases'))),
                        css_class='box-header with-border'
                    ),
                    Div(
                        'alias_foglio',
                        'alias_particella',
                        'alias_sezione',
                        css_class='box-body'
                    ),
                    css_class='box box-success'
                ),
                css_class='col-md-12'
            )
        ]

        if len(self.fieldsAliasPlusFieldsCatasto):
            layoutElements.append(
                Div(
                    Div(
                        Div(
                            HTML("<h3 class='box-title'><i class='fa fa-file'></i> {}</h3>".format(
                                _('CDU Optional fields catasto aliases'))),
                            css_class='box-header with-border'
                        ),
                        Div(
                            *self.fieldsAliasPlusFieldsCatasto,
                            css_class='box-body'
                        ),
                        css_class='box box-success'
                    ),
                    css_class='col-md-12'
                )
            )

        layoutElements.append(
            Div(
                Div(
                    Div(
                        HTML("<h3 class='box-title'><i class='fa fa-file'></i> {}</h3>".format(
                            _('CDU Against layer fields to show in results'))),
                        css_class='box-header with-border'
                    ),
                    Div(
                        *self.fieldsFieldsAliasLayers,
                        css_class='box-body'
                    ),
                    css_class='box box-success'
                ),
                css_class='col-md-12'
            ),
        )

        self.helper.layout = Layout(
            Div(
                *layoutElements,
                css_class='row'
            )
        )

    def _setAliasFieldsCatasto(self):
        """
        Set alias for cadastre fields.
        """
        self.fields['alias_foglio'] = CharField(label=_('Sheet'), max_length=200)
        self.fields['alias_particella'] = CharField(label=_('Parcel'), max_length=200)
        self.fields['alias_sezione'] = CharField(label=_('Section'), max_length=200, required=False)

    def _setFieldsAgainstLayers(self):
        """
        Set fields against layer choice.
        """
        againstLayers = self.catastoLayerFormData['againstLayers']
        layers = Layer.objects.filter(pk__in=againstLayers)
        self.fieldsFieldsAliasLayers = []
        for layer in layers:
            fieldName = unicode2ascii(layer.name)
            self.fieldsFieldsAliasLayers.append(fieldName)
            self.fields[fieldName] = MultipleChoiceField(label=layer.name, choices=self.getChoicesFields(layer),
                                                         required=False)

    def _setAliasPlusFieldsCatasto(self):
        """
        Set charfields for alias plus field catasto.
        """
        self.fieldsAliasPlusFieldsCatasto = []
        for f in self.catastoLayerFieldsFormData['plusFieldsCatasto']:
            fieldName = unicode2ascii('plusFieldsCatasto_{}'.format(f))
            self.fields[fieldName] = CharField(label=f.capitalize, max_length=100)
            self.fieldsAliasPlusFieldsCatasto.append(fieldName)


class cduAgainstLayerFieldsAliasForm(Form, cduFormMixin):
    """
    Form to set Against fields alias values
    """
    def __init__(self,*args,**kwargs):
        self.catastoLayerFieldsFormData = kwargs.get('catastoLayerFieldsFormData',None)
        self.againstLayerFieldFormData = kwargs.get('againstLayerFieldFormData',None)
        if self.catastoLayerFieldsFormData:
            kwargs.pop('catastoLayerFieldsFormData')
        if self.againstLayerFieldFormData:
            kwargs.pop('againstLayerFieldFormData')
        super(cduAgainstLayerFieldsAliasForm,self).__init__(*args,**kwargs)

        self._setFieldsAliasFieldsLayers()

        self.helper = FormHelper(self)
        self.helper.form_tag = False

        self._setLayout()

    def _setLayout(self):
        # build of singular Div cryspiform instance for every layers fild
        args = []
        for formDataKey, formField in self.fieldsByLayers.items():
            args.append(
                Div(
                    Div(
                        Div(
                            HTML("<h3 class='box-title'><i class='fa fa-file'></i> {}</h3>".format(
                                _('CDU Alias for against field <i>{}</i>'.
                                  format(unicode2ascii(self.againstLayerAlias[formDataKey]))))),
                            css_class='box-header with-border'
                        ),
                        Div(
                            *formField,
                            css_class='box-body'
                        ),
                        css_class='box box-success'
                    ),
                    css_class='col-md-12'
                )
            )

        self.helper.layout = Layout(
            Div(*args, css_class='row')
        )

    def _setFieldsAliasFieldsLayers(self):
        """
        Create character fields for against layer fields selected in previus form.
        """

        self.fieldsByLayers = {}
        self.againstLayerAlias = {}
        for formDataKey, formDataValue in self.againstLayerFieldFormData.items():
            formDataKey = formDataKey.rstrip()
            try:
                formDataKey_str  = formDataKey.decode('utf-8')
            except:
                formDataKey_str = formDataKey
            if not formDataKey_str.startswith('plusFieldsCatasto') and not formDataKey_str.startswith('alias_'):
                fields = []
                for fieldName in formDataValue:
                    fname = unicode2ascii(fieldName)
                    fields.append(fname)
                    self.fields[fieldName] = CharField(max_length=100)
                self.fieldsByLayers[formDataKey] = fields
                self.againstLayerAlias[formDataKey] = self.catastoLayerFieldsFormData[formDataKey]