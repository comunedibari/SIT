# coding=utf-8
""""
    Update EULicense model table from RDF: http://publications.europa.eu/resource/authority/licence
.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2022-03-15'
__copyright__ = 'Copyright 2015 - 2022, Gis3w'

import urllib.error

from django.core.management.base import BaseCommand
from catalog.models import EULicense, InspireLimitationsOnPublicAccess

from rdflib import Graph, URIRef
from rdflib.plugin import Parser, register, Serializer
import requests, \
    json

register('text/xml', Parser, 'rdflib.plugins.parsers.rdfxml', 'RDFXMLParser')


import logging
logger = logging.getLogger('catalog')


RDF_LICENSE_URL = "http://publications.europa.eu/resource/authority/licence"


class Command(BaseCommand):

    help = 'Read http://publications.europa.eu/resource/authority/licence and populate/update EULicense model'

    def handle(self, *args, **options):

        # Import EULicense
        # ================================================
        # Create a Graph
        # g = Graph()
        #
        # # Parse in an RDF file hosted on the Internet
        # g.parse(RDF_LICENSE_URL)
        #
        # count = 0
        # self.stdout.write("Start import EU license")
        # self.stdout.write("-----------------------")
        # for subj, pred, obj in g:
        #
        #     if subj != RDF_LICENSE_URL:
        #
        #         try:
        #             ls = Graph().parse(subj)
        #             for s, p, o in ls:
        #
        #                 if str(p) == 'http://publications.europa.eu/resource/authority/op-code':
        #                     code = o
        #
        #                 if str(p) == 'http://www.w3.org/2004/02/skos/core#definition':
        #                     desc = o
        #
        #             EULicense.objects.update_or_create(defaults={
        #                 'definition': desc,
        #                 'url': str(s)
        #             }, **{
        #                 'op_code': code
        #             })
        #
        #             count += 1
        #
        #         except urllib.error.HTTPError as e:
        #             logger.error(e)
        #
        # self.stdout.write("Stop import EU license")
        # self.stdout.write(self.style.SUCCESS(f'Successfully imported {count} license!'))
        # self.stdout.write("-----------------------")

        # Import Inspire LimitationsOnPublicAccess
        # ================================================

        r = requests.get('https://inspire.ec.europa.eu/metadata-codelist/LimitationsOnPublicAccess/LimitationsOnPublicAccess.it.json')

        limitations = json.loads(r.content)

        self.stdout.write("Start import Inspire Limitation uses")
        self.stdout.write("-----------------------------------")
        for l in limitations['metadata-codelist']['containeditems']:

            InspireLimitationsOnPublicAccess.objects.update_or_create(defaults={
                'label': l['value']['label']['text'],
                'definition': l['value']['definition']['text'],
                'url': l['value']['id'].strip('\r\n')
            }, **{
                'inspire_id': l['value']['id']
            })

        self.stdout.write("Stop import Inspire Limitation uses")
        self.stdout.write("-----------------------------------")




