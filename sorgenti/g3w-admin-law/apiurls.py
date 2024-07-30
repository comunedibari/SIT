from django.urls import path
from django.contrib.auth.decorators import login_required
from .api.views import *

urlpatterns = [
    path(
        'api/laws/',
        login_required(LawsApiView.as_view()),
        name='law-api-articles-all'
    ),
    path(
        'api/laws/<int:law_id>/',
        login_required(LawsApiView.as_view()),
        name='law-api-articles'
    ),
    path(
        'api/articles/',
        ArticlesApiView.as_view(),
        name='law-article-api-articles-all'
    ),
    path(
        'api/articles/<int:article_id>/',
        ArticlesApiView.as_view(),
        name='law-article-api-articles'
    ),
]