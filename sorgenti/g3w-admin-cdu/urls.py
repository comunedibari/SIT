from django.conf.urls import url
from django.contrib.auth.decorators import login_required
from base.urls import G3W_SITETREE_I18N_ALIAS
from .views import *

G3W_SITETREE_I18N_ALIAS.append('cdu')

urlpatterns = [
    url(r'^config/$', login_required(CduConfigList.as_view()), name='cdu-config-list'),
    url(r'config/add/$', login_required(CduConfigWizardView.as_view()), name='cdu-config-add'),
    url(r'config/detail/(?P<slug>[-_\w\d]+)/$', login_required(CduConfigDetailView.as_view()),
        name='cdu-config-detail'),
    url(r'config/update/(?P<slug>[-_\w\d]+)/$', login_required(CduConfigWizardView.as_view()),
        name='cdu-config-update'),
    url(r'config/delete/(?P<slug>[-_\w\d]+)/$', login_required(CduConfigDeleteView.as_view()),
        name='cdu-config-delete'),

    # ajax url for ACLBox Users
    url(r'^jx/config/users/$', login_required(UsersGroupsConfigView.as_view()),
        name='cdu-config-users-groups'),

    # create odt file
    url(r'^upload/$', CduUploadFileView.as_view(), name='cdu-upload'),
    url(r'createdoc/(?P<id>[0-9]+)/$', CduCreatedocView.as_view(),
        name='cdu-config-createdoc'),

    # for form widzard
    url(r'layersbygroup/$', jx_layers_by_groups, name='cdu-jx-layer-by-groups'),
]