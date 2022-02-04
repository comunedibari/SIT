# coding=utf-8
""""
DCAT Open Project Data v1.1 views.
.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2021-02-04'
__copyright__ = 'Copyright 2015 - 2021, Gis3w'


from rest_framework.views import APIView
from rest_framework.response import Response
from catalog.api.serializers import PODSerializer, Catalog

import logging

logger = logging.getLogger('catalog')


def make_data(catalog):
    pod = PODSerializer(instance=catalog)

    # Create or update cache
    Catalog.update_or_create_pod_cache(catalog.slug, pod.data)

    return pod.data


class PODView(APIView):
    """Project Open Data application view"""

    def get(self, request, format=None, **kwargs):
        """
        Return a list of all users.
        """

        # Retrieve data from cache
        pod_json = Catalog.retrieve_pod_cache(kwargs['catalog_slug'])

        if not pod_json:

            logger.debug('Refresh data and recreate cache if is it set into django settings for Project Open Data API')
            pod_json = make_data(Catalog.objects.get(slug=kwargs['catalog_slug']))

        return Response(pod_json)