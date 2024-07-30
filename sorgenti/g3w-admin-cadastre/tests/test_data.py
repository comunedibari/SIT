# coding=utf-8
"""
Test cadastre utils.data
.. note:: This program is free software; you can redistribute it and/or modify
     it under the terms of the Mozilla Public License 2.0.
"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2019-10-24'
__copyright__ = 'Copyright 2019, GIS3W'


from .base import *
from cadastre.utils import data
from cadastre.models import *
from zipfile import ZipFile


class CadastreDataTests(CadastreTestsBase):
    """ Test for data utilities class and function """

    def test_fornitura_docfa(self):
        """
        Test get_archivi_docfa utility read unique DOCFA zip archive
        Test Fornitura DOCFA read
        """

        task_id = 'xxxxxxxxxxxx'

        # open test unique archive docfa file
        filename = TEST_BASE_PATH + TEST_DOCFA_ZIP
        zfile = ZipFile(filename, 'r')

        dati = data.DatiDOCFA()
        archiviDocfa = {}

        data.get_archivi_docfa(zfile, dati, archiviDocfa)

        self.assertEqual(dati.nome_fornitura, 'B648_201601')
        self.assertEqual(dati.periodo, '201601')

        self.assertTrue('DC' in archiviDocfa and 'DM_PL' in archiviDocfa and 'DOC' in archiviDocfa)
        self.assertTrue(0 in archiviDocfa['DC'])
        self.assertTrue('info' in archiviDocfa['DC'][0])
        self.assertTrue('zipfile' in archiviDocfa['DC'][0])

        self.assertTrue(1 in archiviDocfa['DM_PL'])
        self.assertTrue('info' in archiviDocfa['DM_PL'][1])
        self.assertTrue('zipfile' in archiviDocfa['DM_PL'][1])

        self.assertTrue(1 in archiviDocfa['DOC'])
        self.assertTrue('info' in archiviDocfa['DOC'][1])
        self.assertTrue('zipfile' in archiviDocfa['DOC'][1])

        DOC = data.FornituraDOC(archiviDocfa['DOC'], dati, task_id=task_id)
        DOC.loadData()

        # check relazione fabbricati docfa
        rfd = RelazioneFabbricatiDOCFA.objects.filter(task_id=task_id)
        self.assertTrue(len(rfd) > 0)

        DC = data.FornituraDC(archiviDocfa['DC'], dati, task_id=task_id)
        DC.loadData()

        DM_PL = data.FornituraDM_PL(archiviDocfa['DM_PL'], dati, task_id=task_id)
        DM_PL.loadData()

        zfile.close()

    def test_validation_fornitura_docfa(self):
        """ Check validation actions"""

        # validation not all docfa file file
        # ============================================================
        filename = TEST_BASE_PATH + TEST_VALIDATE_NOT_ALL_FILE_DOCFA_ZIP
        zfile = ZipFile(filename, 'r')

        dati = data.DatiDOCFA()
        archiviDocfa = {}

        with self.assertRaises(Exception) as ex:
            data.get_archivi_docfa(zfile, dati, archiviDocfa)
        self.assertEqual(str(ex.exception), 'Forniture incomplete: attesi archivi DOC, DM_PL e DC')

        zfile.close()

        # validation correct docfa numeration
        # ============================================================
        filename = TEST_BASE_PATH + TEST_VALIDATE_NOT_CORRECT_NUMERATION_FILE_DOCFA_ZIP
        zfile = ZipFile(filename, 'r')

        dati = data.DatiDOCFA()
        archiviDocfa = {}

        with self.assertRaises(Exception) as ex:
            data.get_archivi_docfa(zfile, dati, archiviDocfa)
        self.assertEqual(str(ex.exception), 'Numerazione non coerente degli archivi DM_PL')

        zfile.close()

        # validation different comune
        # ============================================================
        filename = TEST_BASE_PATH + TEST_VALIDATE_DIFFERENT_COMUNE_FILE_DOCFA_ZIP
        zfile = ZipFile(filename, 'r')

        dati = data.DatiDOCFA()
        archiviDocfa = {}

        with self.assertRaises(Exception) as ex:
            data.get_archivi_docfa(zfile, dati, archiviDocfa)
        self.assertTrue(str(ex.exception).startswith('Forniture con date e comuni differenti'))

        zfile.close()

        # validation CORRECT FILENAME
        # ============================================================
        filename = TEST_BASE_PATH + TEST_VALIDATE_NOT_CORRECT_FILENAME_FILE_DOCFA_ZIP
        zfile = ZipFile(filename, 'r')

        dati = data.DatiDOCFA()
        archiviDocfa = {}

        with self.assertRaises(Exception) as ex:
            data.get_archivi_docfa(zfile, dati, archiviDocfa)

        zfile.close()