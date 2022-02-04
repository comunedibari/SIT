from django.conf import settings
from django.dispatch import receiver
from django.template import loader
from django.urls import reverse
from core.signals import initconfig_plugin_start, after_update_project, pre_update_project, pre_delete_project, \
    load_dashboard_widgets, load_css_modules, post_serialize_project
from qdjango.views import QdjangoProjectUpdateView, QdjangoProjectListView
from guardian.shortcuts import get_objects_for_user
from core.views import DashboardView
from .models import *
from .configs import *
from .utils import get_data_for_widget_search
from .apps import cadastreConfig
from .apiurls import BASE_CADASTRE_API_EDITING

@receiver(load_css_modules)
def getCssModules(sender, **kwargs):

    return 'cadastre/css/cadastre.css'

@receiver(load_dashboard_widgets)
def dashboard_widget(sender, **kwargs):

    if isinstance(sender, DashboardView):

        # get project
        configs = Config.objects.all()

        context = {
            'projects': [],
        }
        for config in configs:
            if sender.request.user.has_perm(config.project, 'qdjango.edit_cadastre_association'):
                context['projects'].append(config.project)
        widget = loader.get_template('cadastre/widgets/dashboard.html')
        return widget.render(context=context, request=sender.request)


@receiver(pre_update_project)
def checkProjectForUpdate(sender, **kwargs):
    """
    Check project is going to update.
    """

    if isinstance(sender, QdjangoProjectUpdateView) and 'cadastre' in settings.G3WADMIN_LOCAL_MORE_APPS:

        # get config data
        projects = [c.project for c in Config.objects.all()]

        if kwargs['project'] in projects:
            msg = loader.get_template('cadastre/messages/check_project_update.html')
            return msg.render(kwargs)


@receiver(pre_delete_project)
def checkProjectForDelete(sender, **kwargs):
    """
    Check project is going to delete.
    """

    if isinstance(sender, QdjangoProjectListView) and 'cadastre' in settings.G3WADMIN_LOCAL_MORE_APPS:

        # get config data
        cadastre_projects = [c.project for c in Config.objects.all()]
        projects = kwargs['projects']

        if len(cadastre_projects) > 0:
            messages = []
            for project in projects:
                if project in cadastre_projects:
                    msg = loader.get_template('cadastre/messages/check_project_delete.html')
                    messages.append({'project': project, 'message': msg.render({'project': project})})
            if len(messages):
                return messages


@receiver(initconfig_plugin_start)
def setInitConfigValue(sender, **kwargs):

    # if not qdjango project
    if kwargs['projectType'] != 'qdjango':
        return None

    # che for data
    data = Config.getData(kwargs['project'])

    # if config value is not set return None
    if not data:
        return None

    # check permissions on project for to render plugins data
    if not sender.request.user.has_perm('qdjango.edit_cadastre_association', data.project) and not \
            sender.request.user.has_perm('qdjango.change_project', data.project):
        return None

    ret = None
    # check il project model and project type are right for iternet
    if kwargs['projectType'] == 'qdjango' and str(data.project.pk) == kwargs['project']:
        ret = {'cadastre': {
            'gid': "{}:{}".format(kwargs['projectType'], kwargs['project']),
            'layers': {},
            'details': {
                'fabbricato': {
                    'url': reverse('cadastre-api-fabbricato', args=[data.project_id]),
                    'params': ['foglio', 'numero', 'sezione']
                },
                'terreno': {
                    'url': reverse('cadastre-api-terreno', args=[data.project_id]),
                    'params': ['foglio', 'numero', 'sezione']
                },
                'immobile': {
                    'url': reverse('cadastre-api-immobile', args=[data.project_id]),
                    'params': ['id_immobile']
                },
                'particella': {
                    'url': reverse('cadastre-api-particella', args=[data.project_id]),
                    'params': ['id_particella']
                }
            }
        }}

    ret['cadastre']['layers'].update({
        'catasto': []
    })

    # For backwards campatibility mantain get layer by name 'catasto' or config_cxf db_table property
    # -----------------------------------------------------------------------------------------------

    # Check for Config cadastre layers
    layers = [cl.layer for cl in data.configlayer_set.all()]

    if len(layers) == 0:
        print('passa da qui')
        # get origname=table_name form config cxf
        config_cxf = ConfigImportCxf.objects.filter(codice_comune=data.codice_comune)

        if len(config_cxf) > 0:
            cadastre_layer_orignames = [config_cxf[0].db_table]
        else:
            cadastre_layer_orignames = CADASTRE_LAYERS.keys()

        # layers = {d.origname: d for d in data.project.layer_set.filter(origname__in=cadastre_layer_orignames)}
        layers = data.project.layer_set.filter(origname__in=cadastre_layer_orignames)

    for l in layers:
        ret['cadastre']['layers']['catasto'].append(
            {
                'name': l.origname,
                'id': l.qgs_layer_id
            }
        )

    return ret


@receiver(after_update_project)
def checkPermissions(sender, **kwargs):
    """
    Check permissions for user after update project
    """

    # todo:: check permissions for cadastre on project update
    return None


@receiver(post_serialize_project)
def add_searches(sender, **kwargs):
    """
    Add new searches to project API.
    :param sender: Qdjango project instance
    :param kwargs: 
    :return: 
    """

    # if settings.CADASTRE_SEARCHES is been set
    searches = getattr(settings, 'CADASTRE_SEARCHES', None)
    # if not set or set a value not available in CADASTRE_SEARCHES_OPTIONS
    if not searches or len(set(searches)-set(CADASTRE_SEARCHES_OPTIONS)) > 0:
        return

    data_project = Config.getData(sender.instance.pk)

    data = {
        'operation_type': 'append',
        'append_path': 'search',
        'values': [],
    }
    
    if data_project:

        if data_project and sender.instance != data_project.project:
            return data

        if not kwargs['request'].user.has_perm('qdjango.edit_cadastre_association', data_project.project) and not \
                kwargs['request'].user.has_perm('qdjango.change_project', data_project.project):
            return data

        layer_id, queryurl = get_data_for_widget_search(data_project)

        # Search by CF
        # ------------
        if 'CF' in searches:
            data['values'].append({
                "id": "catasto_data_by_cf",
                "name": "Ricerca particelle catastali per CODICE FISCALE o PIVA",
                "type": "search",
                "options": {
                    "querylayerid": layer_id,
                    "queryurl": queryurl,
                    "title": "CODICE FISCALE",
                    "layerid": layer_id,
                    "filter": [
                            {
                                "attribute": "codice_fiscale",
                                "label": "CODICE FISCALE",
                                "input": {
                                    "type": "textfield",
                                    "options": {
                                        "blanktext": ""
                                    }
                                },
                                "op": "eq",
                                "logicop": "AND"
                            }
                    ],
                    "dozoomtoextent": True
                }})

        # Search name and surname
        # -------------------------
        if 'NS' in searches:
            data['values'].append({
                "id": "catasto_data_by_name_surname",
                "name": "Ricerca particelle catastali per NOME e COGNOME",
                "type": "search",
                "options": {
                    "querylayerid": layer_id,
                    "queryurl": queryurl,
                    "title": "Nome e Cognome",
                    "layerid": layer_id,
                    "return": "search",
                    "filter": [
                        {
                            "attribute": "name",
                            "label": "Nome",
                            "input": {
                                "type": "textfield",
                                "options": {
                                    "blanktext": ""
                                }
                            },
                            "op": "eq",
                            "logicop": "AND"
                        },
                        {
                            "attribute": "surname",
                            "label": "Cognome",
                            "input": {
                                "type": "textfield",
                                "options": {
                                    "blanktext": ""
                                }
                            },
                            "op": "eq",
                            "logicop": "AND"
                        }
                    ],
                    "dozoomtoextent": True
                }})

    return data
