from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.urls import reverse
from django.db import transaction
from django.db.models import Q
from django.http.response import HttpResponseForbidden, HttpResponseRedirect, JsonResponse
from django.views.generic import (
    ListView,
    DetailView,
    View,
)
from django.views.generic.detail import SingleObjectMixin
from django.views.decorators.csrf import csrf_exempt
from qdjango.models import *
from django.utils.decorators import method_decorator
from formtools.wizard.views import SessionWizardView
from guardian.decorators import permission_required
from guardian.shortcuts import get_objects_for_user
from collections import OrderedDict
from core.api.base.views import G3WAPIView
from core.api.authentication import CsrfExemptSessionAuthentication
from core.mixins.views import G3WRequestViewMixin, G3WAjaxDeleteViewMixin, G3WUploadFileViewMixin
from usersmanage.mixins.views import G3WACLViewMixin
from usersmanage.utils import get_user_groups_for_object
from usersmanage.forms import label_users
from .api.permissions import MakeCDUPermission
from .utils.cdu import CDU, ODT
from .models import Configs, Layers as CDULayers, CDUResult
from .forms import *

import json
import six


class CduConfigList(ListView):

    template_name = 'cdu/config_list.html'

    def get_queryset(self):
        return get_objects_for_user(self.request.user, 'cdu.view_configs', Configs).order_by('title')


class CduConfigWizardView(SessionWizardView):
    """
    Wizard forms for CDU configuration management
    """
    template_name = 'cdu/config_wizard.html'
    form_list = [
        cduConfigInitForm,
        cduConfigCatastoLayerForm,
        cduCatastoLayerFieldsForm,
        cduAgainstLayerFieldsForm,
        cduAgainstLayerFieldsAliasForm
    ]
    file_storage = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, 'tmp_cdu_odt_file'))

    editor_permission = ['change_configs', 'view_configs']
    viewer_permission = 'view_configs'

    def dispatch(self, request, *args, **kwargs):
        if 'slug' in kwargs:
            self.currentCduConfig = Configs.objects.get(slug=kwargs['slug'])
            if not request.user.has_perm('cdu.change_configs', self.currentCduConfig):
                return HttpResponseForbidden()
        else:
            if not request.user.has_perm('cdu.add_configs'):
                return HttpResponseForbidden()
        return super(CduConfigWizardView, self).dispatch(request, *args, **kwargs)

    def get_form_kwargs(self, step=None):
        if step == '0':
            return {'request': self.request}
        elif step == '1':
            project = self.get_cleaned_data_for_step('0')['project']
            self.layers_tree = project.tree()
            return {'project': self.get_cleaned_data_for_step('0')['project'], 'layers_tree': self.layers_tree}
        elif step == '2' or step == '3':
            toRet = {'catastoLayerFormData': self.get_cleaned_data_for_step('1')}
            if step == '3':
                toRet['catastoLayerFieldsFormData'] = self.get_cleaned_data_for_step('2')
            return toRet
        if step == '4':
            return {'againstLayerFieldFormData': self.get_cleaned_data_for_step('3'),
                    'catastoLayerFieldsFormData': self.get_cleaned_data_for_step('2')}
        else:
            return {}

    def get_form_initial(self, step):
        if 'slug' in self.kwargs:
            if step == '0':

                res = {}
                # get viewer users
                viewers = get_users_for_object(self.currentCduConfig, self.viewer_permission,
                                               [G3W_VIEWER1, G3W_VIEWER2], with_anonymous=True)
                res['viewer_users'] = [o.id for o in viewers]

                # get Editor level 1 users
                if self.request.user.is_superuser:
                    editor_users = get_users_for_object(self.currentCduConfig, self.editor_permission,
                                                        [G3W_EDITOR1])
                    if editor_users:
                        res['editor_user'] = editor_users[0].id

                if userHasGroups(self.request.user, [G3W_EDITOR1]) or self.request.user.is_superuser:
                    editor2_users = get_users_for_object(self.currentCduConfig, self.editor_permission,
                                                        [G3W_EDITOR2])
                    if editor2_users:
                        res['editor2_user'] = editor2_users[0].id

                # get initial editor and viewser user groups
                group_editors = get_user_groups_for_object(self.currentCduConfig, self.request.user,
                                                           self.editor_permission, 'editor')
                res['editor_user_groups'] = [o.id for o in group_editors]

                group_viewers = get_user_groups_for_object(self.currentCduConfig, self.request.user,
                                                            self.viewer_permission, 'viewer')
                res['viewer_user_groups'] = [o.id for o in group_viewers]

                return res



            elif step == '1':

                # get layers
                self.layerCatasto = self.currentCduConfig.layer_catasto()
                self.againstLayers = self.currentCduConfig.layers_against()
                return {
                    'catastoLayer': self.layerCatasto.layer.pk if self.layerCatasto is not None else None,
                    'againstLayers': [l.layer.pk for l in self.againstLayers]
                }
            elif step == '2':
                res = {
                    'foglio': self.layerCatasto.getFieldFoglio() if self.layerCatasto else None,
                    'particella': self.layerCatasto.getFieldParticella() if self.layerCatasto else None,
                    'sezione': self.layerCatasto.getFieldSezione() if self.layerCatasto else None,
                    'plusFieldsCatasto': [pf['name'] for pf in self.layerCatasto.getPlusFieldsCatasto()] if self.layerCatasto else []
                }

                #add alias
                current_l_ids = []
                for l in self.againstLayers:
                    if l.alias:
                        res[unicode2ascii(l.layer.name.rstrip())] = l.alias
                        current_l_ids.append(l.layer.id)


                new_againstLayers = Layer.objects.filter(project=self.currentCduConfig.project)\
                    .exclude(id__in=current_l_ids)

                for l in new_againstLayers:
                    res[unicode2ascii(l.name)] = l.name.capitalize().replace('_', ' ')

                return res
            elif step == '3':
                res = {
                    'alias_foglio': self.layerCatasto.getAliasFieldsCatasto()['foglio'] if self.layerCatasto else None,
                    'alias_particella': self.layerCatasto.getAliasFieldsCatasto()['particella'] if self.layerCatasto else None,
                    'alias_sezione': self.layerCatasto.getAliasFieldsCatasto().get('sezione', '') if self.layerCatasto else None
                }

                #add alias
                for l in self.againstLayers:
                    fields = l.getLayerFieldsData()
                    res[unicode2ascii(l.layer.name)] = [f['name'] for f in fields]
                #add alias for plusFieldsCatasto:
                plusFieldsCatasto = self.layerCatasto.getPlusFieldsCatasto() if self.layerCatasto else []
                for pf in plusFieldsCatasto:
                    res[unicode2ascii('plusFieldsCatasto_{}'.format(pf['name']))] = pf['alias']
                return res
            elif step == '4':
                res = {}
                #add alias
                for l in self.againstLayers:
                    fields = l.getLayerFieldsData()
                    for f in fields:
                        res[unicode2ascii(f['name'])] = f['alias']
                return res
        else:
            res = {}
            # case insert
            if step == '1':
                res['project_tree'] = json.dumps(self.layers_tree)

            elif step == '2':
                dataStep1 = self.get_cleaned_data_for_step('1')
                self.againstLayers = Layer.objects.filter(id__in=dataStep1['againstLayers'])
                for l in self.againstLayers:
                    res[unicode2ascii(l.name)] = l.name.capitalize().replace('_', ' ')
            elif step == '3':
                dataStep2 = self.get_cleaned_data_for_step('2')

                # for cadastre
                res['alias_foglio'] = 'Foglio'
                res['alias_particella'] = 'Particella'
                res['alias_sezione'] = 'Sezione'

                for f in dataStep2['plusFieldsCatasto']:
                    res['plusFieldsCatasto_{}'.format(f)] = f.capitalize().replace('_', ' ')
            elif step == '4':
                dataStep3 = self.get_cleaned_data_for_step('3')
                for k, v in dataStep3.items():
                    for f in v:
                        res[f] = f.capitalize().replace('_', ' ')
            return res
        return {}

    def get_form_instance(self, step):
        if 'slug' in self.kwargs:
            if step == '0':
                return self.currentCduConfig

    def get_context_data(self, form, **kwargs):
        context = super(CduConfigWizardView, self).get_context_data(form=form, **kwargs)

        # get data for older step
        context['data_step'] = OrderedDict()
        for step in range(0, int(context['wizard']['steps'].current)):
            try:
                stepContexData = getattr(self, '_getContextDataStep{}'.format(str(step)))()
            except:
                stepContexData = self.get_cleaned_data_for_step(str(step))
            context['data_step'][str(step)] = stepContexData

        return context

    def _getContextDataStep0(self):
        rawData = self.get_cleaned_data_for_step('0')
        return {
            'title': rawData['title'],
            'project': Project.objects.get(pk=rawData['project']),
            'odtfile': rawData['odtfile']
        }

    def _getContextDataStep1(self):
        rawData = self.get_cleaned_data_for_step('1')
        return {
            'catastoLayer': Layer.objects.get(pk=rawData['catastoLayer']),
            'againstLayers': Layer.objects.filter(pk__in=rawData['againstLayers']),
        }

    def _getContextDataStep2(self):
        rawData = self.get_cleaned_data_for_step('2')
        angainstLayerAlias = {key: value for key, value in rawData.items() if key not in ['foglio',
                                                                                          'particella',
                                                                                          'sezione',
                                                                                          'plusFieldsCatasto']}
        return {
            'foglio': rawData['foglio'],
            'particella': rawData['particella'],
            'sezione': rawData['sezione'],
            'plusFieldsCatasto': rawData['plusFieldsCatasto'],
            'angainstLayerAlias': angainstLayerAlias
        }

    def _create_update_or_delete_cdulayers(self, layers_data):

        CDULayers_id_saved = list()
        for layer_data in layers_data:
            CDUlayer, created = CDULayers.objects.get_or_create(
                layer=layer_data['layer'],
                config=layer_data['config'],
                defaults=layer_data['defaults']
                )
            if not created:
                CDUlayer.alias = layer_data['defaults'].get('alias', None)
                CDUlayer.fields = layer_data['defaults']['fields']
                CDUlayer.catasto = layer_data['defaults'].get('catasto', False)

                # Save layer
                CDUlayer.save()

            CDULayers_id_saved.append(CDUlayer.pk)

        # erase old layer
        layer_data['config'].layers_set.exclude(pk__in=CDULayers_id_saved).delete()

    def _serializeCatastoLayerFields(self, form_dict):
        return {
            'foglio': form_dict['2'].cleaned_data['foglio'],
            'particella': form_dict['2'].cleaned_data['particella'],
            'sezione': form_dict['2'].cleaned_data['sezione'],
            'plusFieldsCatasto': self._serializePlusFieldsCatastoFields(form_dict),
            'aliasFieldsCatasto': {
                'foglio': form_dict['3'].cleaned_data['alias_foglio'],
                'particella': form_dict['3'].cleaned_data['alias_particella'],
                'sezione': form_dict['3'].cleaned_data['alias_sezione'],
            }
        }

    def _serializeAgainstLayerFields(self, form_dict, layer):
        aliasFields = form_dict['4'].fieldsByLayers[unicode2ascii(layer.name.rstrip())]
        toSerialize = []
        for field in aliasFields:
            toSerialize.append({'name': field, 'alias': form_dict['4'].cleaned_data[unicode2ascii(field)]})
        return toSerialize

    def _serializePlusFieldsCatastoFields(self, form_dict):
        plusFieldsCatastoFields = form_dict['2'].cleaned_data['plusFieldsCatasto']
        toSerialize = []
        for field in plusFieldsCatastoFields:
            aliasPlusFieldsCatastoFieldName = unicode2ascii('plusFieldsCatasto_{}'.format(field))
            toSerialize.append({'name':field,'alias': form_dict['3'].cleaned_data[aliasPlusFieldsCatastoFieldName]})
        return toSerialize

    def _prepairAgainstLayersData(self, form_dict, cduConfig):
        res = []
        catasto_layer = form_dict['1'].cleaned_data['catastoLayer']
        for lid in form_dict['1'].cleaned_data['againstLayers']:
            if lid != catasto_layer:
                layer = Layer.objects.get(pk=lid)
                res.append({
                    'config': cduConfig,
                    'layer': layer,
                    'defaults': {
                        'fields': self._serializeAgainstLayerFields(form_dict, layer),
                        'alias': form_dict['2'].cleaned_data[unicode2ascii(layer.name.rstrip())]
                    }
                })
        return res

    def done(self, form_list, form_dict, **kwargs):
        """
        Wizard end star save data on db
        :param form_list:
        :param form_dict:
        :param kwargs:
        :return:
        """
        # build data for to save results
        with transaction.atomic():
            cdu_config = form_dict['0'].save()

            # configure data for Layers table
            layers_data = list()

            # build catasto layer data
            layers_data.append({
                'config': cdu_config,
                'layer': Layer.objects.get(pk=form_dict['1'].cleaned_data['catastoLayer']),
                'defaults': {
                    'fields': self._serializeCatastoLayerFields(form_dict),
                    'catasto': True
                }
            })

            #build against layers_data
            layers_data += self._prepairAgainstLayersData(form_dict, cdu_config)
            self._create_update_or_delete_cdulayers(layers_data)

        return HttpResponseRedirect(reverse('cdu-config-list'))


class CduConfigDetailView(DetailView):
    model = Configs
    template_name = 'cdu/config_detail.html'

    @method_decorator(permission_required('cdu.view_configs', (Configs, 'slug', 'slug'), return_403=True))
    def dispatch(self, *args, **kwargs):
        return super(CduConfigDetailView, self).dispatch(*args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(CduConfigDetailView, self).get_context_data(**kwargs)
        return context


class CduConfigDeleteView(G3WAjaxDeleteViewMixin, G3WRequestViewMixin, SingleObjectMixin, View):
    '''
    Delete group Ajax view
    '''
    model = Configs

    @method_decorator(permission_required('cud.delete_configs', (Configs, 'slug', 'slug'), return_403=True))
    def dispatch(self, *args, **kwargs):
        return super(CduConfigDeleteView, self).dispatch(*args, **kwargs)


class CduCalculateApiView(G3WAPIView):
    """
    Make calculation
    """

    authentication_classes = (
        CsrfExemptSessionAuthentication,
    )

    permission_classes = (
        MakeCDUPermission,
    )

    def post(self, request, **kwargs):

        features = json.loads(request.POST['features'])
        config = Configs.objects.get(pk=kwargs['id'])

        o_cdu = CDU(config)
        o_cdu.add_particelle(features)
        o_cdu.calculate()
        o_cdu.save_in_session(request)

        return JsonResponse(o_cdu.results)


class CduSaveApiView(G3WAPIView):
    """
    Save calculation results
    """

    authentication_classes = (
        CsrfExemptSessionAuthentication,
    )

    permission_classes = (
        MakeCDUPermission,
    )

    def post(self, request, **kwargs):

        # get cd config object
        config = Configs.objects.get(pk=kwargs['id'])

        # get title
        title = request.POST['title']

        o_cdu = CDU(config)
        results = o_cdu.get_from_session(request)

        # save or replace in db
        created, cduresult = CDUResult.objects.update_or_create({
            'config': config,
            'title': title,
            'result': results,
            'user': request.user
        }, {
            'title': title,
            'user': request.user
        })

        return JsonResponse(o_cdu.results)

import requests

class CduCreatedocView(View):
    """
    Create odt document with calculation results.
    """

    @method_decorator(permission_required('cdu.make_cdu', (Configs, 'pk', 'id'), return_403=True))
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super(CduCreatedocView, self).dispatch(*args, **kwargs)

    def post(self, request, **kwargs):

        # get cd config object
        config = Configs.objects.get(pk=kwargs['id'])

        o_cdu = CDU(config)
        results = o_cdu.get_from_session(request)

        # get selected rows
        selected_results_ids = request.POST['id'].split(',')

        # fet output format
        output_format = request.POST.get('format', 'odt')

        # get mapimage
        map_image = request.POST['map_image']

        odt = ODT.factory(config, results, result_ids_to_show=selected_results_ids, map_image=map_image,
                          output_format=output_format)

        odt.write_document()

        #---- test py3o.fusion for pdf print ---
        url = getattr(settings, 'CDU_PLUGIN_FUSION_URL', 'http://localhost:8765/form')

        fields = {
            "targetformat": 'odt',
            "datadict": json.dumps({'items': list(results.values()), 'lawItems': []}),
            "image_mapping": json.dumps({'map_image': 'staticimage.map_image'}),
            "ignore_undefined_variables": 1
        }

        files = {
            'tmpl_file': open(odt.config.odtfile.path, 'rb'),
            'map_image': open('{}{}'.format(settings.MEDIA_ROOT,
                                         odt.map_image.replace(settings.MEDIA_URL, '')), 'rb')
        }

        # finally POST our request on the endpoint
        r = requests.post(url, data=fields, files=files)

        files['tmpl_file'].close()
        files['map_image'].close()


        # see if it is a success or a failure
        # ATM the server only returns 400 errors... this may change
        if r.status_code == 400:
            # server says we have an error...
            # this means it properly catched the error and nicely
            # gave us some info in a JSON answer...
            # let's use this fact
            print (r.json())

        else:
            # if we're here it is because we should receive a new
            # file back

            # let's stream the file back here...
            chunk_size = 1024

            # fusion server will stream an ODT file content back
            path = getattr(settings, 'CDU_PLUGIN_TMP_DIR', '')
            outname = '%srequest_out.%s' % (path, 'odt')
            with open(outname, 'wb') as fd:
                for chunk in r.iter_content(chunk_size):
                    fd.write(chunk)

            # warn our dear user his file is ready
            print ("Your file: %s is ready" % outname)

        return odt.response()


class CduUploadFileView(G3WUploadFileViewMixin, View):

    sub_dir_upload = 'cdu'


@csrf_exempt
def jx_layers_by_groups(request):
    """
    Ajax view for select layers by layers groups
    :param request:
    :return:
    """

    # get layer by groups_layers
    group_layers = request.POST.getlist('groups[]')
    project_tree = json.loads(request.POST['tree'])

    def readLeaf(layer, against_layers):
        if isinstance(layer[0], six.string_types) and layer[0].startswith('g_'):
            children = []
            for node in layer[1]:
                readLeaf(node, against_layers)
        else:
            against_layers.append(layer[0])

    # get againts layers by project tree
    against_layers = []
    for l in project_tree:
        if isinstance(l[0], six.string_types) and l[0].startswith('g_') and l[0][2:] in group_layers:
            readLeaf(l, against_layers)

    return JsonResponse({'id': against_layers})


class UsersGroupsConfigView(View):
    """
    Return users for project
    """
    viewer_permission = 'view_project'
    viewer_permission_configs = 'make_cdu'
    editor_permission = 'change_project'
    editor_permission_configs = 'change_configs'

    def dispatch(self, request, *args, **kwargs):
        return super(UsersGroupsConfigView, self).dispatch(request, *args, **kwargs)

    def get(self, *args, **kwargs):

        # object to send with response
        to_res = {}

        # get project from url
        project = Project.objects.get(pk=self.request.GET['project_id'])

        # get cdu config from url if is set
        try:
            cdu_config = Configs.objects.get(pk=self.request.GET['configs_id'])
        except:
            cdu_config = None


        # Editor Level 1 users:
        # ===============================================================================
        # get every Editor level 1 users for project
        editor_users = get_users_for_object(project, self.editor_permission, [G3W_EDITOR1],
                                       with_anonymous=False)

        editor_users_selected = []
        if cdu_config:
            editor_users_selected = get_users_for_object(cdu_config, self.editor_permission_configs, [G3W_EDITOR1],
                                       with_anonymous=False)

        # add Editor level 1 to response
        to_res.update({
        'editor_users': [
            {
                'id': '',
                'text': '------',
                'selected': bool(len(editor_users_selected))
            }
                        ]+[
            {
                'id': editor1.pk,
                'text': label_users(editor1),
                'selected': editor1 in editor_users_selected
            } for editor1 in editor_users
        ]})

        # Editor Level 2 users:
        # ===============================================================================
        # get every Editor level 2 users for project
        editor2_users = get_users_for_object(project, self.editor_permission, [G3W_EDITOR2],
                                            with_anonymous=False)

        editor2_users_selected = {}
        if cdu_config:
            editor2_users_selected = get_users_for_object(cdu_config, self.editor_permission_configs, [G3W_EDITOR2],
                                                         with_anonymous=False)

        # add Editor level 1 to response
        to_res.update({
            'editor2_users': [
                {
                    'id': '',
                    'text': '------',
                    'selected': bool(len(editor2_users_selected))
                }
                        ]+[
                {
                    'id': editor2.pk,
                    'text': label_users(editor2),
                    'selected': editor2 in editor2_users_selected
                } for editor2 in editor2_users
            ]})


        # Viewer Level 1 users:
        # ===============================================================================
        # get every Viewer level 1 users for project
        viewer_users = get_users_for_object(project, self.viewer_permission, [G3W_VIEWER1, G3W_VIEWER2],
                                             with_anonymous=True)

        viewer_users_selected = {}
        if cdu_config:
            viewer_users_selected = get_users_for_object(cdu_config, self.viewer_permission_configs,
                                                         [G3W_VIEWER1, G3W_VIEWER2], with_anonymous=True)

        # add Editor level 1 to response
        to_res.update({
            'viewer_users': [
                 {
                     'id': viewer.pk,
                     'text': label_users(viewer),
                     'selected': viewer in viewer_users_selected
                 } for viewer in viewer_users
             ]})

        # Editor group users:
        # ===============================================================================
        # get every Group editor users
        group_editors = get_user_groups_for_object(project, self.request.user, self.editor_permission, 'editor')

        group_editors_selected = {}
        if cdu_config:
            group_editors_selected = get_user_groups_for_object(
                cdu_config,
                self.request.user,
                self.editor_permission_configs,
                'editor')

        # add Edito group users to res
        to_res.update({
            'group_editors': [
                {
                    'id': group.pk,
                    'text': group.name,
                    'selected': group in group_editors_selected
                } for group in group_editors
            ]})

        # Viewer group users:
        # ===============================================================================
        # get every Viewer editor users
        viewer_editors = get_user_groups_for_object(project, self.request.user, self.viewer_permission, 'viewer')

        viewer_editors_selected = {}
        if cdu_config:
            viewer_editors_selected = get_user_groups_for_object(
                cdu_config,
                self.request.user,
                self.viewer_permission_configs,
                'viewer')

        # add Edito viewer users to res
        to_res.update({
            'group_viewers': [
                {
                    'id': viewer.pk,
                    'text': viewer.name,
                    'selected': viewer in viewer_editors_selected
                } for viewer in viewer_editors
            ]})

        return JsonResponse(to_res)




