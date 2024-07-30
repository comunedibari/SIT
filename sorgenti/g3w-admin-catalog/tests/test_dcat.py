# coding=utf-8
"""" Testing DCAT-US (Project Open Data schema version 1,1) capabilities.

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2021-02-15'
__copyright__ = 'Copyright 2015 - 2021, Gis3w'


from django.conf import settings
from django.test import override_settings
from rest_framework.test import APIClient
from django.contrib.auth.models import AnonymousUser
from django.urls import reverse
from guardian.shortcuts import assign_perm

from core.api.base.views import MIME_TYPES_MOD
from qdjango.tests.base import (
    CoreGroup,
    QgisProject,
    G3WSpatialRefSys,
    TEST_BASE_PATH,
    CURRENT_PATH,
    QGS_FILE,
    File
)
from qdjango.models import Project, Layer
from qdjango.utils.catalog_provider import catalog_provider
from catalog.models import Catalog, Record

from .base import BaseCatalogTestCase
import datetime
import json

CATALOG_HOST = "http://1.1.1.1"
CATALOG_PORT = "80"


@override_settings(
    CATALOG_HOST=CATALOG_HOST,
    CATALOG_PORT=CATALOG_PORT,
    G3WADMIN_VECTOR_LAYER_DOWNLOAD_FORMATS=['shp', 'xls', 'csv'],
    CACHES={
        'default': {
                'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
                'LOCATION': 'unique-snowflake',
        }
    }

)
class DCATTestCase(BaseCatalogTestCase):

    fixtures = [
        'BaseLayer.json',
        'G3WMapControls.json',
        'G3WSpatialRefSys.json',
        'G3WGeneralDataSuite.json'
    ]

    @classmethod
    def setUpClass(cls):
        """Setup a catalog"""

        super(DCATTestCase, cls).setUpClass()

    def setUp(self):

        # main project group
        self.project_group = CoreGroup(name='Group1', title='Group1', header_logo_img='',
                                      srid=G3WSpatialRefSys.objects.get(auth_srid=4326))

        self.project_group.save()

        qgis_project_file = File(open('{}{}{}'.format(CURRENT_PATH, TEST_BASE_PATH, QGS_FILE), 'r'))
        self.project = QgisProject(qgis_project_file)
        self.project.title = 'A project'
        self.project.group = self.project_group
        self.project.save()

        # set download for world20181008111156525
        # shp, xls, csv
        world = self.project.instance.layer_set.get(qgs_layer_id='world20181008111156525')
        world.download = True
        world.download_xls = True
        world.download_csv = True
        world.save()

        catalog, is_new = Catalog.objects.get_or_create(
            name='catalogtest_global_for_dcat')

        catalog.inspire_temp_extent = '1910-01-01/2119-01-01'
        catalog.inspire_conformity_service = 'conformant'
        catalog.inspire_contact_email = 'email@mail.com'
        catalog.inspire_gemet_keywords = [
            'Atmospheric conditions', 'Cadastral parcels']
        catalog.inspire_languages_supported = ['ita', 'dan', 'fre']
        catalog.inspire_default_language = 'ita'
        catalog.inspire_contact_phone = '+390706064325'
        catalog.inspire_contact_email = 'eell.urb.infocarto@regione.sardegna.it'
        catalog.inspire_contact_url = 'http://www.sardegnaterritorio.it'
        catalog.inspire_geographical_extent = '7.0 44.0 9.0 45.0'
        catalog.inspire_contact_organization = "Ufficio comunale DCAT"
        catalog.inspire_enabled = False

        # Enable RNDT
        catalog.rndt_enabled = False
        catalog.identification_title = 'Service Abstract Test Suite'
        catalog.identification_accessconstraints = 'Dato pubblico (cfr. art. 1 Codice Amministrazione Digitale)'
        catalog.identification_abstract = 'Il servizio WMS (Web Map Service) permette di visualizzare le cartografie che la Regione Autonoma della Sardegna mette a disposizione all\'interno del Sistema Informativo Territoriale Regionale.'
        catalog.rndt_codice_ipa = 'R_SARDEG'

        for rndt_field in catalog.rndt_required_fields().keys():
            if rndt_field.find('date') >= 0:
                setattr(catalog, rndt_field, datetime.datetime.now())
            else:
                pass  # No defaults

        catalog.save()
        self.catalog = catalog

        for project in Project.objects.all():
            assign_perm('view_project', AnonymousUser(), project)
        for layer in Layer.objects.all():
            assign_perm('view_layer', AnonymousUser(), layer)

        Catalog.register_catalog_record_provider(catalog_provider,
                                                 scope=Catalog.SCOPE.GLOBAL,
                                                 senders=[Layer])

        for c in Catalog.objects.filter(is_valid=False):
            c.regenerate()

        self.assertEqual(catalog.record_set.count(), 3)

        # Modify the publication date and other data
        for rec in self.catalog.record_set.all():
            rec.publication_date = datetime.date(2010, 1, 1)
            rec.creation_date = datetime.date(2010, 1, 1)
            rec.modified_date = datetime.date(2020, 2, 15)
            rec.abstract = 'Riassunto del contenuto dei dati'
            rec.title = 'Titolo record'
            rec.alternate_title = 'cicco'
            rec.language = 'ita'
            rec.save()

        self.catalog = catalog

    @override_settings(
        CACHES={
            'default': {
                'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
                'LOCATION': 'unique-snowflake',
            },
            'catalog': {
                'BACKEND': 'django.core.cache.backends.filebased.FileBasedCache',
                'LOCATION': '/tmp/django_cache',
            }
        }

    )
    def test_service_data_json(self):
        """Test DCAT Project Open Data V1.1"""




        # check cache free
        Catalog.clear_pod_cache(self.catalog.slug)
        self.assertIsNone(Catalog.retrieve_pod_cache(self.catalog.slug))

        client = APIClient()

        url = reverse('catalog_api:pod_by_slug', args=[self.catalog.slug])
        res = client.get(url)
        self.assertEqual(res.status_code, 200)

        # check cache is not empty
        self.assertIsNotNone(Catalog.retrieve_pod_cache(self.catalog.slug))

        jres = json.loads(res.content)

        # response header
        ret = {
            "@context": "https://project-open-data.cio.gov/v1.1/schema/catalog.jsonld",  # @not-required
            # "@id": "https://data.muni.org/data.json", # @not-required
            "@type": "dcat:Catalog",  # @not-required
            "conformsTo": "https://project-open-data.cio.gov/v1.1/schema",  # @required
            "describedBy": "https://project-open-data.cio.gov/v1.1/schema/catalog.json",
        }

        for k in ret.keys():
            self.assertEqual(jres[k], ret[k])

        # check datasets:
        for ds in jres['dataset']:

            self.assertEqual(ds["accessLevel"], "public")
            #"landingPage": f"{settings.CATALOG_HOST}:{settings.CATALOG_PORT}{landing_page}",
            self.assertEqual(ds["issued"], "2010-01-01")
            self.assertEqual(ds["@type"], "dcat:Dataset")
            self.assertEqual(ds["modified"], "2020-02-15")
            self.assertEqual(ds["keyword"], ['Atmospheric conditions', 'Cadastral parcels'])

            self.assertEqual(ds["contactPoint"], {
                "@type": "vcard:Contact",
                "fn": self.catalog.contact_name,
                "hasEmail": self.catalog.contact_email
            })

            self.assertEqual(ds["publisher"], {  # @required
                "@type": "org:Organization",
                "name": "Ufficio comunale DCAT"
            })

            self.assertTrue(ds["identifier"].find("R_SARDEG:R_SARDEG") != -1)
            self.assertEqual(ds["description"], "Riassunto del contenuto dei dati")
            self.assertEqual(ds["title"], "Titolo record")
            self.assertEqual(ds["language"], 'it')

            # check for almost one 'distribution' WMS service

            self.assertTrue(len(ds["distribution"]) >= 0)

            # first it'd be WMS
            d = ds["distribution"][0]
            self.assertEqual(d["@type"], "dcat:Distribution")
            self.assertEqual(d["accessURL"], f"{CATALOG_HOST}:{CATALOG_PORT}/ows/group1/qdjango/1/")
            self.assertEqual(d["format"], "WMS")

            # check for distribution for world layer
            if ds["identifier"].find("world") != -1:
                self.assertTrue(len(ds["distribution"]) == 4)

                d = ds["distribution"]
                c = 1
                for f in ('shp', 'xls', 'csv'):
                    self.assertEqual(d[c]["@type"], "dcat:Distribution")
                    self.assertEqual(d[c]["mediaType"], MIME_TYPES_MOD[f]['mime_type'])
                    self.assertTrue(d[c]["downloadURL"].find(f) != -1)
                    c += 1











