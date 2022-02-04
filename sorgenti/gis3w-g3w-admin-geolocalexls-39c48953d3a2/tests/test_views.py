# coding=utf-8
""""Geolocalexls views tests.

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2021-06-15'
__copyright__ = 'Copyright 2015 - 2021, Gis3w'

import os

from django.test import Client
from django.urls import reverse
from usersmanage.tests.utils import setup_testing_user
from geolocalexls.geolocation import RESULT_LOG_FILENAME
from .test_forms import \
    TEST_BASE_PATH, \
    CURRENT_PATH, \
    GeolocalexlsTestBase

from io import BytesIO
import zipfile

from qgis.PyQt.QtCore import QTemporaryDir
from qgis.core import QgsVectorLayer


INPUT_FILES = {
    "with_xy": {
        "csv": "input_file_xy.csv",
        "xls": "input_file_xy.xls",
        "xlsx": "input_file_xy.xls"
    },
    "with_addresses": {
        "csv": "input_file_address.csv",
        "xls": "input_file_address.xls",
        "xlsx": "input_file_address.xls"
    },
    "with_cadastral": {
        "csv": "input_file_cadastral.csv",
        "xls": "input_file_cadastral.xls",
        "xlsx": "input_file_cadastral.xls"
    }
}


class GeolocalexsViewsTest(GeolocalexlsTestBase):
    """Test of views"""

    databases = ['default', 'cadastre']

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        setup_testing_user(cls)

    def test_gelocale_view(self):
        """Test of main geolocation views"""

        self.client = Client()
        url = reverse("geolocalexls:geolocate")

        # Test login required
        # ===================

        response = self.client.get(url)
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.url, "/en/login/?next=/en/geolocalexls/action/")

        # With login: Admin01
        # ===================

        self.assertTrue(self.client.login(username='admin01', password='admin01'))
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        # Send post data
        # ==============
        for file_type, files in INPUT_FILES.items():
            for ext, f in files.items():
                with open(f'{CURRENT_PATH}{TEST_BASE_PATH}{f}', 'rb') as input_file:

                    post_data = {
                        "file_type": file_type,
                        "input_file": input_file
                    }

                    if file_type == 'with_cadastral':
                        post_data.update({'comune_code': 'H109'})
                    elif file_type == 'with_xy':
                        post_data.update({'srid_input_file': '3857'})

                    response = self.client.post(url, post_data)
                    self.assertEqual(response.status_code, 200)

                    z = zipfile.ZipFile(BytesIO(response.content))
                    temp = QTemporaryDir()
                    z.extractall(temp.path())
                    vl = QgsVectorLayer(temp.path())
                    self.assertTrue(vl.isValid())
                    features = [f for f in vl.getFeatures()]

                    # Check for log file:
                    temp_files = os.listdir(temp.path())
                    assert RESULT_LOG_FILENAME in temp_files

                    if file_type == 'with_xy':
                        self.assertEqual(len(features), 4)
                        self.assertEqual(features[0].fields().names(),
                                         ['id', 'field_a', 'field_b', 'field_c', 'x', 'y'])

                    elif file_type == 'with_address':
                        self.assertEqual(len(features), 3)
                        self.assertEqual(features[0].fields().names(),
                                         ['id', 'field_a',	'field_b',	'field_c', 'cap', 'citta', 'indirizzo', 'numciv'])

                    elif file_type == 'with_cadastral':

                        # no feature because table cadastre is empty
                        self.assertEqual(len(features), 5)
                        self.assertEqual(features[0].fields().names(),
                                         ['id', 'field_a', 'field_b', 'field_c', 'foglio', 'numero', 'sezione', 'tipo'])



