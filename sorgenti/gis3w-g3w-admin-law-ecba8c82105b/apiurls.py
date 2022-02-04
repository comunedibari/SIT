from django.conf.urls import url
from django.contrib.auth.decorators import login_required
from .api.views import *

urlpatterns = [
    url(r'^api/laws/$', login_required(LawsApiView.as_view()), name='law-api-articles-all'),
    url(r'^api/laws/(?P<law_id>[0-9]+)/$', login_required(LawsApiView.as_view()), name='law-api-articles'),
    url(r'^api/articles/$', ArticlesApiView.as_view(), name='law-article-api-articles-all'),
    url(r'^api/articles/(?P<article_id>[0-9]+)/$', ArticlesApiView.as_view(),
        name='law-article-api-articles'),
]