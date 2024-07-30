# coding=utf-8
""""

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2020-07-09'
__copyright__ = 'Copyright 2015 - 2020, Gis3w'

from django.db import models
from django.core.exceptions import ValidationError
from qdjango.models import Project, Layer
from django.utils.translation import gettext_lazy as _


class EleProProject(models.Model):
    """ Main elevation profile projects """

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="%(app_label)s_projects")
    note = models.TextField('Note', null=True, blank=True)

    class Meta:
        verbose_name = 'Elevation Profile Project'


class EleProDTM(models.Model):
    """ For every elevation profile projects dtm layers to use """
    elepro_project = models.ForeignKey(EleProProject, on_delete=models.CASCADE, related_name="dtm_layers")
    dtm_layer = models.ForeignKey(Layer, on_delete=models.CASCADE, related_name='dtm_layer',
                                  help_text=_('Select DTM project layer to use for sampling'))
    dtm_delta = models.IntegerField(_('Sampling DTM step'), default=10,
                                    help_text=_('Sampling step in map units, default 10'))
    layers = models.ManyToManyField(Layer, related_name='path_layer', help_text=_('Select one or more path layers'))
    note = models.TextField('Note', null=True, blank=True)

    def clean_fields(self, exclude=None):
        super().clean_fields(exclude=exclude)

        # check dtm_layer is raster
        if self.dtm_layer.layer_type not in ('gdal', 'raster'):
            raise ValidationError({'dtm_layer': _("Layer must be a 'raster' or 'gdal' type")})

        # check layer is as vectorlayer
        if self.pk:
            for layer in self.layers.all():
                if layer.layer_type not in ('postgres', 'spatialite', 'ogr', 'mssql'):
                    raise ValidationError(
                        {'layer': _(f"Layer {layer.name} must be one of 'postgres', 'spatialite', 'ogr' or 'mssql' type")}
                    )

                # check geometrytype
                if layer.geometrytype not in ('LineString', 'MultiLineString'):
                    raise ValidationError(
                        {'layer': _(F"Layer {layer.name} must be one geometry type of 'LineString' or 'MultiLineString")}
                    )

    class Meta:
        verbose_name = 'Elevation Profile DTM Layer'
