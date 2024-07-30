from django.conf.urls import url
from .views import *

urlpatterns = [

    url(r'^$', FrontendAVBView.as_view(), name='frontend'),
    url(r'^assistenza/$', AssistenzaAVBView.as_view(), name='frontend-assistenza'),
    url(r'^wms/$', WmsAVBView.as_view(), name='frontend-wms'),
    url(r'^front/$', FrontendView.as_view(), name='frontend-g3w'),
    url(r'^jx/login/$', LoginAjaxView.as_view(), name='frontend-ajax-login'),

    #
    url(r'^idp-login/$', IdpLoginView.as_view(), name='frontend-idp-login'),
]
