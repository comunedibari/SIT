from django.conf.urls import url
from django.views.decorators.csrf import csrf_exempt
from .api import views

app_name = 'catalog_api'

# Single layer Constraints
urlpatterns = [

    #url(r'^pod/(?P<catalog_pk>[\d]+)/data.json$', csrf_exempt(views.PODView.as_view()), name="pod_by_pk"),
    url(r'^pod/(?P<catalog_slug>[-_\w]+)/data.json$', csrf_exempt(views.PODView.as_view()), name="pod_by_slug"),


]