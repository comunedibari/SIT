# coding=utf-8
"""" Import persona_gioridica and persona_fisica tables.
.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2023-05-10'
__copyright__ = 'Copyright 2015 - 2023, Gis3w'
__license__ = 'MPL 2.0'

from django.core.management.base import BaseCommand, CommandError
from cadastre.models import PersonaFisica, PersonaGiuridica
from cadastre.utils.structure import check_add_row, fromStr2Date
import csv


class Command(BaseCommand):
    help = 'Importa le persono fisiche e giuridiche dal file .SOG'


    def add_arguments(self, parser):
        parser.add_argument('--file', dest='file_sog', nargs=1, type=str)
        parser.add_argument('--task_id', dest='task_id', nargs=1, type=str)

    def handle(self, *args, **options):

        try:
            file_sog_path = options['file_sog'][0]
        except:
            raise CommandError('Devi settare il parametro --file')

        try:
            task_id = options['task_id'][0]
        except:
            raise CommandError('Devi settare il parametro --task_id')

        try:
            file_sog = open(file_sog_path, 'r')
        except:
            raise CommandError('Il file SOG non esiste: {}'.format(file_sog_path))

        # Reading .sog file
        sog = list(csv.reader(file_sog, delimiter='|'))

        persona_fisica_bulk_data = []
        persona_giuridica_bulk_data = []

        for row in sog:
            datiSoggetto = {
                'id_soggetto': row[2],

            }

            check_add_row(datiSoggetto, 'codice_comune', row, 0)
            # check_add_row(datiSoggetto, 'sezione', row, 1)

            if task_id:
                datiSoggetto['task_id'] = task_id

            tipoPersona = row[3]
            if tipoPersona == 'P':

                check_add_row(datiSoggetto, 'cognome', row, 4)
                check_add_row(datiSoggetto, 'nome', row, 5)
                check_add_row(datiSoggetto, 'sesso', row, 6)

                fromStr2Date(datiSoggetto, 'data_nascita', row, 7)
                check_add_row(datiSoggetto, 'luogo_nascita', row, 8)
                check_add_row(datiSoggetto, 'codice_fiscale', row, 9)
                check_add_row(datiSoggetto, 'indicazioni_supplementari', row, 10)

                #if datiSoggetto['id_soggetto'] not in self.persona_fisica_id_soggetto_to_save and \
                                #int(datiSoggetto['id_soggetto']) not in self.dati_sog_pf_in_db:
                personaFisica = PersonaFisica(**datiSoggetto)
                persona_fisica_bulk_data.append(personaFisica)

            elif tipoPersona == 'G':

                check_add_row(datiSoggetto, 'denominazione', row, 4)
                check_add_row(datiSoggetto, 'sede', row, 5)
                check_add_row(datiSoggetto, 'codice_fiscale_piva', row, 6)

                #if datiSoggetto['id_soggetto'] not in self.persona_giuridica_id_soggetto_to_save and \
                                #int(datiSoggetto['id_soggetto']) not in self.dati_sog_pg_in_db:
                personaGiuridica = PersonaGiuridica(**datiSoggetto)
                persona_giuridica_bulk_data.append(personaGiuridica)

        self.stdout.write(
            self.style.NOTICE("Salvataggio Persone Fisica")
        )
        res_fisica = PersonaFisica.objects.bulk_create(persona_fisica_bulk_data, ignore_conflicts=True)

        self.stdout.write(
            self.style.NOTICE("Salvataggio Persone Giuridica")
        )
        res_giuridica = PersonaGiuridica.objects.bulk_create(persona_giuridica_bulk_data, ignore_conflicts=True)

        self.stdout.write(
            self.style.SUCCESS(f'OPERAZIONE COMPLETA AL 100%: importate {len(res_fisica)} di {len(persona_fisica_bulk_data)} persone fisiche '
                               f'e {len(res_giuridica)} di {len(persona_giuridica_bulk_data)} persone giuridiche')
        )
