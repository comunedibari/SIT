from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import View
from django.urls import reverse
from django.shortcuts import get_object_or_404
from django.views.generic import ListView, DetailView
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.http import Http404
from django.conf import settings
from django.utils.decorators import method_decorator
from usersmanage.decorators import user_passes_test_or_403

from lxml import etree
from pycsw.server import Csw

from .pycswsettings import get_default_pycsw_settings
from .models import Catalog, Record, EULicense
from .forms import CatalogForm, RecordForm
from .rndt import service_metadata
import logging


logger = logging.getLogger(__name__)


class OnlyAdminViewMixin(object):

    @method_decorator(user_passes_test_or_403(lambda u: u.is_superuser))
    def dispatch(self, *args, **kwargs):
        return super(OnlyAdminViewMixin, self).dispatch(*args, **kwargs)

def get_pycsw_settings(request, catalog):
    pycsw_settings = get_default_pycsw_settings(request)
    # Map catalog fields to config values

    for k in pycsw_settings["metadata:main"].keys():
        try:
            v = getattr(catalog, k)
            pycsw_settings["metadata:main"][k] = v if v is not None else ""
        except AttributeError:
            logger.debug("Missing PyCSW metadata: %s" % k)

    #pycsw_settings['repository']['database'] = 'postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{NAME}'.format(**settings.DATABASES['default'])
    pycsw_settings['repository']['filter'] = "catalog_id = %s" % catalog.pk
    pycsw_settings['server']['url'] = pycsw_settings['server']['url'] + \
            reverse("catalog:csw_by_slug", args=[catalog.slug])
    # Inspire
    if catalog.inspire_enabled:
        for inspire_field, value in catalog.inspire_fields().items():
            if 'date' in inspire_field[8:]:  # fix ISO date validation
                value = value.replace('+00:00', '')
            pycsw_settings['metadata:inspire'][inspire_field[8:]] = value
        pycsw_settings['metadata:inspire']['enabled'] = 'true'
    else:
        pycsw_settings['metadata:inspire']['enabled'] = 'false'
    return pycsw_settings


class CatalogCswView(View):

    def _get_catalog(self, **kwargs):
        catalog_args = {}
        if 'catalog_slug' in kwargs:
            catalog_args['slug'] = kwargs['catalog_slug']
        if 'catalog_pk' in kwargs:
            catalog_args['pk'] = int(kwargs['catalog_pk'])
        return get_object_or_404(Catalog, **catalog_args)

    def _get_version(self, request):
        if request.method == 'GET':
            return request.GET.get("version", "")
        else:
            return etree.fromstring(request.body).attrib['version']

    def get(self, request, *args, **kwargs):
        catalog = self._get_catalog(**kwargs)
        pycsw_settings = get_pycsw_settings(request, catalog)
        server = Csw(rtconfig=pycsw_settings, env=request.META.copy(),
                     version=self._get_version(request))
        server.requesttype = request.method
        if request.method == 'GET':
            server.request = pycsw_settings['server']['url']
            server.kvp = request.GET
        else:
            server.request = request.body
        status, response = server.dispatch()
        status_code = int(status[0:status.find(' ')])
        status_desc = status[status.find(' ') + 1:]
        return HttpResponse(response, status=status_code,
                            content_type="application/xml")

    # example: <csw:GetRecords xmlns:csw="http://www.opengis.net/cat/csw/2.0.2" xmlns:ogc="http://www.opengis.net/ogc" service="CSW" version="2.0.2" resultType="results" startPosition="1" maxRecords="15" outputFormat="application/xml" outputSchema="http://www.opengis.net/cat/csw/2.0.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/cat/csw/2.0.2 http://schemas.opengis.net/csw/2.0.2/CSW-discovery.xsd"><csw:Query typeNames="csw:Record"><csw:ElementSetName>full</csw:ElementSetName></csw:Query></csw:GetRecords>
    def post(self, request, *args, **kwargs):
        return self.get(request, *args, **kwargs)


class CatalogList(OnlyAdminViewMixin, ListView):
    model = Catalog


class CatalogDetail(OnlyAdminViewMixin, DetailView):
    model = Catalog
    form_class = CatalogForm


class CatalogCreate(OnlyAdminViewMixin, CreateView):
    model = Catalog
    form_class = CatalogForm


class CatalogUpdate(OnlyAdminViewMixin, UpdateView):
    model = Catalog
    form_class = CatalogForm


class CatalogDelete(OnlyAdminViewMixin, DeleteView):
    model = Catalog

    def get_success_url(self):
        return reverse('catalog:csw_index')


class CatalogRndtServiceView(CatalogCswView):
    """RNDT service metadata"""

    def get(self, request, *args, **kwargs):

        catalog = self._get_catalog(**kwargs)
        if not catalog.rndt_enabled:
            raise Http404

        return self.get_metadata(request, catalog, *args, **kwargs)

    def get_metadata(self, request, catalog, *args, **kwargs):
        status_code = 200

        port = str(getattr(settings, 'CATALOG_PORT', '80'))
        base_url = getattr(settings, 'CATALOG_URL_SCHEME', 'http') + '://' + \
                   getattr(settings, 'CATALOG_HOST', 'localhost') + \
                   ('' if port == '80' else ':' + port)
        response = service_metadata(catalog, base_url)
        return HttpResponse(response, status=status_code,
                            content_type="application/xml")


class CatalogRndtView(CatalogCswView):

    def get(self, request, *args, **kwargs):

        catalog = self._get_catalog(**kwargs)
        if not catalog.rndt_enabled:
            raise Http404

        pycsw_settings = get_pycsw_settings(request, catalog)
        # Patch URL for RNDT
        pycsw_default_settings = get_default_pycsw_settings(request)
        pycsw_settings['server']['url'] = pycsw_default_settings['server']['url'] + \
            reverse("catalog:rndt_by_slug", args=[catalog.slug])
        server = Csw(rtconfig=pycsw_settings, env=request.META.copy(),
                     version=self._get_version(request))
        server.requesttype = request.method

        # Change nampesapces for 'gml' for rndt
        server.context.namespaces['gml'] = 'http://www.opengis.net/gml/3.2'

        if request.method == 'GET':
            server.request = pycsw_settings['server']['url']
            server.kvp = request.GET
        else:
            server.request = request.body
        status, response = server.dispatch()
        status_code = int(status[0:status.find(' ')])
        status_desc = status[status.find(' ') + 1:]
        return HttpResponse(response, status=status_code,
                            content_type="application/xml")



class RecordList(OnlyAdminViewMixin, ListView):
    model = Record


class RecordUpdate(OnlyAdminViewMixin, UpdateView):
    model = Record
    form_class = RecordForm

    def get_success_url(self):
        return reverse('catalog:detail', args=[self.object.catalog_id])


class EULicenseView(ListView):
    """
    List view for EULicense model
    """

    model = EULicense
    template_name = 'catalog/eulicense.html'


