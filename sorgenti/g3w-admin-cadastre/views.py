# -*- coding: utf-8 -*-
from __future__ import absolute_import
from django.views.generic import TemplateView, View, FormView, DetailView, ListView, CreateView, UpdateView
from django.views.generic.detail import SingleObjectMixin
from django.http import HttpResponse, JsonResponse
from django.utils.decorators import method_decorator
from django.urls import reverse
from django.views.static import serve
from django.db import connections
from django.core.exceptions import ObjectDoesNotExist
from django.template import loader
from guardian.decorators import permission_required
from rest_framework.views import APIView
from rest_framework.exceptions import APIException
from rest_framework.response import Response
try:
    from weasyprint import HTML as WeasyHTML, CSS as WeasyCSS
except:
    pass
from usersmanage.decorators import user_passes_test_or_403
from zipfile import ZipFile
import os
import re
from django.urls import reverse
from django.shortcuts import redirect
from django.http import JsonResponse
from core.mixins.views import G3WAjaxDeleteViewMixin, G3WRequestViewMixin
from core.api.base.views import G3WAPIView
#from core.utils.models import create_geomodel_from_qdjango_layer
from usersmanage.forms import label_users
from usersmanage.utils import get_viewers_for_object
from qdjango.vector import LayerVectorView
from usersmanage.decorators import user_passes_test_or_403
from .acl import check_for_user
from .forms import *
from .utils.structure import readFilePRM, Elemento, ElementoCatastale
from .utils.db import truncateTable
from .utils.data import DatiDOCFA, FornituraDOC, FornituraDC, FornituraDM_PL, loadSUPdata, get_archivi_docfa
from .utils import get_celery_worker_status, getLayerCadastreIdByName
from .tasks import load_catasto_data, load_docfa_data, load_cxf_data
from .celery import app
from .api.serializers import *
from .mixins.api import CadastreApiViewMixin
from .signals import load_cadastre_dashboard_widgets
from .models import ConfigImportCxf, ConfigUserCadastre
from .utils import get_data_for_widget_search
from celery.result import AsyncResult
from celery import states
from datetime import datetime
import tempfile
import json
try:
    from cStringIO import StringIO
except ImportError:
    try:
        from io import StringIO
    except:
        from StringIO import StringIO

import logging

logger = logging.getLogger('cadastre.debug')


class DashboardView(TemplateView):

    template_name = 'cadastre/dashboard.html'

    @method_decorator(user_passes_test_or_403(lambda u: u.is_superuser))
    def dispatch(self, request, *args, **kwargs):
        return super(DashboardView, self).dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(DashboardView, self).get_context_data(**kwargs)

        # set config_data
        context['config_data'] = Config.objects.all()

        # get report data from cadastre table db
        cur = connections[settings.CADASTRE_DATABASE].cursor()
        dati = DatiDOCFA()
        for layerName, layerData in CADASTRE_DATA_LAYERS.items():
            tableName = layerData['model']._meta.db_table
            cur.execute("ANALYZE {}".format(tableName))
            cur.execute("SELECT reltuples AS approximate_row_count FROM pg_class WHERE relname = '{}'".format(
                tableName))
            context['n_{}'.format(tableName)] = int(cur.fetchone()[0])

        cur.close()

        context['widgets'] = []
        dashboard_widgets = load_cadastre_dashboard_widgets.send(self)
        for widget in dashboard_widgets:
            context['widgets'].append(widget[1])

        return context


class CheckDataView(TemplateView):

    template_name = 'cadastre/checkdata.html'

    def get(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)
        res = AsyncResult(request.session.get('task'))

        context['status'] = res.ready()
        context['results'] = res.get()

        return self.render_to_response(context)


class LoadDataView(TemplateView):

    template_name = 'cadastre/loaddata.html'

    #@method_decorator(user_passes_test_or_403(lambda u: u.is_superuser))
    @method_decorator(permission_required('cadastre.add_prm', return_403=True))
    def get(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)

        # filter by user main role
        if request.user.is_superuser:

            # get prm adn other row value and show as table
            context['catasto_list'] = Prm.objects.order_by('-created').all()
            context['docfa_list'] = ImportDOCFA.objects.order_by('-created').all()
            context['cxf_list'] = ImportCatasto.objects.order_by('-created').all()
        else:

            # for editor user get codice_comune
            try:
                conf = ConfigUserCadastre.objects.filter(user=request.user)
                codici_comune = [c.codice_comune for c in conf]

                # for sezione case we have to concatenate
                qfilter = None
                for c in conf:
                    if qfilter:
                        qfilter = qfilter | Q(codice_comune__startswith=c.codice_comune)
                    else:
                        qfilter = Q(codice_comune__startswith=c.codice_comune)

                context['catasto_list'] = Prm.objects.filter(qfilter).order_by('created')
                context['docfa_list'] = ImportDOCFA.objects.filter(qfilter).order_by('created')
                context['cxf_list'] = ImportCatasto.objects.filter(qfilter).order_by('created')
            except:
                context['catasto_list'] = context['docfa_list'] = context['cxf_list'] = []

        context['can_upload'] = True

        # add fornitura types
        context['tp_forniture'] = TP_FORNITURE

        # add icons:
        context['icons'] = {
            'FAB': 'icon_fab.png',
            'TER': 'icon_ter.png'
        }

        # get last one to chek if possible upload another zip file
        for fornitura in ('catasto_list', 'docfa_list', 'cxf_list'):
            if context['can_upload'] == True:
                try:
                    lastone = context[fornitura][0]
                    if bool(lastone.task_id):
                        if lastone.task_id[0:5] != CMD_TASK_ID_PREFIX:
                            res_task = AsyncResult(lastone.task_id)
                            if not res_task.ready():
                                context['can_upload'] = False
                except Exception:
                    pass

        return self.render_to_response(context)


class UploadDataView(G3WAPIView):

    tipoTit = None
    tipoFornitura = None

    def _fornituraCXF(self, request):
        """
        Gestisce l'upload dei file delle forniture CXF SUP
        """

        post_file = request.FILES['files[]'] if request.FILES else None

        # save file in fs:
        # create a tmp file
        tmpZip = tempfile.NamedTemporaryFile(suffix='.zip', mode='w+b', dir=self.tmp_dir, delete=False)
        with tmpZip as destination:
            for chunk in post_file.chunks():
                destination.write(chunk)
        tmpZip.close()

        file = tmpZip.name
        self.zfile = ZipFile(file, 'r')
        zfileInfoList = self.zfile.infolist()
        self.archiviCXF = {}

        importCXF = ImportCatasto()
        importCXF.file = post_file
        data_SUP = {}
        fogli = []
        n_files = 0

        # todo: add check and validation by connection for codice_catasto and for user
        old_codice_comune = None
        for zfileInfo in zfileInfoList:
            output = re.match(r'[a-zA-Z0-9_]*\.(cxf|sup)?',
                               zfileInfo.filename, flags=re.IGNORECASE)
            if not output:
                raise Exception('Il file {} non ha un formato \'CXF/SUP\' corretto'.format(zfileInfo.filename))
            else:
                elements = zfileInfo.filename.split('.')
                codice_comune = elements[0][0:4]
                if old_codice_comune:
                    if old_codice_comune != codice_comune:
                        raise Exception('Non è possibile caricare CSX/SUP file di comuni differenti')
                else:
                    old_codice_comune = codice_comune

                importCXF.codice_comune = codice_comune
                fogli.append(elements[0][4:-2])
                n_files += 1

                # is sup file analize and get first rows
                if elements[1].lower() == 'sup':
                    loadSUPdata(self.zfile, zfileInfo, data_SUP)

        # check user codcie_comune:
        self._check_codice_comune_user(request.user, codice_comune)

        # check connection dof database cxf exists
        if not ConfigImportCxf.objects.filter(codice_comune=codice_comune).exists():
            raise Exception('Spiacente, ma non è presente nessuna connessione per questo codice comune')

        self.zfile.close()

        task_id = load_cxf_data.delay(file, data_SUP)

        # put import data
        importCXF.task_id = task_id
        importCXF.fogli = ' | '.join(fogli)
        importCXF.n_file = n_files
        importCXF.sup_data = json.dumps(data_SUP)
        importCXF.save()

    def _fornituraDOCFA(self, request):
        """
        Gestisce l'upload dei file delle forniture DOCFA
        """

        post_file = request.FILES['files[]'] if request.FILES else None

        # save file in fs:
        # create a tmp file
        tmpZip = tempfile.NamedTemporaryFile(suffix='.zip', mode='w+b', dir=self.tmp_dir, delete=False)
        with tmpZip as destination:
            for chunk in post_file.chunks():
                destination.write(chunk)
        tmpZip.close()

        file = tmpZip.name
        self.zfile = ZipFile(file, 'r')
        zfileInfoList = self.zfile.infolist()
        self.archiviDocfa = {}

        importDOCFA = ImportDOCFA()
        importDOCFA.file = post_file

        # validation zip data files:
        dati = DatiDOCFA()

        # read unique DOCFA fornitura zip file
        get_archivi_docfa(self.zfile, dati, self.archiviDocfa)

        # check user codcie_comune:
        self._check_codice_comune_user(request.user, dati.codice_comune)

        self.zfile.close()

        # start celery process
        task_id = load_docfa_data.delay(tmpZip.name)

        if not bool(task_id):
            raise Exception('Processo celery non avviato, contattare l\'amministratore se l\'errore persiste')

        importDOCFA.task_id = task_id
        importDOCFA.codice_comune = dati.codice_comune
        importDOCFA.nome_fornitura = dati.nome_fornitura
        importDOCFA.save()

    def _fornituraCATASTO(self, request):
        """
        Gestisce l'upload dei file delle forniture Catasto terreni e fabbricati
        """

        self.unitaImmobiliari = []
        self.prm = None

        post_file = request.FILES['files[]'] if request.FILES else None

        # save file in fs:
        # create a tmp file
        tmpZip = tempfile.NamedTemporaryFile(suffix='.zip', mode='w+b', dir=self.tmp_dir, delete=False)
        with tmpZip as destination:
            for chunk in post_file.chunks():
                destination.write(chunk)
        tmpZip.close()

        file = tmpZip.name
        self.zfile = ZipFile(file, 'r')
        zfileInfoList = self.zfile.infolist()

        # Get file PRM for upload data info
        for zfileInfo in zfileInfoList:
            # get extension
            name, ext = os.path.splitext(zfileInfo.filename)
            ext = ext[1:].upper()
            if ext == 'PRM':
                f = self.zfile.open(zfileInfo, 'r')
                self.prm = readFilePRM(f)
                f.close()

                # check user codcie_comune:
                self._check_codice_comune_user(request.user, self.prm.codice_comune[0:4])

                # check if a actual situation exist for the import type
                if not self.prm.is_aggiornamento and len(Prm.objects.filter(
                        codice_comune=self.prm.codice_comune,
                        tipo_fornitura=self.tipoFornitura,
                        is_aggiornamento=False
                )) > 0:
                    raise Exception('Spiacente ma per il comune {} è gia stata caricata una attualità. '
                                    'Puoi caricare solo aggiornamenti',
                                    format(self.prm.codice_comune))

            elif ext == 'FAB':
                if self.tipoTit == 'TER':
                    raise Exception('Zip file non corretto file FAB e TER presenti insieme')
                self.tipoTit = 'FAB'
            elif ext == 'TER':
                if self.tipoTit == 'FAB':
                    raise Exception('Zip file non corretto file FAB e TER presenti insieme')
                self.tipoTit = 'TER'

        if self.tipoTit is None or self.prm is None:
            raise Exception('Zip file non corretto mancano file FAB o TER o PRM')


        # check fi celery worker is ruinning:
        worker_status = get_celery_worker_status()
        if 'ERROR' in worker_status:
            raise Exception(worker_status['ERROR'])

        self.prm.tipo_fornitura = self.tipoTit

        # check on date for progressive update insert
        # raise Exception('Non è possibile inserire un aggiornamento con data precedente all\'ultimo')

        self.zfile.close()

        self.prm.task_id = load_catasto_data.delay(tmpZip.name, self.tipoTit, is_aggiornamento=self.prm.is_aggiornamento)


        if not bool(self.prm.task_id):
            raise Exception('Processo celery non avviato, contattare l\'amminisrtratore se l\'errore persiste')

        # save prm data
        self.prm.file = post_file
        self.prm.save()

    def _check_codice_comune_user(self, user, codice_comune):
        """
        Check if editor 1 user can upload data
        """

        # admin can upload
        if user.is_superuser:
            return

        # check for user:
        if not ConfigUserCadastre.objects.filter(user=user, codice_comune=codice_comune).exists():
            raise Exception('Spiacente ma non si abilitato a caricare dati del codice comune:{}'.format(codice_comune))


    @method_decorator(permission_required('cadastre.add_prm', return_403=True))
    def post(self, request, *args, **kwargs):

        self.tipoFornitura = request.POST['tipo_fornitura']

        method = "_fornitura{}".format(self.tipoFornitura)

        if hasattr(settings, 'CADASTRE_TMP_DIR') and settings.CADASTRE_TMP_DIR:
            self.tmp_dir = settings.CADASTRE_TMP_DIR
        else:
            self.tmp_dir = '/tmp'

        try:
            if hasattr(self, method):
                getattr(self, method)(request)
        except Exception as e:
            return Response(self.results.update({
                'result': False,
                'errors': str(e)
            }).results, status=500)
        return JsonResponse(self.results.results)


class PrmDeleteView(G3WAjaxDeleteViewMixin, SingleObjectMixin, View):
    """
    Delete Prm row
    """
    model = Prm


    def post(self, request, *args, **kwargs):
        self.object = self.get_object()

        # check status
        if bool(self.object.task_id):
            if self.object.task_id[0:5] == CMD_TASK_ID_PREFIX:
                status = 'IMPORTED BY SCRIPT'
            else:
                res = AsyncResult(self.object.task_id)
                status = res.status
            if status == states.PENDING:
                raise Exception('Task in state PENDING, is not possible delete it')

        self.object.file.delete()
        return super(PrmDeleteView, self).post(request, *args, **kwargs)


class ImportCxfDeleteView(G3WAjaxDeleteViewMixin, SingleObjectMixin, View):
    """
    Delete ImportCXF row
    """
    model = ImportCatasto

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()

        # check status
        if bool(self.object.task_id):
            res = AsyncResult(self.object.task_id)
            if res.status == states.PENDING:
                raise Exception('Task in state PENDING, is not possible delete it')

        self.object.file.delete()
        return super(ImportCxfDeleteView, self).post(request, *args, **kwargs)


class CxfDetailView(G3WRequestViewMixin, DetailView):
    """Detail view for cxf"""
    model = ImportCatasto
    template_name = 'cadastre/ajax/cxf_detail.html'

    @method_decorator(permission_required('cadastre.add_importcatasto', return_403=True))
    def dispatch(self, *args, **kwargs):
        return super(CxfDetailView, self).dispatch(*args, **kwargs)


class PrmDetailView(G3WRequestViewMixin, DetailView):
    """Detail view."""
    model = Prm
    template_name = 'cadastre/ajax/prm_detail.html'

    @method_decorator(permission_required('cadastre.add_prm', return_403=True))
    def dispatch(self, *args, **kwargs):
        return super(PrmDetailView, self).dispatch(*args, **kwargs)


class ImportDOCFADeleteView(PrmDeleteView):
    """
    Delete Importdocfa row
    """
    model = ImportDOCFA


class RevokeTerminateView(SingleObjectMixin, View):
    """
    Delete law article Ajax view
    """
    def post(self, request, *args, **kwargs):
        app.control.revoke(kwargs['task_id'], terminate=True, signal='SIGKILL')
        return JsonResponse({'revoked': True})


class ClearDBByTaksIdView(SingleObjectMixin, View):
    """
    Delete row elements from db selectd by celery task_id
    """

    def post(self, request, *args, **kwargs):

        task_id = kwargs['task_id']

        # try before for prm else docfa
        try:
            # select by prm:
            prm = Prm.objects.get(task_id=task_id)

            if prm.tipo_fornitura == 'FAB':

                clearTable = [
                    'unita_immobiliari',
                    'identificativi_immobiliari',
                    'indirizzi',
                    'utilita_comuni_ui',
                    'riserve_ui'
                ]
            else:
                clearTable = [
                    'caratteristiche_particella',
                    'particella',
                    'riserve_particella',
                    'porzioni_particella',
                    'persona_fisica',
                    'persona_giuridica',
                    'deduzioni_particella'
                ]

            # add dati_atto and titolarita for every type
            clearTable.append('titolarita')
            clearTable.append('dati_atto')

        except ObjectDoesNotExist:

            try:
                importDOCFA = ImportDOCFA.objects.get(task_id=task_id)
                clearTable = [
                    'relazione_fabbricati_docfa',
                    'relazione_uiu_docfa',
                    'dati_m_docfa',
                    'docfa',
                    'planimetrie'
                ]
            except ObjectDoesNotExist:

                importcatasto = ImportCatasto.objects.get(task_id=task_id)

                clearTable = [
                    'catasto'
                ]


        deleted_rows = {}
        cur = connections[settings.CADASTRE_DATABASE].cursor()
        for table in clearTable:
            cur.execute("SELECT count(*) as count FROM {} WHERE task_id='{}'".format(table, task_id))
            if table not in deleted_rows.keys():
                deleted_rows[table] = []
            res = cur.fetchone()
            deleted_rows[table].append(res[0])
            cur.execute("DELETE FROM {} WHERE task_id = '{}'".format(table, task_id))
        cur.close()

        return JsonResponse({'cleared': True, 'deleted_rows': deleted_rows})


class ClearDBView(SingleObjectMixin, View):
    """
    Delete row elements from db selectd by celery task_id
    """

    def post(self, request, *args, **kwargs):

        clearTable = [
            'unita_immobiliari',
            'identificativi_immobiliari',
            'indirizzi',
            'utilita_comuni_ui',
            'riserve_ui',
            'caratteristiche_particella',
            'particella',
            'riserve_particella',
            'porzioni_particella',
            'persona_fisica',
            'persona_giuridica',
            'deduzioni_particella',
            'titolarita',
            'dati_atto'
        ]

        deleted_rows = {}
        cur = connections[settings.CADASTRE_DATABASE].cursor()
        for table in clearTable:
            cur.execute("SELECT count(*) as count FROM {}".format(table))
            if table not in deleted_rows.keys():
                deleted_rows[table] = []
            res = cur.fetchone()
            deleted_rows[table].append(res[0])
            cur.execute("DELETE FROM {}".format(table))
        cur.close()

        return JsonResponse({'cleared': True, 'deleted_rows': deleted_rows})


class TaskTracebackView(TemplateView):

    template_name = "cadastre/task_traceback.html"

    def get_context_data(self, **kwargs):
        context = super(TaskTracebackView, self).get_context_data(**kwargs)

        context['res'] = AsyncResult(kwargs['task_id'])
        context['traceback_html'] = context['res'].traceback.replace('\n', '<br>')
        return context


class ConfigListView(ListView):
    """
    List Config view, show Qdjango project activated and viwer users selcted.
    """
    model = Config

    @method_decorator(user_passes_test_or_403(lambda u: u.is_superuser))
    def dispatch(self, request, *args, **kwargs):
        return super(ConfigListView, self).dispatch(request, *args, **kwargs)


class ConfigCreateView(G3WRequestViewMixin, CreateView):
    """ Main configuration cadastre-project view create """

    form_class = ConfigForm
    template_name = 'cadastre/config.html'
    viewer_permission = 'view_project'

    @method_decorator(permission_required('cadastre.add_prm', return_403=True))
    def dispatch(self, request, *args, **kwargs):
        return super(ConfigCreateView, self).dispatch(request, *args, **kwargs)

    def get_success_url(self):
        return reverse('cadastre-config')


class ConfigUpdateView(G3WRequestViewMixin, UpdateView):

    form_class = ConfigForm
    model = Config
    template_name = 'cadastre/config.html'
    viewer_permission = 'view_project'

    @method_decorator(user_passes_test_or_403(lambda u: u.is_superuser))
    def dispatch(self, request, *args, **kwargs):
        return super(ConfigUpdateView, self).dispatch(request, *args, **kwargs)

    def get_success_url(self):
        return reverse('cadastre-config')

    def get_form_kwargs(self):
        """
        Returns the keyword arguments for instantiating the form.
        """
        self.get_object()
        kwargs = super(ConfigUpdateView, self).get_form_kwargs()
        kwargs.update({'instance': self.object})

        # give initial viewer users and viewer user groups
        viewers = get_viewers_for_object(self.object.project, self.request.user, 'edit_cadastre_association')
        kwargs['initial']['viewer_users'] = [o.id for o in viewers]
        viewer_groups = get_user_groups_for_object(self.object.project, self.request.user, 'edit_cadastre_association',
                                                   'viewer')
        kwargs['initial']['viewer_user_groups'] = [o.id for o in viewer_groups]

        return kwargs


class ConfigDeleteView(G3WAjaxDeleteViewMixin, G3WRequestViewMixin, SingleObjectMixin, View):
    '''
    Delete cadastre config Ajax view
    '''
    model = Config

    @method_decorator(permission_required('cadastre.add_prm', return_403=True))
    def dispatch(self, *args, **kwargs):
        return super(ConfigDeleteView, self).dispatch(*args, **kwargs)

    def post(self, request, *args, **kwargs):

        self.object = self.get_object()

        # remove permissions before
        # to Viewer level 1
        self.object.removePermissionsToViewers(
            users_id=[
                u.pk for u in get_viewers_for_object(self.object.project, self.request.user,
                                                     'edit_cadastre_association')
            ]
        )

        # to viwer user groups
        self.object.remove_permissions_to_viewer_user_groups(
            [ug.pk for ug in get_user_groups_for_object(self.object.project,
                                                        self.request.user, 'edit_cadastre_association',
                                                        'viewer')]
        )

        res = super(ConfigDeleteView, self).post(request, *args, **kwargs)


        return res


class ConfigView(G3WRequestViewMixin, FormView):
    """
    View to config qdjango project to work with module
    """
    form_class = ConfigForm
    template_name = 'cadastre/config.html'
    viewer_permission = 'view_project'

    @method_decorator(user_passes_test_or_403(lambda u: u.is_superuser))
    def dispatch(self, request, *args, **kwargs):
        return super(ConfigView, self).dispatch(request, *args, **kwargs)

    def get_success_url(self):
        return reverse('cadastre-dashboard')

    def get_object(self):
        self.object = Config.getData()

    def get_form_kwargs(self):
        """
        Returns the keyword arguments for instantiating the form.
        """
        self.get_object()
        kwargs = super(ConfigView, self).get_form_kwargs()
        kwargs.update({'instance': self.object})

        # get viewer users
        # viewers = get_users_for_object(self.object.project, self.viewer_permission, [G3W_VIEWER1, G3W_VIEWER2],
        #                               with_anonymous=False)

        # get every users have permission 'edit_iternet_layers'
        uobjects = get_objects_by_perm(Project, 'edit_cadastre_association')
        viewers = [u.user for u in uobjects]

        kwargs['initial']['viewer_users'] = [o.id for o in viewers]
        return kwargs

    def form_valid(self, form):
        self.object = form.save()
        return super(ConfigView, self).form_valid(form)


class ViewerUsersConfigView(View):
    """
    Return viewer_users for project
    """
    viewer_permission = 'view_project'

    @method_decorator(user_passes_test_or_403(lambda u: u.is_superuser))
    def dispatch(self, request, *args, **kwargs):
        return super(ViewerUsersConfigView, self).dispatch(request, *args, **kwargs)

    def get(self, *args, **kwargs):
        # get viewer users
        project = Project.objects.get(pk=self.request.GET['project_id'])
        viewers = get_users_for_object(project, self.viewer_permission, [G3W_VIEWER1, G3W_VIEWER2],
                                       with_anonymous=False)
        viewers_to_edit = get_users_for_object(project, 'edit_cadastre_association', [G3W_VIEWER1, G3W_VIEWER2],
                                               with_anonymous=False)

        group_viewers = get_user_groups_for_object(project, self.request.user, 'view_project', 'viewer')
        group_viewers_to_edit = get_user_groups_for_object(project, self.request.user, 'edit_cadastre_association',
                                                           'viewer')


        return JsonResponse({
            'viewer_users': [
                {
                    'id': viewer.pk,
                    'text': label_users(viewer),
                    'selected': viewer in viewers_to_edit
                } for viewer in viewers
            ],
            'group_viewers': [
                {
                    'id': gviewer.pk,
                    'text': gviewer.name,
                    'selected': gviewer in group_viewers_to_edit
                } for gviewer in group_viewers
            ]
        })


class LayersConfigView(View):
    """
    Return layers for project
    """

    @method_decorator(user_passes_test_or_403(lambda u: u.is_superuser))
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, *args, **kwargs):
        # get viewer users
        layers = Project.objects.get(pk=self.request.GET['project_id']).layer_set.all()
        try:
            config = Config.objects.get(pk=self.request.GET['config_id'])
        except:
            config = None

        cadastre_layers = []
        if config:
            cadastre_layers = [clayer.layer for clayer in config.configlayer_set.all()]

        return JsonResponse({
            'layers': [
                {
                    'id': layer.pk,
                    'text': layer.title,
                    'selected': layer in cadastre_layers
                } for layer in layers
            ]
        })


class ElementoCatastaleApiViewMixin(object):

    @method_decorator(user_passes_test_or_403(check_for_user))
    def get(self, request, project_id):
        super(ElementoCatastaleApiViewMixin, self).get(request, project_id)

        # logging if set in config
        if hasattr(settings, 'CADASTRE_ACCESS_DATA_LOGGING') and settings.CADASTRE_ACCESS_DATA_LOGGING:

            data_type = 'FAB' if isinstance(self, FabbricatoApiView) else 'TER'

            CadastreDataAccessLog.objects.create(user=request.user.username, msg=json.dumps({
                'foglio': self.foglio,
                'numero': self.numero,
                'sezione': self.sezione
            }), type=data_type)

        return self.response(ElementoCatastale(foglio=self.foglio, numero=self.numero, sezione=self.sezione,
                                               codice_comune=self.codice_comune))


class TerrenoApiView(ElementoCatastaleApiViewMixin, CadastreApiViewMixin, APIView):

    def response(self, elemento_catastale):

        terrenoSerializer = TerrenoSerializer(elemento_catastale)

        return Response(terrenoSerializer.data)


class FabbricatoApiView(ElementoCatastaleApiViewMixin, CadastreApiViewMixin, APIView):

    def response(self, elemento_catastale):

        fabbricatoSerializer = FabbricatoSerializer(elemento_catastale)

        return Response(fabbricatoSerializer.data)


class SubElementoCatastaleApiViewMixin(object):

    key_get = None

    @method_decorator(user_passes_test_or_403(check_for_user))
    def get(self, request, project_id):

        if self.key_get not in request.GET:
            raise APIException('You have to set {} as parameter'.format(self.key_get))
        setattr(self, self.key_get, request.GET[self.key_get])

        # get codice_comune for querying:
        codice_comune = Config.objects.get(project_id=project_id).codice_comune

        return self.response(Elemento(**{
            self.key_get: getattr(self, self.key_get),
            'codice_comune': codice_comune,
            'project_id': project_id
        }))


class ParticellaApiView(SubElementoCatastaleApiViewMixin, APIView):
    """
    Ritorna i dati del censuario della particella
    """

    key_get = 'id_particella'

    def response(self, elemento):
        return Response(ParticellaSerializer(elemento).data)


class ImmobileApiView(SubElementoCatastaleApiViewMixin, APIView):
    """
    Ritorna i dati del censuario dell'immobile
    """

    key_get = 'id_immobile'

    def response(self, elemento):
        return Response(ImmobileSerializer(elemento).data)


class PlanimetriaServeView(View):

    @method_decorator(user_passes_test_or_403(check_for_user))
    def get(self, request, *args, **kwargs):

        response = serve(request, kwargs['path'], kwargs['document_root'], False)

        # get file
        file = kwargs['path'].split('/')
        file_to_stream = file[1] if len(file) > 1 else file[0]
        response['Content-Type'] = 'image/tiff'
        response['Content-Disposition'] = 'attachment; filename="{}.tiff"'.format(file_to_stream)

        return response


class ProtocolliDOCFAPdfServeView(View):

    @method_decorator(user_passes_test_or_403(check_for_user))
    def get(self, request, *args, **kwargs):

        response = serve(request, kwargs['path'], kwargs['document_root'], False)
        return response


class PdfDOCFAView(View):

    def get(self, request, *args, **kwargs):

        html = loader.get_template('cadastre/pdf/test.html')
        css = loader.get_template('cadastre/pdf/test.css')


        pdf = WeasyHTML(string=html.render())
        css_pdf = WeasyCSS(string=css.render())

        pdf_document = pdf.render(stylesheets=[css_pdf])

        response = HttpResponse(pdf_document.write_pdf(), content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="test.pdf"'

        return response


class LoadDataInfoView(TemplateView):
    """
    View to show info html for load data
    """
    template_name = 'cadastre/loaddatainfo.html'

from qdjango.ows import OWSRequestHandler


class SearchByCFView(View):
    """
    Execute a search for CF on cadastre layer
    """

    def widget_search_cf_response(self, data_project, soggetti, filter_layer_id):
        """
        Create a widget search response, as like send into project config API
        :param soggetti: QuerySet of PersonaFisica
        :return: APIview with json widget search
        """

        # No results
        if len(soggetti) == 0:
            return JsonResponse({})

        #layer_id, queryurl = get_data_for_widget_search(data_project)

        layer_ids = get_data_for_widget_search(data_project)


        cfs = []
        for s in soggetti:
            if s.codice_fiscale:
                cfs.append(s.codice_fiscale)

        for layer_id, queryurl, layer_title in layer_ids:

            if filter_layer_id == layer_id:
                return JsonResponse({
                        "id": "catasto_data_by_cf",
                        "name": "La ricerca per Nome e Cognome ha identificato i seguenti Codici Fiscali",
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
                                            "type": "selectfield",
                                            "options": {
                                                "values": cfs
                                            }
                                        },
                                        "op": "eq",
                                        "logicop": "AND"
                                    }
                            ],
                            "dozoomtoextent": True,
                            "return": "data"
                        }})

    def get(self, request, *args, **kwargs):

        q = self.request.GET.copy()

        # get cadastre config obj
        qgis_project = Project.objects.get(pk=kwargs['project_id'])
        data_project = Config.getData(qgis_project.pk)

        # GET CF  from filter params
        # --------------------------
        if settings.G3W_CLIENT_SEARCH_ENDPOINT == 'ows':
            filter_data = q['FILTER'].split(':')
            
            if len(filter_data) == 0 or filter_data[0] == '':
                raise Exception('Aspected codice_fiscale or name and surname parameters!')

            filter_layer = filter_data[0]
            filter_param = filter_data[1]
            nws_filter_param = filter_param.replace(' ', '').replace('%%', '')

            # Check for codice_fiscale only params or name and surename params
            filter_fields = re.split('AND', nws_filter_param)
            if len(filter_fields) == 0 or len(filter_fields) > 2:
                raise Exception('Aspected codice_fiscale or name and surname parameters!')

            if len(filter_fields) == 1 and 'codice_fiscale' in filter_fields[0]:
                key_value = re.split('=|ILIKE', nws_filter_param)
                cf = key_value[1].replace("'", "")
            elif len(filter_fields) == 2 and 'name' in nws_filter_param and 'surname' in nws_filter_param:
                for ff in filter_fields:
                    key, value = re.split('=', ff)
                    if key == '"name"':
                        nome = value.replace("'", "")
                    else:
                        cognome = value.replace("'", "")

            else:
                raise Exception('Aspected codice_fiscale or name and surname parameters!')

        else:
            filter_layer = kwargs['layer_id']
            filter_data = q['field'].split(',')

            if len(filter_data) == 0 or filter_data[0] == '':
                raise Exception('Aspected codice_fiscale or name and surname parameters!')

            if len(filter_data) == 0 or len(filter_data) > 2:
                raise Exception('Aspected codice_fiscale or name and surname parameters!')

            if len(filter_data) == 1 and 'codice_fiscale' in filter_data[0]:
                cf = filter_data[0].split('|')[2]
            elif len(filter_data) == 2 and 'name' in filter_data[0] and 'surname' in filter_data[1]:
                nome = filter_data[0].split('|')[2]
                cognome = filter_data[1].split('|')[2]
            else:
                raise Exception('Aspected codice_fiscale or name and surname parameters!')



        # GET ORIGNAME=TABLE_NAME FORM CONFIG CXF
        # ---------------------------------------
        config_cxf = ConfigImportCxf.objects.filter(codice_comune=data_project.codice_comune)

        if len(config_cxf) > 0:
            # logging info:
            logger.debug("cadastre_origname by CXF: True")
            cadastre_origname = config_cxf[0].db_table
            cadastre_layer_orignames = [config_cxf[0].db_table]
        else:
            logger.debug("cadastre_origname by CXF: False")
            cadastre_origname = 'catasto'
            cadastre_layer_orignames = CADASTRE_LAYERS.keys()

        # logging info:
        logger.debug("cadastre_origname: {}".format(cadastre_origname))

        # GET FIELD CATASTO LAYER NUMERO
        # ------------------------------
        layers = {d.origname: d for d in qgis_project.layer_set.filter(origname__in=cadastre_layer_orignames)}
        fields_catasto_layer = eval(layers[cadastre_origname].database_columns)

        # try to fine numero field
        for field in fields_catasto_layer:
            if field['name'] == 'numero':
                numero_field = 'numero'
                suffix_value = '+'
            elif field['name'] == 'particella':
                numero_field = 'numero'
                suffix_value = ''
            elif field['name'] == 'codbo':
                numero_field = 'codbo'
                suffix_value = '+'

        # logging info:
        logger.debug("numero_field: {}".format(numero_field))
        logger.debug("suffix_value: {}".format(suffix_value))

        # GET PERSONA FISICA OR GIURIDICA BY CF
        # -------------------------------------
        try:
            soggetto = PersonaFisica.objects.filter(codice_fiscale=cf.upper())
            search_by_ns = False
        except NameError:
            soggetto = PersonaFisica.objects.filter(nome=nome.upper(), cognome=cognome.upper())
            search_by_ns = True

        tipo_soggetto = 'P'

        if search_by_ns:

            # Return new search for every CF
            # ---------------------------------------------
            return self.widget_search_cf_response(data_project, soggetto, filter_layer)

        if len(soggetto) == 0:
            try:
                soggetto = PersonaGiuridica.objects.filter(codice_fiscale_piva=cf.upper())
                tipo_soggetto = 'G'
            except NameError:
                soggetto = []

        if len(soggetto) == 0:
            soggetto = None

        id_soggetto = [s.id_soggetto for s in soggetto] if soggetto else []

        # FIND IMMOBILI AND/OR PARTICELLE
        # -------------------------------
        immobili = Titolarita.objects.filter(id_soggetto__in=id_soggetto, tipo_soggetto=tipo_soggetto,
                                             codice_comune=data_project.codice_comune).distinct('id_immobile')
        particelle = Titolarita.objects.filter(id_soggetto__in=id_soggetto, tipo_soggetto=tipo_soggetto,
                                               codice_comune=data_project.codice_comune).distinct('id_particella')

        id_immobili = [i.id_immobile for i in immobili]
        id_particelle = [i.id_particella for i in particelle]

        # get from immobili
        identificativi_immobiliari = IdentificativiImmobiliari.objects.filter(id_immobile__in=id_immobili)

        # get from particelle
        particelle_terreno = Particella.objects.filter(id_particella__in=id_particelle)

        # BUILD SINGLE QUERY FILTER FOR SINGLE IMMOBILE/PARTICELLA FOUND
        # --------------------------------------------------------------

        # Get G3W_CLIENT_SEARCH_ENDPOINT
        search_endpoint = getattr(settings, 'G3W_CLIENT_SEARCH_ENDPOINT', 'ows')

        particelle = []
        query_c = []
        for ii in identificativi_immobiliari:
            particella = (ii.foglio, ii.numero, 'F')
            if particella not in particelle:
                particelle.append(particella)
                try:
                    if search_endpoint == 'ows':
                        subq = '"foglio" = \'{}\' AND "{}" = \'{}\' AND "tipo" = \'F\' AND "codice_comune" = \'{}\''
                    else:
                        subq = 'foglio|eq|{}|and,{}|eq|{}|and,tipo|eq|F|and,codice_comune|eq|{}'

                    query_c.append(subq.format(
                        ii.foglio.lstrip('0'),
                        numero_field,
                        ii.numero.lstrip('0') + suffix_value,
                        data_project.codice_comune
                    ))
                except Exception:
                    pass

        for ii in particelle_terreno:
            particella = (ii.foglio, ii.numero, ii.sezione, 'T')
            if particella not in particelle:
                particelle.append(particella)
                try:
                    if search_endpoint == 'ows':
                        subq = '"foglio" = \'{}\' AND "{}" = \'{}\' AND "tipo" = \'T\'  AND "codice_comune" = \'{}\''
                        if ii.sezione:
                            subq += ' AND "sezione" = \'{}\''
                    else:
                        subq = 'foglio|eq|{}|and,{}|eq|{}|and,tipo|eq|T|and,codice_comune|eq|{}'
                        if ii.sezione:
                               subq += '|and,sezione|eq|{}'
                    query_c.append(subq.format(
                        ii.foglio.lstrip('0'),
                        numero_field,
                        ii.numero.lstrip('0'),
                        data_project.codice_comune,
                        ii.sezione if ii.sezione else ''
                    ))
                except Exception:
                    pass

        # BUILD QUERY FILTER
        # ------------------
        if settings.G3W_CLIENT_SEARCH_ENDPOINT == 'ows':
            if len(query_c) == 0:
                q['FILTER'] = filter_layer + ':' + '"foglio" = \'fake\''
            else:
                q['FILTER'] = filter_layer + ':' + ' OR '.join(query_c)

            # logging info:
            logger.debug("q['FILTER']: {}".format(q['FILTER']))

            request.path = reverse('OWS:ows', kwargs={'group_slug': qgis_project.group.slug, 'project_type': 'qdjango',
                                                      'project_id': qgis_project.pk})
            return OWSRequestHandler(request=request, **kwargs).baseDoRequest(q)
        else:
            if len(query_c) == 0:
                field = '?field=foglio|eq|fake'
            else:
                field = '?field=' + '|or,'.join(query_c)
            kwargs = {'mode_call': 'data', 'project_type': 'qdjango', 'project_id': kwargs['project_id'],
                      'layer_name': filter_layer}
            url = reverse('core-vector-api', kwargs=kwargs)
            return redirect(url + field)


class ConfigUserDBConnView(TemplateView):
    """
    List of user (editor1) and db conections for municipality.
    """

    template_name = 'cadastre/user_db_config_list.html'

    @method_decorator(user_passes_test_or_403(lambda u: u.is_superuser))
    def dispatch(self, request, *args, **kwargs):
        return super(ConfigUserDBConnView, self).dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(ConfigUserDBConnView, self).get_context_data(**kwargs)

        # add user editor 1 and db config fo municipality
        context['db_conns'] = ConfigImportCxf.objects.all()
        context['cadastre_users'] = ConfigUserCadastre.objects.all()

        return context


class ConfigUserCreateView(G3WRequestViewMixin, CreateView):
    """
    View for create(set) Editor 1 user loading cadastre data
    """

    form_class = ConfigUserForm
    template_name = 'cadastre/configuser.html'

    @method_decorator(user_passes_test_or_403(lambda u: u.is_superuser))
    def dispatch(self, request, *args, **kwargs):
        return super(ConfigUserCreateView, self).dispatch(request, *args, **kwargs)

    def get_success_url(self):
        return reverse('cadastre-config-userdb')


class ConfigUserUpdateView(G3WRequestViewMixin, UpdateView):
    """
    View for update Editor 1 user loading cadastre data
    """

    form_class = ConfigUserForm
    model = ConfigUserCadastre
    template_name = 'cadastre/configcxfdbconn.html'

    @method_decorator(user_passes_test_or_403(lambda u: u.is_superuser))
    def dispatch(self, request, *args, **kwargs):
        return super(ConfigUserUpdateView, self).dispatch(request, *args, **kwargs)

    def get_success_url(self):
        return reverse('cadastre-config-userdb')


class ConfigUserDeleteView(G3WAjaxDeleteViewMixin, G3WRequestViewMixin, SingleObjectMixin, View):
    '''
    View for delete Editor 1 user loading cadastre data
    '''
    model = ConfigUserCadastre

    @method_decorator(user_passes_test_or_403(lambda u: u.is_superuser))
    def dispatch(self, *args, **kwargs):
        return super(ConfigUserDeleteView, self).dispatch(*args, **kwargs)

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        self.object.remove_permission_add_prm()
        return super(ConfigUserDeleteView, self).post(request, *args, **kwargs)


class ConfigCXFDBConnCreateView(G3WRequestViewMixin, CreateView):
    """
    View for create(set) cxf db connections
    """

    form_class = ConfigCXFDBForm
    template_name = 'cadastre/configcxfdbconn.html'

    @method_decorator(user_passes_test_or_403(lambda u: u.is_superuser))
    def dispatch(self, request, *args, **kwargs):
        return super(ConfigCXFDBConnCreateView, self).dispatch(request, *args, **kwargs)

    def get_success_url(self):
        return reverse('cadastre-config-userdb')


class ConfigCXFDBConnUpdateView(G3WRequestViewMixin, UpdateView):
    """
    View for update(set) cxf db connections
    """
    form_class = ConfigCXFDBForm
    model = ConfigImportCxf
    template_name = 'cadastre/configcxfdbconn.html'

    @method_decorator(user_passes_test_or_403(lambda u: u.is_superuser))
    def dispatch(self, request, *args, **kwargs):
        return super(ConfigCXFDBConnUpdateView, self).dispatch(request, *args, **kwargs)

    def get_success_url(self):
        return reverse('cadastre-config-userdb')


class ConfigCXFDBConnDeleteView(G3WAjaxDeleteViewMixin, G3WRequestViewMixin, SingleObjectMixin, View):
    '''
    View for delete cxf db connections
    '''
    model = ConfigImportCxf

    @method_decorator(user_passes_test_or_403(lambda u: u.is_superuser))
    def dispatch(self, *args, **kwargs):
        return super(ConfigCXFDBConnDeleteView, self).dispatch(*args, **kwargs)


class TaskApiView(APIView):
    """ Return info about Celery task by task_id"""

    def get(self, request, task_id):

        # get AsyResult obj
        task = AsyncResult(task_id)
        try:
            res = {
                'status': task.status
            }

            # add pending_percent if in PENDING state
            if 'pending_percent' in task.result:
                res.update({
                    'pending_percent': task.result['pending_percent']
                })
        except Exception as e:
            res = {
                'status': 'UNKNOWN'
            }

        return Response(res)