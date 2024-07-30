# coding=utf-8
""""
    Simplereporting models
.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2021-04-08'
__copyright__ = 'Copyright 2015 - 2021, Gis3w'

from django.db import models, transaction
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from qdjango.models import Project, Layer
from editing.models import G3WEditingLayer


class SimpleRepoProject(models.Model):
    """ Main simple reporting projects """

    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name="%(app_label)s_projects")
    note = models.TextField('Note', null=True, blank=True)

    class Meta:
        verbose_name = 'Simple Reporting Project'

    def __str__(self):
        return str(self.project)

    def clean_fields(self, exclude=None):
        super().clean_fields(exclude=exclude)

        # check for unique project for simple reporting system only for new
        try:
            srproject = SimpleRepoProject.objects.filter(project=self.project)[0]
        except:
            srproject = None

        if srproject and (self.pk and self.pk != srproject.pk):
            raise ValidationError({'project': _("This project is just set for a simple reporting")})

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):

        update = bool(self.pk)

        with transaction.atomic():
            super(SimpleRepoProject, self).save(force_insert=force_insert, force_update=force_update, using=using,
                                                update_fields=update_fields)

            # For new only, save also onetoone relation layer
            if not update:
                layer = SimpleRepoLayer(simplerepo_project=self)
                layer.save()


GEO_TYPE_VECTOR_LAYER_ALLOWED = [
    'Point',
    'MultiPoint',
    'Point25D',
    'MultiPointZ',
    'PointZ',
    'Polygon',
    'MultiPolygon',
    'Polygon25D',
    'PolygonZ',
    'MultiPolygonZ',
    'LineString',
    'MultiLineString'
    'LineString25D',
    'LineStringZ',
    'MultiLineStringZ',
]


class SimpleRepoLayer(models.Model):
    """ For every simple reporting projects vector layer to use """

    simplerepo_project = models.OneToOneField(SimpleRepoProject, on_delete=models.CASCADE,
                                              related_name="simplerepo_layer", null=True)
    layer = models.ForeignKey(Layer, on_delete=models.CASCADE, related_name='simplerepo_layer', null=True,
                                  help_text=_('Select vector project layer to use for reporting: '
                                              'only follow geometry types are allowed: ' +
                                              ', '.join(GEO_TYPE_VECTOR_LAYER_ALLOWED) +
                                              ' In the list only layers with editing capability for Anonymous user'))
    note = models.TextField('Note', null=True, blank=True)

    class Meta:
        verbose_name = 'Simple reporting vector Layer'

    def clean_fields(self, exclude=None):

        super().clean_fields(exclude=exclude)

        # check for vector layer  only
        if self.layer.geometrytype not in GEO_TYPE_VECTOR_LAYER_ALLOWED:
            raise ValidationError({'layer': _("Layer geometry type is not in allowed type: " +
                                              ", ".join(GEO_TYPE_VECTOR_LAYER_ALLOWED))})

        # check layer selected is a layer wit editing state activated
        if not G3WEditingLayer.objects.filter(app_name='qdjango', layer_id=self.layer.pk).exists():
            raise ValidationError({'layer': _("Layer is not in editing state (required)")})

        # check for unique simplreporpoject and layer combination
        try:
            srlayer = SimpleRepoLayer.objects.filter(simplerepo_project=self.simplerepo_project)[0]
        except:
            srlayer = None

        if srlayer and (self.pk and self.pk != srlayer.pk):
            raise ValidationError({'layer': _("Only once combination of SimpleReporting adn vector layer reporting!")})

    def __str__(self):
        return f"{self.simplerepo_project} - {self.layer}"
