# coding=utf-8
""""
Project Open Data Serializers
.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2021-02-04'
__copyright__ = 'Copyright 2015 - 2021, Gis3w'

from django.conf import settings
from django.urls import reverse
from rest_framework.serializers import ModelSerializer
from catalog.models import Catalog
from qdjango.models import Layer
from qdjango.utils.data import QGIS_LAYER_TYPE_NO_GEOM
from core.api.base.views import MIME_TYPES_MOD

from qgis.core import (
    QgsCoordinateTransform,
    QgsCoordinateReferenceSystem,
    QgsCoordinateTransformContext,
    QgsRectangle
)

import pycountry

import logging

logger = logging.getLogger('catalog')


class PODSerializer(ModelSerializer):
    """
    Serializer for Catalog model to generate following DCAT-US Project Open Data Schema
    """

    class Meta:
        model = Catalog
        fields = '__all__'

    def to_representation(self, instance):

        # build catalog header
        ret = {
            "@context": "https://project-open-data.cio.gov/v1.1/schema/catalog.jsonld", # @not-required
            #"@id": "https://data.muni.org/data.json", # @not-required
            "@type": "dcat:Catalog", # @not-required
            "conformsTo": "https://project-open-data.cio.gov/v1.1/schema", # @required
            "describedBy": "https://project-open-data.cio.gov/v1.1/schema/catalog.json",
            "dataset": [] # @required
        }

        # Create base url for links
        port = str(getattr(settings, 'CATALOG_PORT', '80'))
        base_url = getattr(settings, 'CATALOG_URL_SCHEME', 'http') + '://' + \
                   getattr(settings, 'CATALOG_HOST', 'localhost') + \
                   ('' if port == '80' else ':' + port)

        # add datasets
        for record in instance.record_set.all():

            # get project and layer instance from unique record id
            layer = Layer.objects.get(pk=record.g3w_layer_id)

            landing_page = reverse('group-project-map', kwargs={
                'group_slug': layer.project.group.slug,
                'project_type': 'qdjango',
                'project_id': layer.project.pk
            })

            download_wms_url = reverse('OWS:ows', kwargs={
                'group_slug': layer.project.group.slug,
                'project_type': 'qdjango',
                'project_id': layer.project.pk
            })

            dataset = {
                 "accessLevel": "public",
                 "landingPage": f"{base_url}{landing_page}",
                 "issued": record.creation_date, #release date
                 "@type": "dcat:Dataset", # fixed, @not-required
                 "modified": record.modified_date, # @required, '2.1.2.2 Modified date'
                 "keyword": [k for k in record.keywords], # @required
                 "contactPoint": { # @required
                    "@type": "vcard:Contact",
                    "fn": instance.contact_name,
                    "hasEmail": instance.contact_email
                 },
                 "publisher": { # @required
                    "@type": "org:Organization",
                    "name": record.inspire_contact_organization if \
                        record.inspire_contact_organization else instance.inspire_contact_organization
                 },
                 "identifier": record.rndt_dataset_identifier(),
                 "description": record.abstract, # @required
                 "title": record.title, # @required
                 "language": pycountry.countries.get(alpha_3=record.language.upper()).alpha_2.lower(),

                 # not present into G3W-SUITE catalog
                 #"theme": [
                 #   "Housing and Homelessness"
                 #],
              }

            # [distributions]
            # other than wms if layer is a vector layer
            # -----------------------------------------
            distributions = [
                {
                    "@type": "dcat:Distribution",
                    "accessURL": f"{base_url}{download_wms_url}",
                    "format": "WMS"
                }
            ]


            for format in settings.G3WADMIN_VECTOR_LAYER_DOWNLOAD_FORMATS:
                key = 'download' if format == 'shp' else f'download_{format}'
                if getattr(layer, key):
                    try:
                        download_url = reverse('core-vector-api-ext', kwargs={
                            'mode_call': format,
                            'ext': MIME_TYPES_MOD[format]['ext'],
                            'project_type': 'qdjango',
                            'project_id': layer.project.pk,
                            'layer_name': layer.qgs_layer_id
                        })
                        distributions.append({
                            "@type": "dcat:Distribution",
                            "downloadURL": f"{base_url}{download_url}",
                            "mediaType": MIME_TYPES_MOD[format]['mime_type']

                        })
                    except Exception as e:
                        logger.error(f'POD download url build error: {e}')



            dataset["distribution"] = distributions

            # [spatial]
            # only if a geo layer
            # -------------------

            if layer.geometrytype != QGIS_LAYER_TYPE_NO_GEOM:
                ct = QgsCoordinateTransform(
                    QgsCoordinateReferenceSystem(f'EPSG:{layer.srid}'),
                    QgsCoordinateReferenceSystem('EPSG:4326'),
                    QgsCoordinateTransformContext()
                )
                r = ct.transform(QgsRectangle.fromWkt(layer.extent))

                dataset['spatial'] = f"{r.xMinimum()},{r.yMinimum()},{r.xMaximum()},{r.yMaximum()}"

            ret['dataset'].append(dataset)

        return ret

