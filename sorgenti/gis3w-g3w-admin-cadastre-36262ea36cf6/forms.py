from django.forms import ModelForm, ValidationError, ModelChoiceField, Select, ModelMultipleChoiceField
from django.utils.translation import ugettext, ugettext_lazy as _
from django.db.models import Q
from django.conf import settings
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Div, HTML, Field
from ajax_select.fields import AutoCompleteSelectField
from ajax_select import make_ajax_field
from usersmanage.forms import G3WACLForm, UserChoiceField
from usersmanage.utils import crispyBoxACL, get_users_for_object, get_user_groups_for_object, userHasGroups
from usersmanage.configs import *
from core.mixins.forms import G3WRequestFormMixin, G3WFormMixin
from .models import Config, ConfigUserCadastre, ConfigImportCxf
from .configs import *
from .utils.cxfprovider import CXFDBProvider
from core.utils import unicode2ascii
import copy
import psycopg2


class ProjectModelChoiceField(ModelChoiceField):

    def label_from_instance(self, obj):
        label = super(ProjectModelChoiceField, self).label_from_instance(obj)
        return u"{} (Group: {})".format(label, obj.group.name)


class LayerModelMultipleChoiceField(ModelMultipleChoiceField):
    """Custom form filed for choose Layer"""

    def label_from_instance(self, obj):
        return u"{} ({})".format(obj.title, obj.origname)


class ConfigForm(G3WFormMixin, G3WRequestFormMixin, G3WACLForm, ModelForm):
    project = ProjectModelChoiceField(
        queryset=Project.objects.filter(),
        required=True,
        widget=Select()
    )

    codice_comune = make_ajax_field(IstatCodiciUi, 'codice_catastale_del_comune', 'cadastre_codice_comune',
                                    required=True, help_text=_('Type municipality code'))

    layers = LayerModelMultipleChoiceField(
        queryset=None,
        required=True
    )

    add_anonynous = False

    def __init__(self, *args, **kwargs):
        super(ConfigForm, self).__init__(*args, **kwargs)

        # set value for projects select only project not just in config table
        if self.instance.pk:
            project_ids = [c.project.pk for c in Config.objects.filter(~Q(pk=self.instance.pk))]
            layer_ids = [cl.layer.pk for cl in self.instance.configlayer_set.all()]
            #self.fields['layers'].queryset = Layer.objects.filter(pk__in=layer_ids)
        else:
            project_ids = [c.project.pk for c in Config.objects.all()]

        self.fields['layers'].queryset = Layer.objects.all()

        self.fields['project'].queryset = Project.objects.filter(~Q(pk__in=project_ids))


        self.helper = FormHelper(self)
        self.helper.form_tag = False
        self.helper.layout = Layout(
                                Div(
                                    Div(
                                        Div(
                                            Div(
                                                HTML("<h3 class='box-title'><i class='fa fa-cog'></i> {}</h3>".format(
                                                    _('Data config'))),
                                                css_class='box-header with-border'
                                            ),
                                            Div(
                                                'codice_comune',
                                                Field('project', css_class='select2', style="width:100%;"),
                                                Field('layers', **{'css_class': 'select2 col-md-12', 'multiple': 'multiple', 'style': 'width:100%;'}),

                                                css_class='box-body',

                                            ),
                                            css_class='box box-success'
                                        ),
                                        css_class='col-md-6'
                                    ),
                                    crispyBoxACL(self,
                                                 editor_field_required=False,
                                                 editor2_field_required=False,
                                                 editor_groups_field_required=False),
                                    css_class='row'
                                )
                            )

    def clean_layers(self):

        layers = self.cleaned_data['layers']

        for layer in layers:
            fields_not_prensent = set(['FOGLIO', 'NUMERO', 'SEZIONE']) - \
                                  set([k.upper() for k in layer.database_columns_by_name().keys()])
            if len(fields_not_prensent) > 0:
                raise ValidationError(
                    _('Layer {} not correct, required fields "{}" are no present'.format(layer.title,
                                                                                       '", "'.join(fields_not_prensent))))
        return layers

    class Meta:
        model = Config
        fields = '__all__'

    def save(self, commit=True):
        super(ConfigForm, self).save(commit=commit)

        # Save cadastre layers
        current_cadastre_layers = set([clayer.layer for clayer in self.instance.configlayer_set.all()])
        layer_to_remove = current_cadastre_layers - set(self.cleaned_data['layers'])
        layer_to_add = set(self.cleaned_data['layers']) - current_cadastre_layers

        for l in list(layer_to_add):
            ConfigLayer.objects.create(config=self.instance, layer=l)

        self.instance.configlayer_set.filter(layer_id__in=[l.pk for l in list(layer_to_remove)]).delete()


        # set permissions to editor1 and editor2
        self.instance.setPermissionToEditor()

        # set permissions to editor user groups
        self.instance.set_permissions_to_editor_user_groups()
        
        self._ACLPolicy()


class ConfigUserForm(G3WFormMixin, G3WRequestFormMixin, ModelForm):
    """
    Form for add/update/delete editor 1 to grant load cadastre data
    """
    codice_comune = make_ajax_field(IstatCodiciUi, 'codice_catastale_del_comune', 'cadastre_codice_comune',
                                    required=True, help_text=_('Type municipality code'))
    user = UserChoiceField(label=_('User'), queryset=None, required=True)

    def __init__(self, *args, **kwargs):
        super(ConfigUserForm, self).__init__(*args, **kwargs)

        # set user edito 1
        self.fields['user'].queryset = User.objects.filter(groups__name__in=(G3W_EDITOR1,)) \
            .order_by('last_name')

        self.helper = FormHelper(self)
        self.helper.form_tag = False
        self.helper.layout = Layout(
                                Div(
                                    Div(
                                        Div(
                                            Div(
                                                HTML("<h3 class='box-title'><i class='fa fa-cog'></i> {}</h3>".format(
                                                    _('Cadastre Editor 1 User'))),
                                                css_class='box-header with-border'
                                            ),
                                            Div(
                                                'user',
                                                'codice_comune',
                                                css_class='box-body',

                                            ),
                                            css_class='box box-success'
                                        ),
                                        css_class='col-md-12'
                                    ),
                                    css_class='row'
                                )
                            )

    def clean_codice_comune(self):
        """ Check once user codice_comune combination """
        # only one combination is possible
        if not self.instance.pk and \
                'user' in self.cleaned_data and \
                'codice_comune' in self.cleaned_data and \
                self._meta.model.objects.filter(
                user=self.cleaned_data['user'],
                codice_comune=self.cleaned_data['codice_comune']
        ).exists() or self.instance.pk and self._meta.model.objects.filter(
                Q(user=self.cleaned_data['user'], codice_comune=self.cleaned_data['codice_comune']) &
                ~Q(user=self.instance.user, codice_comune=self.instance.codice_comune)
        ).exists():
            raise ValidationError(
                _('Only one user and municipality code combination can exist'))

        return self.cleaned_data['codice_comune']

    def clean_user(self):
        """ Clean user field: only a Editor Level 1 can be set"""
        user = self.cleaned_data['user']

        if not userHasGroups(user, [G3W_EDITOR1]):
            raise ValueError(
                _('User must be Editor Level 1')
            )

        return user

    def save(self, commit=True):
        super(ConfigUserForm, self).save(commit=commit)
        self.instance.set_permission_add_prm()

    class Meta:
        model = ConfigUserCadastre
        fields = '__all__'


class ConfigCXFDBForm(G3WFormMixin, G3WRequestFormMixin, ModelForm):
    """
    Form for add/update/delete CXF DB load connetctions
    """
    codice_comune = make_ajax_field(IstatCodiciUi, 'codice_catastale_del_comune', 'cadastre_codice_comune',
                                    required=True, help_text=_('Type municipality code'))

    def __init__(self, *args, **kwargs):
        super(ConfigCXFDBForm, self).__init__(*args, **kwargs)

        self.helper = FormHelper(self)
        self.helper.form_tag = False
        self.helper.layout = Layout(
                                Div(
                                    Div(
                                        Div(
                                            Div(
                                                HTML("<h3 class='box-title'><i class='fa fa-cog'></i> {}</h3>".format(
                                                    _('CXF DB Connection'))),
                                                css_class='box-header with-border'
                                            ),
                                            Div(
                                                'codice_comune',
                                                'provider',
                                                'db_host',
                                                'db_port',
                                                'db_name',
                                                'db_table',
                                                'db_schema',
                                                Field('srid', css_class='select2', style="width:100%;"),
                                                'db_user',
                                                'db_password',
                                                css_class='box-body',

                                            ),
                                            css_class='box box-success'
                                        ),
                                        css_class='col-md-12'
                                    ),
                                    css_class='row'
                                )
                            )

    def clean(self):
        """
        Check connection and table exists
        :return:
        """

        with CXFDBProvider(**self.cleaned_data) as provider:
            self.table_exists = provider.table_exists()
            if self.table_exists:
                provider.check_crs()

        return self.cleaned_data

    def save(self, commit=True):
        super(ConfigCXFDBForm, self).save(commit=commit)

        if not self.table_exists:
            with CXFDBProvider(**self.cleaned_data) as provider:
                provider.create_table()

        return self.instance

    class Meta:
        model = ConfigImportCxf
        fields = '__all__'
