from __future__ import division
from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
from cadastre.utils.structure import check_add_row, fromStr2Int
from cadastre.models import PlanimetrieIniziali
import csv
import shutil
import os
import glob


DEFAULT_FILE_DATA_NAME = 'ELENCO.DAT'
DEFAULT_DIR_PLAN_NAME = 'plan'

'''
Esempio cartella con dati da importare:

ELENCO.DAT
plam
    -> 0000.001
    -> 0001.002
    ....
'''

class Command(BaseCommand):

    help = 'Importa in db le planimetrie iniziali'

    def add_arguments(self, parser):
        parser.add_argument('--file_list', dest='file_data_name', default=DEFAULT_FILE_DATA_NAME, nargs=1, type=str)
        parser.add_argument('--file_list_delimiter', dest='file_list_delimiter', default='|', nargs=1, type=str)
        parser.add_argument('--dir_plan_name', dest='dir_plan_name', default=DEFAULT_DIR_PLAN_NAME, nargs=1, type=str)
        parser.add_argument('--data_dir', dest='data_dir', nargs=1, type=str)

    def handle(self, *args, **options):

        # si cerca il file da importare nella cartella indicata

        # set arguments
        file_list = options['file_data_name'][0]
        file_list_delimiter = options['file_list_delimiter'][0]
        dir_plan = options['dir_plan_name'][0]
        try:
            data_dir = options['data_dir'][0]
        except:
            raise CommandError('Devi settare almento il parametro --data_dir')

        try:
            path_file = '{}{}'.format(data_dir, file_list)
            dat_file = open(path_file, 'r')
        except:
            raise CommandError('Il file DAT non esiste: {}'.format(path_file))

        dat = csv.reader(dat_file, delimiter=file_list_delimiter)
        dat_list = list(dat)

        pi_ins = 0
        pi_upd = 0
        pi_tot = len(dat_list)
        past_done = 0

        # si crea la cartella se non esiste
        if not os.path.exists(settings.MEDIA_ROOT + settings.CADASTRE_PLAN_START):
            os.makedirs(settings.MEDIA_ROOT + settings.CADASTRE_PLAN_START)

        self.stdout.write(self.style.SUCCESS('INIZIO CARICAMENTO DI {}'.format(pi_tot)))
        for r in dat_list:

            row = dict()
            check_add_row(row, 'codice_comune', r, 0)
            fromStr2Int(row, 'codice_generico', r, 2)
            check_add_row(row, 'foglio', r, 4)
            check_add_row(row, 'numero', r, 5)
            check_add_row(row, 'subalterno', r, 7)
            check_add_row(row, 'nome_file', r, 8)

            # copia del file di planimetria
            pattern_file_to_copy = options['cartella_dati'][0] + dir_plan + '/' + row['nome_file'] + '.*'
            found_files = glob.glob(pattern_file_to_copy)
            nome_file = []
            for path_file_to_copy in found_files:
                nome_file.append(path_file_to_copy.split('/')[-1])
                shutil.copy(path_file_to_copy, settings.MEDIA_ROOT + settings.CADASTRE_PLAN_START + '/')

            # save or update
            row['nome_file'] = nome_file
            pi, created = PlanimetrieIniziali.objects.update_or_create(**row)

            if created:
                pi_ins += 1
            else:
                pi_upd += 1

            current = pi_ins + pi_upd




            done = (current / pi_tot) // 0.1
            if done > past_done:
                past_done = done
                self.stdout.write(self.style.SUCCESS('OPERAZIONE COMPLETA AL {}%'.format(int(done*10))))

        dat_file.close()

        self.stdout.write(
            self.style.SUCCESS('OPERAZIONE COMPLETA AL 100%: importate {} planimentrie di cui {} nuove'.
                               format(current, pi_ins)))
