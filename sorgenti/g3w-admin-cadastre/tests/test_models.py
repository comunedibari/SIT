# coding=utf-8
"""
    Tests for cadastre models module.
.. note:: This program is free software; you can redistribute it and/or modify
     it under the terms of the Mozilla Public License 2.0.
"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2019-12-04'
__copyright__ = 'Copyright 2019, GIS3W'


from .base import CadastreTestsBase, CODICE_COMUNE, CODICE_COMUNE2
from cadastre.models import Config


class CadastreModelsTest(CadastreTestsBase):

    def test_config_model(self):

        # create a config model instance
        config = Config(project=self.project.instance, codice_comune=CODICE_COMUNE)
        config.save()

        # test config getData method
        config_by_getdata = Config.getData(self.project.instance.id)
        self.assertEqual(config, config_by_getdata)

        config.delete()

        # test project not exists
        config = Config.getData(99)
        self.assertIsNone(config)

