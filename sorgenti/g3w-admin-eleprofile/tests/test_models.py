# coding=utf-8
""""
    Testing eleprofile module models.
.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2020-07-09'
__copyright__ = 'Copyright 2015 - 2020, Gis3w'


from django.core.exceptions import ValidationError
from qdjango.models import Project, Layer
from eleprofile.models import EleProProject, EleProDTM
from .base import EleprofileTestBase


class EleprofileModelsTests(EleprofileTestBase):
    """Testing class for eleprofile module models"""

    def test_eleproproject(self):
        """Test homonymous model class"""

        project = Project.objects.all()[0]
        elepro_prj = EleProProject(project=project, note='test note')
        elepro_prj.save()

        # reload
        del(elepro_prj)

        elepro_prj = EleProProject.objects.all()[0]
        self.assertEqual(elepro_prj.project, project)
        self.assertEqual(elepro_prj.note, 'test note')

    def test_eleprodtm(self):
        """Test homonymous model class"""

        # Create a eleprofile project
        elepro_prj = EleProProject(project=self.project.instance)
        elepro_prj.save()

        dtm_layer = Layer.objects.get(name='dtm_3857')
        dtm = EleProDTM(elepro_project=elepro_prj, dtm_layer=dtm_layer)
        dtm.full_clean()
        dtm.save()

        # validate layers added
        dtm.layers.add(Layer.objects.get(name='paths'))
        dtm.full_clean()

        del(dtm)

        dtm = EleProDTM.objects.all()[0]
        self.assertEqual(dtm.elepro_project, elepro_prj)
        self.assertEqual(dtm.dtm_layer, dtm_layer)

        # check dtm_layer validation only raster/gdal
        dtm_layer = Layer.objects.get(name='paths')
        dtm = EleProDTM(elepro_project=elepro_prj, dtm_layer=dtm_layer)

        with self.assertRaises(ValidationError) as ex:
            dtm.full_clean()


        del(dtm)
        # validate path layer
        dtm_layer = Layer.objects.get(name='dtm_3857')
        dtm = EleProDTM(elepro_project=elepro_prj, dtm_layer=dtm_layer)
        dtm.save()
        dtm.layers.add(dtm_layer)

        with self.assertRaisesMessage(
                ValidationError,
                "{"+f"'layer': [\"Layer {dtm_layer.name} must be one of 'postgres', 'spatialite', 'ogr' or 'mssql' type\"]"+"}"
        ):
            dtm.full_clean()

        # check layer is a vectorlayerand a LineString or a MultiLineString
        dtm.layers.remove(dtm_layer)
        line_layer = Layer.objects.get(name='areas')
        dtm.layers.add(line_layer)

        with self.assertRaisesMessage(
                ValidationError,
                "{"+f"'layer': [\"Layer {line_layer.name} must be one geometry type of 'LineString' or 'MultiLineString\"]"+"}"
        ):
            dtm.full_clean()





