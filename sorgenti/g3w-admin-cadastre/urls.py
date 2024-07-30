from django.conf.urls import url
from django.contrib.auth.decorators import login_required
from base.urls import G3W_SITETREE_I18N_ALIAS
from .views import *

G3W_SITETREE_I18N_ALIAS.append('cadastre')

urlpatterns = [
    #url(r'^docfa/pdf/$', login_required(PdfDOCFAView.as_view()), name='cadastre-docfa-pdf'),
    url(r'^dashboard/$', login_required(DashboardView.as_view()), name='cadastre-dashboard'),
    url(r'^loaddata/$', login_required(LoadDataView.as_view()), name='cadastre-loaddata'),
    url(r'^jx/uploaddata$', login_required(UploadDataView.as_view()), name='cadastre-upload'),
    url(r'^config/$', login_required(ConfigListView.as_view()), name='cadastre-config'),
    url(r'^config/add/$', login_required(ConfigCreateView.as_view()), name='cadastre-config-add'),
    url(r'^config/update/(?P<pk>[-_\w\d]+)/$', login_required(ConfigUpdateView.as_view()),
        name='cadastre-config-update'),
    url(r'^config/delete/(?P<pk>[-_\w\d]+)/$', login_required(ConfigDeleteView.as_view()),
        name='cadastre-config-delete'),

    url(r'^config/userdb/$', login_required(ConfigUserDBConnView.as_view()), name='cadastre-config-userdb'),

    url(r'^config/user/add/$', login_required(ConfigUserCreateView.as_view()), name='cadastre-config-user-add'),
    url(r'^config/user/update/(?P<pk>[-_\w\d]+)/$', login_required(ConfigUserUpdateView.as_view()),
        name='cadastre-config-user-update'),
    url(r'^config/user/delete/(?P<pk>[-_\w\d]+)/$', login_required(ConfigUserDeleteView.as_view()),
        name='cadastre-config-user-delete'),

    url(r'^config/cxfdbconn/add/$', login_required(ConfigCXFDBConnCreateView.as_view()),
        name='cadastre-config-cxf-db-conn-add'),
    url(r'^config/cxfdbconn/update/(?P<pk>[-_\w\d]+)/$', login_required(ConfigCXFDBConnUpdateView.as_view()),
        name='cadastre-config-cxf-db-conn-update'),
    url(r'^config/cxfdbconn/delete/(?P<pk>[-_\w\d]+)/$', login_required(ConfigCXFDBConnDeleteView.as_view()),
        name='cadastre-config-cxf-db-conn-delete'),



    url(r'^jx/config/viewer_users/$', login_required(ViewerUsersConfigView.as_view()),
        name='cadastre-config-viewer-users'),
    url(r'^jx/config/project_layers/$', login_required(LayersConfigView.as_view()),
        name='cadastre-config-project-layers'),

    url(r'^detail/prm/(?P<pk>[0-9]+)/$',login_required(PrmDetailView.as_view()), name='prm-detail'),
    url(r'^checkdata/$', login_required(CheckDataView.as_view()), name='cadastre-checkdata'),
    url(r'^delete/prm/(?P<pk>[0-9]+)/$', login_required(PrmDeleteView.as_view()), name='prm-delete'),
    url(r'^delete/importdocfa/(?P<pk>[0-9]+)/$', login_required(ImportDOCFADeleteView.as_view()),
        name='importdocfa-delete'),
    url(r'^delete/importcxf/(?P<pk>[0-9]+)/$', login_required(ImportCxfDeleteView.as_view()), name='importcxf-delete'),
    url(r'^revoke/(?P<task_id>[-_\w\d]+)/$', login_required(RevokeTerminateView.as_view()),
        name='cadastre-task-revoke'),
    url(r'^task/traceback/(?P<task_id>[-_\w\d]+)/$', login_required(TaskTracebackView.as_view()),
        name='cadastre-task-traceback'),
    url(r'^cleardb/all/$', login_required(ClearDBView.as_view()),
        name='cadastre-cleardb'),
    url(r'^cleardb/(?P<task_id>[-_\w\d]+)/$', login_required(ClearDBByTaksIdView.as_view()),
        name='cadastre-task-cleardb'),

    url(r'^detail/cxf/(?P<pk>[0-9]+)/$',login_required(CxfDetailView.as_view()), name='cxf-detail'),

    # serve planimetrie
    url(r'^planimetria/(?P<project_id>[0-9]+)/(?P<path>.*)$', login_required(PlanimetriaServeView.as_view()),
        {'document_root': '{}{}'.format(settings.MEDIA_ROOT, settings.CADASTRE_DOCFA_PLAN)},
        name='cadastre-planimetrie-serve'),

    url(r'^docfa/pdf/(?P<project_id>[0-9]+)/(?P<path>.*)$', login_required(ProtocolliDOCFAPdfServeView.as_view()),
        {'document_root': '{}{}'.format(settings.MEDIA_ROOT, settings.CADASTRE_DOCFA_DAT)},
        name='cadastre-docfa-pdf-serve'),

    url(r'^planimetriainiziale/(?P<project_id>[0-9]+)/(?P<path>.*)$', login_required(PlanimetriaServeView.as_view()),
        {'document_root': '{}{}'.format('' if settings.CADASTRE_PLAN_START.startswith('/') else
                                        settings.MEDIA_ROOT, settings.CADASTRE_PLAN_START)},
        name='cadastre-planimetrie-iniziali-serve'),

    # info/help
    url(r'loaddata/info/$', login_required(LoadDataInfoView.as_view()), name='cadastre-loaddata-info'),


    # seacrh by CF
    url(r'^searchbycf/(?P<project_id>[0-9]+)$', login_required(SearchByCFView.as_view()), name='cadastre-searchbycf'),
    url(r'^searchbycf/(?P<project_id>[0-9]+)/(?P<layer_id>[-_\w\d]+)$', login_required(SearchByCFView.as_view()),
        name='cadastre-searchbycf-api'),


]
