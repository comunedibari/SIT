# coding=utf-8
""""Geolocation class for input file xy

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2021-06-09'
__copyright__ = 'Copyright 2015 - 2021, Gis3w'


from django.utils.translation import ugettext_lazy as _
from .base import GeolocationBase, \
    GEOLOCATION_CLASSES, \
    GeolocationValidationError, \
    logger

from qgis.core import \
    QgsFeature, \
    QgsGeometry, \
    QgsPointXY


class GeolocationXY(GeolocationBase):
    """Geolocation class for XY spreadsheet file."""

    def __init__(self, file_type, input_file, **kwargs):

        # Set crs by srid_input_file
        self.crs = kwargs['srid_input_file'].srid

        super().__init__(file_type, input_file, **kwargs)

    def validate_input_data(self):
        super().validate_input_data()

        # check for x and y column into dataset headers
        if 'x' not in self.ds.headers or 'y' not in self.ds.headers:
            raise GeolocationValidationError(_("Input file has not 'x' and/or 'y' columns!"))

    def geolocate(self):
        super().geolocate()

        logger.debug('Start geolocation XY')

        vl, pr = self._create_qgis_layer()

        # Create feature
        # --------------

        for dt in self.ds:
            try:

                f = QgsFeature()
                f.setGeometry(QgsGeometry.fromPointXY(
                    QgsPointXY(
                        float(dt[self.ds.headers.index('x')]),
                        float(dt[self.ds.headers.index('y')])
                    )
                ))
                f.setAttributes(list(dt))
                pr.addFeatures([f])
                self.log['geolocated_rows_number'] += 1

            except Exception as e:
                logger.error(e)

                self.log['not_geolocated_rows'].append("|".join(dt))

        logger.debug('Stop geolocation XY')

        self.output_vector = vl


# add to GEOLOCATION_CLASSES stack
GEOLOCATION_CLASSES.update({
    'with_xy': GeolocationXY
})
