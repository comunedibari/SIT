from django.conf import settings
from django.dispatch import receiver
from django.urls import reverse
from django.template import loader, Context, RequestContext
from django.db.models.signals import pre_delete
from guardian.shortcuts import get_objects_for_user
from guardian.utils import get_anonymous_user
from core.signals import initconfig_plugin_start, load_dashboard_widgets, load_js_modules, \
    pre_update_project, pre_delete_project
from core.views import DashboardView
from qdjango.views import QdjangoProjectUpdateView, QdjangoProjectListView
from qdjango.models import Project
from .utils.tdws import TDWSAPI
from .models import Configs
from .signals import after_write_document

import logging

logger = logging.getLogger('g3wadmin.cdu')


@receiver(load_js_modules)
def get_js_modules(sender, **kwargs):

    return 'cdu/js/widget.js'


@receiver(load_dashboard_widgets)
def dashboard_widget(sender, **kwargs):

    if isinstance(sender, DashboardView):

        data = get_objects_for_user(sender.request.user, 'cdu.view_configs', Configs).order_by('title')

        widget = loader.get_template('cdu/widgets/dashboard.html')
        return widget.render(context={'data': data}, request=sender.request)


@receiver(initconfig_plugin_start)
def set_init_config_value(sender, **kwargs):

    # get config data
    # todo: better apply filter by user
    configs = Configs.objects.filter(project_id=kwargs['project'])

    if len(configs) == 0:
        return None


    # check permissions on project for to render plugins data
    configs_to_use = []
    # check permissions on project for to render plugins data
    # remove this part fo planetek but add flag
    # check for login required
    login_required = True

    for config in configs:
        if sender.request.user.has_perm('cdu.make_cdu', config) or \
                get_anonymous_user().has_perm('cdu.make', config):
            login_required = False
        configs_to_use.append(config)

    ret = {}

    if len(configs_to_use) > 0:

        title = getattr(settings, 'CDU_PLUGIN_CLIENT_TITLE', 'STRUMENTI ANALISI TERRITORIALE')
        search_title = getattr(settings, 'CDU_PLUGIN_CLIENT_SEARCH_TITLE', 'Ricerca per foglio e particella catastali')
        position = getattr(settings, 'CDU_PLUGIN_POSITION', 'tools')

        ret = {
            'cdu': {
                'title': title,
                'gid': "{}:{}".format(kwargs['projectType'], kwargs['project']),
                'position': position,
                'login_required': login_required,
                'configs': list()
            }
        }

        for config in configs_to_use:
            layer_catasto = config.layer_catasto()

            s = "(previa autenticazione spid/cie)" if login_required else ""
            config_title = f"{config.title} {s}"

            config_ret = {
                    'id': config.id,
                    'name': config_title,
                    'api': reverse('cdu-api-calculate-id', kwargs={'id': config.pk}),
                    'docurl': reverse('cdu-config-createdoc', kwargs={'id': config.pk}),
                    'uploadurl': reverse('cdu-upload'),
                    'layerCatasto': layer_catasto.layer.qgs_layer_id,
                    'outputformat': config.output_format,
                    'map_image': config.map_image,
                    'search': {
                        'id': config.title,
                        'name': search_title,
                        'options': {
                            'layerid': layer_catasto.layer.qgs_layer_id,
                            'querylayerid': layer_catasto.layer.qgs_layer_id,
                            'queryurl': None,
                            'filter': [
                                    {
                                        'attribute': layer_catasto.getFieldFoglio(),
                                        'op': 'eq',
                                        'label': layer_catasto.getAliasFieldsCatasto()['foglio'],
                                        'input': {
                                            'type': 'textfield',
                                            'options': {
                                                'blanktext': ''
                                            }
                                        },
                                        'logicop': 'AND'
                                    },
                                    {
                                        'attribute': layer_catasto.getFieldParticella(),
                                        'op': 'eq',
                                        'label': layer_catasto.getAliasFieldsCatasto()['particella'],
                                        'input': {
                                            'type': 'textfield',
                                            'options': {
                                                'blanktext': ''
                                            }
                                        },
                                        'logicop': 'AND'
                                    }
                                ]
                        },

                    },
                    'results': {
                        'layers': []
                    }
                }

            # add section is is set
            sezione = layer_catasto.getFieldSezione()
            if sezione:
                config_ret['search']['options']['filter'].append(
                    {
                        'attribute': layer_catasto.getFieldSezione(),
                        'op': 'eq',
                        'label': layer_catasto.getAliasFieldsCatasto()['sezione'],
                        'input': {
                            'type': 'textfield',
                            'options': {
                                'blanktext': ''
                            }
                        },
                        'logicop': 'AND'
                    }
                )

            layers_against = config.layers_against()

            for layer in layers_against:
                config_ret['results']['layers'].append({
                    layer.layer.origname: {
                        'name': layer.layer.name,
                        'title': layer.alias,
                        'id': layer.layer.qgs_layer_id,
                        'fields': layer.getLayerFieldsData()
                    }
                })

            ret['cdu']['configs'].append(config_ret)

    return ret


@receiver(pre_update_project)
def checkProjectForUpdate(sender, **kwargs):
    """
    Check project is going to update.
    """

    if isinstance(sender, QdjangoProjectUpdateView) and 'cdu' in settings.G3WADMIN_LOCAL_MORE_APPS:

        # get config data
        projects = [c.project for c in Configs.objects.all()]

        if kwargs['project'] in projects:
            msg = loader.get_template('cdu/messages/check_project_update.html')
            return msg.render(kwargs)


@receiver(pre_delete_project)
def checkProjectForDelete(sender, **kwargs):
    """
    Check project is going to delete.
    """

    if isinstance(sender, QdjangoProjectListView) and 'cdu' in settings.G3WADMIN_LOCAL_MORE_APPS:

        # get config data
        cadastre_projects = [c.project for c in Configs.objects.all()]
        projects = kwargs['projects']

        if len(cadastre_projects) > 0:
            messages = []
            for project in projects:
                if project in cadastre_projects:
                    msg = loader.get_template('cdu/messages/check_project_delete.html')
                    messages.append({'project': project, 'message': msg.render({'project': project})})
            if len(messages):
                return messages


@receiver(pre_delete, sender=Project)
def delete_project_file(sender, **kwargs):
    """
    Perform delete cdu config if exists
    """

    try:
        Configs.objects.filter(project=kwargs['instance']).delete()
    except:
        pass


@receiver(after_write_document)
def audit_ws(sender, **kwargs):
    """
    Send data to TimbroDigitale rest API
    """

    try:

        td = TDWSAPI(odt_obj=sender, request=kwargs['request'])
        td.audit()


    except Exception as e:
        logger.error(f"[CDU-TIMBRODIGITALE]: {e}")