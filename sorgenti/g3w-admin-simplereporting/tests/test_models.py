# coding=utf-8
""""
    Testing SimpleReporting module models.
.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2020-07-09'
__copyright__ = 'Copyright 2015 - 2020, Gis3w'


from django.core.exceptions import ValidationError
from qdjango.models import Project, Layer
from simplereporting.models import SimpleRepoProject, SimpleRepoLayer
from .base import SimpleReportingTestBase


class SimpleReportingModelsTests(SimpleReportingTestBase):
    """Testing class for SimpleReporting module models"""

    def test_simpleproproject(self):
        """Test homonymous model class"""

        project = Project.objects.all()[0]
        simplerepo_prj = SimpleRepoProject(project=project, note='test note')
        simplerepo_prj.save()

        # check creaction one to one SimpleRepoLayer object and is null
        layers = SimpleRepoLayer.objects.all()
        self.assertEqual(len(layers), 1)
        self.assertEqual(layers[0].simplerepo_project, simplerepo_prj)
        self.assertEqual(layers[0].layer, None)

        # reload
        del(simplerepo_prj)

        simplerepo_prj = SimpleRepoProject.objects.all()[0]
        self.assertEqual(simplerepo_prj.project, project)
        self.assertEqual(simplerepo_prj.project.title, 'Fort testing SimpleReproting')
        self.assertEqual(simplerepo_prj.note, 'test note')

        # check validation one project
        # Only once project for reporting

        simplerepo_prj2 = SimpleRepoProject(project=project, note='test only once project')
        with self.assertRaises(ValidationError) as ex:
            simplerepo_prj2.full_clean()

        # pass for update
        simplerepo_prj.note = 'No check only once project on udate'
        simplerepo_prj.save()


    def test_simplertepolayer(self):
        """Test homonymous model class"""

        # Create a eleprofile project
        simplerepo_prj = SimpleRepoProject(project=self.project.instance)
        simplerepo_prj.save()

        # juste create SimplerepoLayer

        layer = Layer.objects.get(name='line')

        # validate layers added
        simplerepo_prj.simplerepo_layer.layer = layer
        simplerepo_prj.simplerepo_layer.save()

        #chek from db
        simplerepo_layers = SimpleRepoLayer.objects.filter(simplerepo_project=simplerepo_prj)
        self.assertEqual(len(simplerepo_layers), 1)
        self.assertEqual(simplerepo_layers[0].layer, layer)

        # Try to create newone is validate by onetoone unique validation
        simplerepo_layer_obj = SimpleRepoLayer(simplerepo_project=simplerepo_prj, layer=layer)
        with self.assertRaises(ValidationError) as ex:
            simplerepo_layer_obj.full_clean()










