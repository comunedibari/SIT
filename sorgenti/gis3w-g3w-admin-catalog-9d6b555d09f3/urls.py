from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt


from . import views

app_name = 'catalog'

urlpatterns = [
    url(r'^$', login_required(views.CatalogList.as_view()), name="csw_index"),
    url(r'^csw/(?P<catalog_pk>[\d]+)/$', csrf_exempt(views.CatalogCswView.as_view()), name="csw_by_pk"),
    url(r'^csw/(?P<catalog_slug>[-_\w]+)/$', csrf_exempt(views.CatalogCswView.as_view()), name="csw_by_slug"),
    url(r'^rndt/(?P<catalog_pk>[\d]+)/$', csrf_exempt(views.CatalogRndtView.as_view()), name="rndt_by_pk"),
    url(r'^rndt/(?P<catalog_slug>[-_\w]+)/$', csrf_exempt(views.CatalogRndtView.as_view()), name="rndt_by_slug"),
    url(r'^rndt_service_metadata/(?P<catalog_pk>[\d]+)/$', csrf_exempt(views.CatalogRndtServiceView.as_view()), name="rndt_service_by_pk"),
    url(r'^rndt_service_metadata/(?P<catalog_slug>[-_\w]+)/$', csrf_exempt(views.CatalogRndtServiceView.as_view()), name="rndt_service_by_slug"),
    # Admin
    url(r'^(?P<pk>[\d]+)/$', login_required(views.CatalogDetail.as_view()), name="detail"),
    url(r'^update/(?P<pk>[\d]+)/$', login_required(views.CatalogUpdate.as_view()), name="update"),
    url(r'^create/$', login_required(views.CatalogCreate.as_view()), name="create"),
    url(r'^delete/(?P<pk>[\d]+)/$', login_required(views.CatalogDelete.as_view()), name="delete"),
    url(r'^record/(?P<pk>[\d]+)/$', login_required(views.RecordUpdate.as_view()), name="record_update"),
]
