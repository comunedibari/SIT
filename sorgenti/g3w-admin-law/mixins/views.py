from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from guardian.decorators import permission_required
from law.models import Laws


class G3WLawBaseViewMixin(object):
    '''
    Mixins for Class FormView for get law slug object for get
    '''

    def get_form_kwargs(self):
        kwargs = super(G3WLawBaseViewMixin, self).get_form_kwargs()

        # get request object from view
        kwargs['law'] = self.law
        return kwargs

    def get_context_data(self, **kwargs):
        """Add current law to context."""

        context = super(G3WLawBaseViewMixin, self).get_context_data(**kwargs)
        context['law'] = self.law
        return context

    def dispatch(self, request, *args, **kwargs):
        """Populate law attribute."""

        self.law = get_object_or_404(Laws, slug=self.kwargs['law_slug'])
        return super(G3WLawBaseViewMixin, self).dispatch(request, *args, **kwargs)


class G3WLawViewMixin(G3WLawBaseViewMixin):

    @method_decorator(permission_required('law.change_laws', (Laws, 'slug', 'law_slug'), return_403=True))
    def dispatch(self, request, *args, **kwargs):
        return super(G3WLawViewMixin, self).dispatch(request, *args, **kwargs)


class G3WArticleViewOnlyMixin(G3WLawBaseViewMixin):
    '''
    Mixin specific for Articles view for view only not editing
    '''

    @method_decorator(permission_required('law.view_laws', (Laws, 'slug', 'law_slug'), return_403=True))
    def dispatch(self, request, *args, **kwargs):
        return super(G3WArticleViewOnlyMixin, self).dispatch(request, *args, **kwargs)


class G3WArticleViewMixin(G3WLawBaseViewMixin):
    '''
    Mixin specific for Article list view, from Law mixin with different permission
    '''

    @method_decorator(permission_required('law.manage_articles', (Laws, 'slug', 'law_slug'), return_403=True))
    def dispatch(self, request, *args, **kwargs):
        return super(G3WArticleViewMixin, self).dispatch(request, *args, **kwargs)


