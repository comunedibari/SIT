# coding=utf-8
""""Geolocation class for input file xy

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2021-06-09'
__copyright__ = 'Copyright 2015 - 2021, Gis3w'

from .base import GeolocationBase, \
    GEOLOCATION_CLASSES, \
    GeolocationValidationError, \
    _, \
    logger


from geopy.geocoders import Nominatim
from qgis.core import \
    QgsFeature, \
    QgsPointXY, \
    QgsGeometry


class GeolocationAddress(GeolocationBase):
    """Geocoding by Nominatim and addresses fields"""

    fields_required = ('cap', 'citta', 'indirizzo', 'numciv')

    def validate_input_data(self):
        super().validate_input_data()

        # Check for addresses fields
        missing_fields = list(set(self.fields_required) - set(self.ds.headers))
        if len(missing_fields) > 0:
            raise GeolocationValidationError(_('Input file has not the follow columns: ' + ", ".join(missing_fields)))

    def geolocate(self):
        super().geolocate()

        vl, pr = self._create_qgis_layer()
        self.output_vector = vl

        # Geocoding by Nominatim
        # ----------------------
        geolocator = Nominatim(user_agent="g3w-admin-geolocalexls")
        for dt in self.ds:
            try:

                query = {
                  'street': f"{dt[self.ds.headers.index('indirizzo')]} {int(dt[self.ds.headers.index('numciv')])}",
                  'city': dt[self.ds.headers.index('citta')],
                  'postalcode': int(dt[self.ds.headers.index('cap')])
                }
                location = geolocator.geocode(query)

                if location:
                    f = QgsFeature()
                    f.setGeometry(QgsGeometry.fromPointXY(
                        QgsPointXY(
                            location.longitude,
                            location.latitude,
                        )
                    ))
                    f.setAttributes(list(dt))
                    pr.addFeatures([f])

                    # Class internal logging
                    self.log['geolocated_rows_number'] += 1
                else:

                    # Class internal logging
                    self.log['not_geolocated_rows'].append(", ".join([str(v) for v in query.values()]))

            except Exception as e:
                logger.error(f'Address error on row {dt}: {e}')


# add to GEOLOCATION_CLASSES stack
GEOLOCATION_CLASSES.update({
    'with_addresses': GeolocationAddress
})