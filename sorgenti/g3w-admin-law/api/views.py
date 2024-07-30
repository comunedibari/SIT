from django.db.models import Q
from rest_framework.settings import api_settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import APIException
from guardian.shortcuts import get_objects_for_user, get_anonymous_user
from .serializers import ArticlesSerializer, LawSerializer, Articles, Laws
from .renderers import PDFRenderer

renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES + [PDFRenderer]


class LawsApiView(APIView):

    renderer_classes = renderer_classes

    def get(self, request, format=None, **kwargs):

        if 'law_id' in kwargs:
            try:
                law = Laws.objects.get(pk=kwargs['law_id'])
                laws_serializer = LawSerializer(law)
            except Exception as e:
                raise APIException(e)
        else:
            laws = Laws.objects.all()
            laws_serializer = LawSerializer(laws, many=True)

        return Response(laws_serializer.data)


class ArticlesApiView(APIView):

    renderer_classes = renderer_classes

    def get_laws(self, request):
        """
        Get laws for user
        """
        self.own_laws = get_objects_for_user(request.user, 'law.view_laws', Laws) | \
                        get_objects_for_user(get_anonymous_user(), 'law.view_laws', Laws)
        self.own_laws_pks = [l.pk for l in self.own_laws]

    def get_articles(self, request):

        # try to get params by GET
        # only article in this way ?articles=<law-name>,<article_number>,[<comma>][|<law-name>,<article_number>,[<comma>]]
        # http://localhost:8001/law/api/articles/?articles=nta-variante-ru-approvata-il-18052016,42,|...

        # OLD way
        law = request.GET.get('law', None)
        n_article = request.GET.get('article', None)
        comma = request.GET.get('comma', None)

        articles = request.GET.get('articles', None)
        self.get_laws(request)

        # get article by get
        larticle = list()
        if articles:
            for article in articles.split('|'):
                larticle.append(article.split(','))
        elif n_article:
            larticle.append((law, n_article, comma))

        if 'article_id' in self.kwargs:
            try:
                self.article = Articles.objects.get(pk=self.kwargs['article_id'], law__pk__in=self.own_laws_pks)
                self.articles_serializer = ArticlesSerializer(self.article)
            except Exception as e:
                raise APIException(e)
        elif len(larticle) > 0:
            try:

                # build OR query
                q = None
                for la in larticle:

                    # buil kfilter fo Q
                    kfilter = {
                        'law__slug': la[0],
                        'number': la[1]
                    }
                    if la[2] and la[2] != '':
                        kfilter['comma'] = la[2]

                    if not q:
                        q = Q(**kfilter)
                    else:
                        q |= Q(**kfilter)

                oarticles = Articles.objects.filter(q, law__pk__in=self.own_laws_pks)
                self.articles_serializer = ArticlesSerializer(oarticles, many=True)
            except Exception as e:
                raise APIException(e)
        else:
            articles = Articles.objects.filter(law__pk__in=self.own_laws_pks)
            self.articles_serializer = ArticlesSerializer(articles, many=True)

    def get(self, request, format=None, **kwargs):

        self.get_articles(request)
        return Response(self.articles_serializer.data)

