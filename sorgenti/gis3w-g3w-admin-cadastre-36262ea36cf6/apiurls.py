from django.conf.urls import url
from django.contrib.auth.decorators import login_required
from cadastre.views import *


BASE_CADASTRE_API_EDITING = 'api/editing/'

urlpatterns = [
    url(r'^api/terreno/(?P<project_id>[0-9]+)/$', login_required(TerrenoApiView.as_view()),
        name='cadastre-api-terreno'),
    url(r'^api/fabbricato/(?P<project_id>[0-9]+)/$', login_required(FabbricatoApiView.as_view()),
        name='cadastre-api-fabbricato'),
    url(r'^api/immobile/(?P<project_id>[0-9]+)/$', login_required(ImmobileApiView.as_view()),
        name='cadastre-api-immobile'),
    url(r'^api/particella/(?P<project_id>[0-9]+)/$', login_required(ParticellaApiView.as_view()),
        name='cadastre-api-particella'),

    # task info
    url(r'^api/task/(?P<task_id>[-_\w\d]+)/$', login_required(TaskApiView.as_view()),
        name='cadastre-api-task'),

]
