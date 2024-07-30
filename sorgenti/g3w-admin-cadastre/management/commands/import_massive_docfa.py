# coding=utf-8
"""
Script to import massive docfa file zip.
.. note:: This program is free software; you can redistribute it and/or modify
     it under the terms of the Mozilla Public License 2.0.
"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2019-11-04'
__copyright__ = 'Copyright 2019, GIS3W'


from django.core.management.base import BaseCommand, CommandError
from django.core.files import File
from cadastre.tasks import _load_docfa_data
from cadastre.models import ImportDOCFA
from cadastre.utils.data import DatiDOCFA, get_archivi_docfa
from cadastre.configs import CMD_TASK_ID_PREFIX
from zipfile import ZipFile
import random
import string
import os


class Command(BaseCommand):

    help = "Import massive zip file DOCFA from folder"

    def add_arguments(self, parser):
        parser.add_argument('dir_path', nargs=1, type=str)

    def handle(self, *args, **options):

        dir_path = options['dir_path'][0]

        # open directory and tray every zip file into folder
        for filename in sorted(os.listdir(dir_path)):
            if os.path.splitext(filename)[1].lower() == '.zip':

                # full path to zip file
                full_path = "{}/{}".format(dir_path, filename)

                # create a random task_id
                letter_and_digits = string.ascii_letters + string.digits
                task_id = ''.join(random.choice(letter_and_digits) for i in range(40))
                task_id = "{}{}".format(CMD_TASK_ID_PREFIX, task_id)

                # read docfa data
                file = open(full_path, 'r')
                zfile = ZipFile(file, 'r')
                archiviDocfa = {}

                importDOCFA = ImportDOCFA()
                importDOCFA.file = File(file, name=os.path.basename(file.name))

                # validation zip data files:
                dati = DatiDOCFA()


                # read unique DOCFA fornitura zip file
                get_archivi_docfa(zfile, dati, archiviDocfa)

                importDOCFA.task_id = task_id
                importDOCFA.codice_comune = dati.codice_comune
                importDOCFA.nome_fornitura = dati.nome_fornitura
                importDOCFA.save()

                zfile.close()
                file.close()

                try:
                    _load_docfa_data(task_id, full_path)

                    importDOCFA.refresh_from_db()

                    self.stdout.write(self.style.SUCCESS('DOCFA document successfully imported "{}"'.format(filename)))

                    self.stdout.write(self.style.SUCCESS("Task id: {}".format(task_id)))
                    self.stdout.write(self.style.SUCCESS("N record: {}".format(importDOCFA.n_record)))
                    self.stdout.write(self.style.SUCCESS("N planimetrie: {}".format(importDOCFA.n_planimetrie)))
                    self.stdout.write(self.style.SUCCESS("N docfa: {}".format(importDOCFA.n_docfa)))

                except Exception as e:
                    print ("ERROR on {}:".format(filename))
                    print (e)
                    continue

            elif os.path.isdir(filename):
                print ("Is not a FILE is a directory: {}".format(filename))
            else:
                print ("FILE not valid: {}".format(filename))


