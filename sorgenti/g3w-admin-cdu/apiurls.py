from django.conf.urls import url

from .views import CduCalculateApiView, CduSaveApiView, TDDwhAuditApiView


urlpatterns = [
   #url(r'^api/calculate/(?P<slug>[-_\w\d]+)/$', login_required(CduCalculateApiView.as_view()), name="cdu-api-calculate-slug"),
    url(r'^api/calculate/(?P<id>[0-9]+)/$', CduCalculateApiView.as_view(),
        name="cdu-api-calculate-id"),
    url(r'^api/save/(?P<id>[0-9]+)/$', CduSaveApiView.as_view(),
        name="cdu-api-save-id"),

    # TEST api for TimbroDigitale
    url(r'^api/td/dwhaudit/$', TDDwhAuditApiView.as_view(),
        name="cdu-api-save-id"),


]
