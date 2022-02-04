from django.views.generic import (
    ListView,
    CreateView,
    UpdateView,
    DetailView,
    FormView,
    View,
)
from django.views.generic.detail import SingleObjectMixin
from django.http import HttpResponse, Http404
from django.urls import reverse_lazy
from django.db.models import ObjectDoesNotExist, Q
from django.db import transaction
import tablib
from copy import copy
from core.mixins.views import *
from django.utils.decorators import method_decorator
from guardian.decorators import permission_required
from guardian.shortcuts import get_objects_for_user
from guardian.utils import get_anonymous_user
from core.mixins.views import G3WRequestViewMixin
from usersmanage.mixins.views import G3WACLViewMixin
from usersmanage.decorators import permission_required_for_anonymous_user_or_403
from .models import *
from .forms import LawForm, ArticleForm, LawNewVariationForm
from .mixins.views import *
from .ie.resources import ArticlesResource
from .utils.data import get_projects_by_law


class LawListView(ListView):
    template_name = 'law/law_list.html'

    def get_queryset(self):
        objects_for_user = get_objects_for_user(self.request.user, 'law.view_laws', Laws).order_by('name')

        '''
        if not self.request.user.is_anonymous():
            objects_for_user |= get_objects_for_user(get_anonymous_user(), 'law.view_laws', Laws).order_by('name')
        '''
        return objects_for_user


class LawAddView(G3WRequestViewMixin, CreateView):
    """
    Create view for law
    """
    form_class = LawForm
    template_name = 'law/law_form.html'
    success_url = reverse_lazy('law-list')

    @method_decorator(permission_required('law.add_laws', return_403=True))
    def dispatch(self, *args, **kwargs):
        return super(LawAddView, self).dispatch(*args, **kwargs)


class LawUpdateView(G3WRequestViewMixin, G3WACLViewMixin, UpdateView):
    """
    Update view for law model
    """
    model = Laws
    form_class = LawForm
    template_name = 'law/law_form.html'
    success_url = reverse_lazy('law-list')

    editor_permission = ['change_laws', 'view_laws']
    editor2_permission = 'view_laws'
    viewer_permission = 'view_laws'

    @method_decorator(permission_required('law.change_laws', (Laws, 'slug', 'slug'), return_403=True))
    def dispatch(self, *args, **kwargs):
        return super(LawUpdateView, self).dispatch(*args, **kwargs)


class LawDetailView(DetailView):
    """
    Show law detail by ajax call
    """
    model = Laws
    template_name = 'law/ajax/law_detail.html'

    @method_decorator(permission_required('law.view_laws', (Laws, 'slug', 'slug'), raise_exception=True))
    def dispatch(self, *args, **kwargs):
        return super(LawDetailView, self).dispatch(*args, **kwargs)

    def get_context_data(self, **kwargs):
        context_data = super(LawDetailView, self).get_context_data(**kwargs)
        context_data['projects'] = get_projects_by_law(context_data['object'].id).values()
        return context_data


class LawDeleteView(G3WAjaxDeleteViewMixin, SingleObjectMixin, View):
    """
    Delete law Ajax view
    """
    model = Laws

    @method_decorator(permission_required('law.delete_laws', (Laws, 'slug', 'slug'), raise_exception=True))
    def dispatch(self, *args, **kwargs):
        return super(LawDeleteView, self).dispatch(*args, **kwargs)


class LawNewVariationView(AjaxableFormResponseMixin, FormView):

    form_class = LawNewVariationForm
    template_name = 'law/ajax/law_new_variation.html'
    success_url = reverse_lazy('law-list')

    editor_permission = ['change_laws', 'view_laws']
    editor2_permission = 'view_laws'
    viewer_permission = 'view_laws'

    @method_decorator(permission_required('law.change_laws', (Laws, 'slug', 'slug'), return_403=True))
    def dispatch(self, *args, **kwargs):
        return super(LawNewVariationView, self).dispatch(*args, **kwargs)

    def _get_law_object(self):
        lawSlug = self.kwargs['slug']
        return Laws.objects.get(slug=lawSlug)

    @transaction.atomic
    def form_valid(self, form):
        # get law slug
        newVariation = form.cleaned_data['variation']
        newFromDate = form.cleaned_data['fromdate']
        newToDate = form.cleaned_data['todate']
        parentLaw = self._get_law_object()
        # create ne law row in db
        childLaw = Laws(name=parentLaw.name, description=parentLaw.description, fromdate=newFromDate,
                        todate=newToDate, variation=newVariation)
        childLaw.save()

        # give permission from parent
        # ================================

        # Editor Level 1
        current_editors1 = get_users_for_object(parentLaw, self.editor_permission, [G3W_EDITOR1])
        for ce1u in current_editors1:
            childLaw.addPermissionsToEditor(ce1u)

        # Editor Level 2
        current_editors2 = get_users_for_object(parentLaw, self.editor2_permission, [G3W_EDITOR2])
        for ce2u in current_editors2:
            childLaw.addPermissionsToEditor(ce2u)

        # Viewers
        current_viewers = get_viewers_for_object(parentLaw, self.request.user, self.viewer_permission,
                                                 with_anonymous=True)

        childLaw.addPermissionsToViewers([cvu.pk for cvu in current_viewers])

        # Editor Groups User
        current_group_editors = get_user_groups_for_object(parentLaw, self.request.user, self.editor2_permission,
                                                           'editor')
        childLaw.add_permissions_to_editor_user_groups([o.id for o in current_group_editors])

        # Viewer Groups User
        current_group_viewers = get_user_groups_for_object(parentLaw, self.request.user, self.viewer_permission,
                                                           'viewer')
        childLaw.add_permissions_to_viewer_user_groups([o.id for o in current_group_viewers])

        # ================================

        # creates a copy of articles
        # ================================
        parentArticles = parentLaw.articles_set.all()
        parent_correlate_articles = {}
        parent_articles_new_map = {}
        for article in parentArticles:

            correlate_articles = article.correlate_articles.all()
            if len(correlate_articles) > 0:
                parent_correlate_articles[article.pk] = [pca.pk for pca in correlate_articles]

            childArticle = copy(article)
            childArticle.id = None
            childArticle.law = childLaw
            childArticle.save()

            parent_articles_new_map[article.pk] = childArticle.pk


        # rebuild correlate_articles for new
        for ppk, pca in parent_correlate_articles.items():
            a = Articles.objects.get(pk=parent_articles_new_map[ppk])
            for pk in pca:
                a.correlate_articles.add(Articles.objects.get(pk=parent_articles_new_map[pk]))

        return super(LawNewVariationView, self).form_valid(form)


class LawArticlesExportView(View):

    @method_decorator(permission_required('law.change_laws', (Laws, 'slug', 'law_slug'), return_403=True))
    def dispatch(self, *args, **kwargs):
        return super(LawArticlesExportView, self).dispatch(*args, **kwargs)

    def get(self, request, *args, **kwargs):

        dataset = ArticlesResource(lawslug=kwargs['law_slug']).export()
        mode = kwargs.get('mode','xls')
        if mode == 'xls':
            response = HttpResponse(dataset.xls, content_type='application/ms-excel')
            response['Content-Disposition'] = 'attachment; filename=articles.xls'
        elif mode == 'csv':
            response = HttpResponse(dataset.csv, content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename=articles.csv'
        else:
            raise Http404()

        return response


class LawArticlesUploadView(G3WLawViewMixin, View):

    @method_decorator(permission_required('law.change_laws', (Laws, 'slug', 'law_slug'), return_403=True))
    def dispatch(self, *args, **kwargs):
        return super(LawArticlesUploadView, self).dispatch(*args, **kwargs)

    def post(self, request, *args, **kwargs):

        file = request.FILES['files[]'] if request.FILES else None

        # try import data
        dataset = tablib.Dataset()
        if file.content_type == 'text/csv':
            dataset.csv = file.read().decode()
        else:
            dataset.xls = file.read()
        dh = dataset.headers
        idsToRest = []
        with transaction.atomic():
            for d in dataset:
                # build data for model and filter
                dataArticle = {
                    'number': d[dh.index('number')],
                    'comma': d[dh.index('comma')],
                    'title': d[dh.index('title')],
                    'content': d[dh.index('content')],
                    'law': self.law
                }
                try:
                    article = Articles.objects.get(**dataArticle)
                except ObjectDoesNotExist:
                    article = Articles(**dataArticle)
                finally:
                    article.content = d[dh.index('content')]
                    article.save()
                    idsToRest.append(article.pk)
            # erase old
            articlesToDelete = Articles.objects.filter(~Q(pk__in=idsToRest), law=self.law)
            for article in articlesToDelete:
                article.delete()

        return HttpResponse('Articles list uploaded and updated')


# ------------------------------------------
# ARTICLES
# ------------------------------------------

class ArticleListView(G3WArticleViewOnlyMixin, ListView):
    template_name = 'law/article_list.html'
    model = Articles

    def get_queryset(self):
        return self.law.articles_set.all().order_by('number')


class ArticleAddView(G3WArticleViewMixin, CreateView):
    form_class = ArticleForm
    model = Articles
    template_name = 'law/article_form.html'
    law = None

    def get_success_url(self):
        return reverse_lazy('law-article-list', kwargs={'law_slug': self.law.slug})


class ArticleUpdateView(ArticleAddView, UpdateView):
    pass


class ArticleDeleteView(G3WArticleViewOnlyMixin, G3WAjaxDeleteViewMixin, SingleObjectMixin, View):
    """
    Delete law article Ajax view
    """
    model = Articles


class ArticleDetailView(DetailView):
    model = Articles
    template_name = 'law/ajax/article_detail.html'

