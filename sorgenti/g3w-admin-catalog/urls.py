from django.urls import path, re_path
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt


from . import views

app_name = 'catalog'

urlpatterns = [
    re_path(r'^$', login_required(views.CatalogList.as_view()), name="csw_index"),
    re_path(r'^csw/(?P<catalog_pk>[\d]+)/$', csrf_exempt(views.CatalogCswView.as_view()), name="csw_by_pk"),
    re_path(r'^csw/(?P<catalog_slug>[-_\w]+)/$', csrf_exempt(views.CatalogCswView.as_view()), name="csw_by_slug"),
    re_path(r'^rndt/(?P<catalog_pk>[\d]+)/$', csrf_exempt(views.CatalogRndtView.as_view()), name="rndt_by_pk"),
    re_path(r'^rndt/(?P<catalog_slug>[-_\w]+)/$', csrf_exempt(views.CatalogRndtView.as_view()), name="rndt_by_slug"),
    re_path(r'^rndt_service_metadata/(?P<catalog_pk>[\d]+)/$', csrf_exempt(views.CatalogRndtServiceView.as_view()), name="rndt_service_by_pk"),
    re_path(r'^rndt_service_metadata/(?P<catalog_slug>[-_\w]+)/$', csrf_exempt(views.CatalogRndtServiceView.as_view()), name="rndt_service_by_slug"),
    # Admin
    re_path(r'^(?P<pk>[\d]+)/$', login_required(views.CatalogDetail.as_view()), name="detail"),
    re_path(r'^update/(?P<pk>[\d]+)/$', login_required(views.CatalogUpdate.as_view()), name="update"),
    re_path(r'^create/$', login_required(views.CatalogCreate.as_view()), name="create"),
    re_path(r'^delete/(?P<pk>[\d]+)/$', login_required(views.CatalogDelete.as_view()), name="delete"),
    re_path(r'^record/(?P<pk>[\d]+)/$', login_required(views.RecordUpdate.as_view()), name="record_update"),
    path('eulicense/', login_required(views.EULicenseView.as_view()), name="csw_eulicense_list"),

]
