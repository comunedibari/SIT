from django.core.management.base import BaseCommand, CommandError
from django.db import connections
from django.conf import settings
import tablib
from import_export import resources
import os
from io import open
from cadastre.ie.resources import *
from cadastre.models import *

FILE_TO_LOAD = {
    'partite_speciali': {
        'model': CodiciPartita,
        'file': './data/codici_partita.xls'
    },
    'tipi_nota': {
        'model': TipiNota,
        'file': './data/tipi_nota.xls'
    },
    'codici_diritto': {
        'model': CodiciDiritto,
        'resource': CodiciDirittoResource,
        'file': './data/codici_diritto.xls'
    },
    'qualita_terreni': {
        'model': QualitaTerreni,
        'resource': QualitaTerreniResource,
        'file': './data/qualita_terreni.xls'
    },
    'categorie_catastali': {
        'model': CategorieCatastali,
        'resource': CategorieCatastaliResource,
        'file': './data/categorie_catastali.xls'
    },
    'sezioni_censuarie': {
        'model': SezioniCensuarie,
        'file': './data/sezioni_censuarie.xls'
    },
    'istat_codici_ui': {
        'model': IstatCodiciUi,
        'resource': IstatCodiciUiResource,
        'file': './data/istat_codici_ui.xls'
    },
    'transform_catasto': {
        'model': TransformCatasto,
        'file': './data/transform_catasto.xls'
    },


}

FILE_ROOT = os.path.abspath(os.path.dirname(__file__))

class Command(BaseCommand):
    help = 'Import table legend for cadastre data'

    def handle(self, *args, **options):

        # start to import data

        for dataName, data in FILE_TO_LOAD.items():
            dataset = tablib.Dataset()
            file = open(os.path.join(FILE_ROOT, data['file']), 'rb')
            dataset.xls = file.read()
            file.close()

            # truncate table before:
            rows = data['model'].objects.all()
            for row in rows:
                row.delete()


            if 'resource' in data:
                data_resource = data['resource']()
            else:
                data_resource = resources.modelresource_factory(model=data['model'])()
            result = data_resource.import_data(dataset, dry_run=True)
            if result.has_errors():
                raise CommandError('Data "{}" had problem on import'.format(dataName))
            else:
                self.stdout.write(self.style.SUCCESS('Data "{}" imported!'.format(dataName)))

        self.stdout.write(self.style.SUCCESS('End imports.'))
