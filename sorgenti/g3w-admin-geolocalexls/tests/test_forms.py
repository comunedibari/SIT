# coding=utf-8
""""Geolocalxls test forms

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2021-06-14'
__copyright__ = 'Copyright 2015 - 2021, Gis3w'


from django.conf import settings
from django.test import TestCase, override_settings
from django.core.files.uploadedfile import SimpleUploadedFile
from cadastre.models import ConfigImportCxf, G3WSpatialRefSys
from cadastre.utils.cxfprovider import PGProvider
from core.models import G3WSpatialRefSys
from geolocalexls.forms import GeolocaleXlsForm

from io import BytesIO
import os

CURRENT_PATH = os.getcwd()
TEST_BASE_PATH = '/geolocalexls/tests/geodata/'
WRONG_INPUT_FILE_EXT = 'input_file_xy.txt'
RIGHT_INPUT_FILE_EXT = 'input_file_xy.csv'
CSV_SEMICOLON_INPUT_FILE_EXT = 'input_file_xy_semicolon_delimiter.csv'
WRONG_XY_INPUT_FILE_EXT = 'input_file_xy_no_y_column.xls'
WRONG_ADDRESS_INPUT_FILE_EXT = 'input_file_address_no_columns.xls'
RIGHT_ADDRESS_INPUT_FILE_EXT = 'input_file_address.xls'
WRONG_CADASTRAL_INPUT_FILE_EXT = 'input_file_cadastral_no_columns.xlsx'
RIGHT_CADASTRAL_INPUT_FILE_EXT = 'input_file_cadastral.xlsx'

CADASTRE_TEST_DATA_FILE = 'cadastre.sql'


@override_settings(CACHES = {
        'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'some',
        }
    },
    LANGUAGE_CODE='en',
    LANGUAGES=(
        ('en', 'English'),
    )
)
class GeolocalexlsTestBase(TestCase):

    fixtures = [
        'G3WSpatialRefSys.json',
        'Test_IstatCodiciUi_2.json'
    ]

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()


        # create a CxfImportSettings
        db_sett = settings.DATABASES['default']
        cls.config_cxf = ConfigImportCxf.objects.create(
            codice_comune='H109',
            provider='postgresql',
            db_host=db_sett['HOST'],
            db_port=db_sett['PORT'],
            db_name=db_sett['NAME'],
            db_schema='public',
            db_table='cadastre',
            db_user=db_sett['USER'],
            db_password=db_sett['PASSWORD'],
            srid=G3WSpatialRefSys.objects.get(srid=32633)
        )


        provider = PGProvider(
            db_host=db_sett['HOST'],
            db_port=db_sett['PORT'],
            db_name=db_sett['NAME'],
            db_user=db_sett['USER'],
            db_schema='public',
            db_table='cadastre',
            db_password=db_sett['PASSWORD'],
            codice_comune='H109',
            srid=32633
        )

        provider.connect()


        try:
            provider.create_table()

            # Fill with test data
            with open(f'{CURRENT_PATH}{TEST_BASE_PATH}{CADASTRE_TEST_DATA_FILE}', 'r') as cdata:
                cursor = provider.connection.cursor()
                cursor.execute(cdata.read())
                cursor.close()
                provider.connection.commit()
        except Exception as e:
            print(e)

        provider.close()

class GeolocalexlsFormsTestBase(GeolocalexlsTestBase):

    def test_validation_geolocalexls_form(self):
        """Test validation form"""

        # Without form data
        # --------------
        form = GeolocaleXlsForm()
        self.assertFalse(form.is_valid())

        # With form data
        # --------------
        form_data = {}

        form = GeolocaleXlsForm(data=form_data)
        self.assertFalse(form.is_valid())

        self.assertTrue('file_type' in form.errors)
        self.assertTrue('input_file' in form.errors)

        form_data = {
            'file_type': 'with_xy',
            'srid_input_file': G3WSpatialRefSys.objects.get(srid=4326).srid
        }

        form = GeolocaleXlsForm(data=form_data)
        self.assertFalse(form.is_valid())

        self.assertFalse('file_type' in form.errors)
        self.assertTrue('input_file' in form.errors)

        # Input file with wrong extention
        # -------------------------------
        input_file = open(f'{CURRENT_PATH}{TEST_BASE_PATH}{WRONG_INPUT_FILE_EXT}', 'rb')
        form_files = {
            'input_file': SimpleUploadedFile(WRONG_INPUT_FILE_EXT, input_file.read())
        }

        form = GeolocaleXlsForm(data=form_data, files=form_files)
        self.assertFalse(form.is_valid())

        self.assertFalse('file_type' in form.errors)
        self.assertTrue('input_file' in form.errors)

        self.assertTrue('Invalid file extension: only .csv, .xls, .xlsx' in form.errors['input_file'])

        # Input file with right extension
        # -------------------------------
        input_file = open(f'{CURRENT_PATH}{TEST_BASE_PATH}{RIGHT_INPUT_FILE_EXT}', 'rb')
        form_files = {
            'input_file': SimpleUploadedFile(RIGHT_INPUT_FILE_EXT, input_file.read())
        }

        form = GeolocaleXlsForm(data=form_data, files=form_files)
        self.assertTrue(form.is_valid())

        # CSV with semicolon delimiter
        # ----------------------------

        input_file = open(f'{CURRENT_PATH}{TEST_BASE_PATH}{CSV_SEMICOLON_INPUT_FILE_EXT}', 'rb')
        form_files = {
            'input_file': SimpleUploadedFile(CSV_SEMICOLON_INPUT_FILE_EXT, input_file.read())
        }

        form_data.update({
            'csv_separator': 'semicolon'
        })

        form = GeolocaleXlsForm(data=form_data, files=form_files)
        self.assertTrue(form.is_valid())

        # Validation data structure: without x e y
        # ----------------------------------------
        input_file = open(f'{CURRENT_PATH}{TEST_BASE_PATH}{WRONG_XY_INPUT_FILE_EXT}', 'rb')
        form_files = {
            'input_file': SimpleUploadedFile(WRONG_XY_INPUT_FILE_EXT, input_file.read())
        }

        form = GeolocaleXlsForm(data=form_data, files=form_files)
        self.assertFalse(form.is_valid())

        self.assertTrue("Input file has not 'x' and/or 'y' columns!" in form.errors['__all__'])

        # Validation data structure: without/wrong address columns
        # --------------------------------------------------------
        form_data = {
           'file_type': 'with_addresses',
        }

        input_file = open(f'{CURRENT_PATH}{TEST_BASE_PATH}{WRONG_ADDRESS_INPUT_FILE_EXT}', 'rb')
        form_files = {
            'input_file': SimpleUploadedFile(WRONG_ADDRESS_INPUT_FILE_EXT, input_file.read())
        }

        form = GeolocaleXlsForm(data=form_data, files=form_files)
        self.assertFalse(form.is_valid())

        # Right file
        form_data = {
            'file_type': 'with_addresses',
        }

        input_file = open(f'{CURRENT_PATH}{TEST_BASE_PATH}{RIGHT_ADDRESS_INPUT_FILE_EXT}', 'rb')
        form_files = {
            'input_file': SimpleUploadedFile(RIGHT_ADDRESS_INPUT_FILE_EXT, input_file.read())
        }

        form = GeolocaleXlsForm(data=form_data, files=form_files)
        self.assertTrue(form.is_valid())

    def test_validation_geolocalexls_cadastral_form(self):
        """Test with cadastral file type"""

        # Test empty comune_code with cadastral type file
        # ------------------------------------------------
        form_data = {
            'file_type': 'with_cadastral',
        }

        form = GeolocaleXlsForm(data=form_data)
        self.assertFalse(form.is_valid())

        self.assertTrue("With Cadastral file type, comune code doesn't have to be empty"
                        in form.errors['__all__'])

        # Validation data structure: without/wrong cadastral columns
        # --------------------------------------------------------
        form_data = {
            'file_type': 'with_cadastral',
            'comune_code': 'H109',
        }

        input_file = open(f'{CURRENT_PATH}{TEST_BASE_PATH}{WRONG_CADASTRAL_INPUT_FILE_EXT}', 'rb')
        form_files = {
            'input_file': SimpleUploadedFile(WRONG_CADASTRAL_INPUT_FILE_EXT, input_file.read())
        }

        form = GeolocaleXlsForm(data=form_data, files=form_files)
        self.assertFalse(form.is_valid())

        self.assertTrue("Input file has not the follow columns: tipo"
                        in form.errors['__all__'])











