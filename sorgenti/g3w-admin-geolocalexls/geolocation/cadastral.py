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
    logger, \
    _
from cadastre.models import ConfigImportCxf

from qgis.core import \
    QgsVectorLayer, \
    QgsDataSourceUri,\
    QgsFeatureRequest, \
    QgsFeature


class GeolocationCadastral(GeolocationBase):

    geometry_type = 'Polygon'
    fields_required = ('foglio', 'numero', 'sezione', 'tipo')

    def __init__(self, file_type, input_file, **kwargs):

        #Get cxf_config
        self.cxf_config = kwargs['comune_code']

        super().__init__(file_type, input_file, **kwargs)


    def validate_input_data(self):
        super().validate_input_data()

        # Check for addresses fields
        missing_fields = list(set(self.fields_required) - set(self.ds.headers))
        if len(missing_fields) > 0:
            raise GeolocationValidationError(_('Input file has not the follow columns: ' + ", ".join(missing_fields)))

    def _normalize_dt(self, dt):
        """
        Normalize to str data from input file datasource
        :param dt: tablib datasource row
        :return: tuple of normalize values (foglio, numero, sezione, tipo)
        """
        foglio = str(int(dt[self.ds.headers.index('foglio')]))
        numero = str(int(dt[self.ds.headers.index('numero')])) if isinstance(dt[self.ds.headers.index('numero')], float) \
            else str(dt[self.ds.headers.index('numero')])
        sezione = str(dt[self.ds.headers.index('sezione')]) if dt[self.ds.headers.index('sezione')] else ''
        tipo = str(dt[self.ds.headers.index('tipo')])

        # Check  '+' at the endo of numero if tipo == 'F'
        if tipo == 'F' and numero[-1:] != '+':
            numero = numero + '+'

        return foglio, numero, sezione, tipo

    def geolocate(self):
        super().geolocate()

        # set CRS for output_layer
        self.crs = self.cxf_config.srid.srid

        vl, pr = self._create_qgis_layer()
        self.output_vector = vl

        # Filter data from Cadastre layer
        # -------------------------------

        # Create QgsVectorLayer from Cadastre layer datasource
        datasource = QgsDataSourceUri()
        datasource.setConnection(
            aHost=self.cxf_config.db_host,
            aPort=str(self.cxf_config.db_port),
            aDatabase=self.cxf_config.db_name,
            aUsername=self.cxf_config.db_user,
            aPassword=self.cxf_config.db_password
        )

        datasource.setDataSource(
            aSchema=self.cxf_config.db_schema,
            aTable=self.cxf_config.db_table,
            aGeometryColumn='geom'
        )

        clayer = QgsVectorLayer(datasource.uri(), "cadastre", "postgres")

        logger.error(datasource.uri())
        logger.error(clayer.isValid())

        # Create Filter Expression string
        filter_expression = []
        for dt in self.ds:

            foglio, numero, sezione, tipo = self._normalize_dt(dt)
            condition = f"\"foglio\" = '{foglio}' AND \"numero\" = '{numero}' AND \"tipo\" = '{tipo}'"

            if sezione and sezione != '':
                condition += f" AND \"sezione\" = '{sezione}'"

            filter_expression.append(condition)

        # Execute filer on cadastre layer
        qgis_feature_request = QgsFeatureRequest()
        qgis_feature_request.setFilterExpression(" OR ".join(filter_expression))
        logger.debug(" OR ".join(filter_expression))
        clayer_features = clayer.getFeatures(qgis_feature_request)

        cfeatures = {}
        for f in clayer_features:
            key = f"{f.attribute('foglio')}{f.attribute('numero')}{f.attribute('sezione')}{f.attribute('tipo')}"
            cfeatures[key] = f

        # create feature for result layer
        for dt in self.ds:
            foglio, numero, sezione, tipo = self._normalize_dt(dt)
            key = f"{foglio}{numero}{sezione}{tipo}"
            if key in cfeatures.keys():
                f = QgsFeature()
                f.setGeometry(cfeatures[key].geometry())
                f.setAttributes(list(dt))
                pr.addFeatures([f])

                # Class internal logging
                self.log['geolocated_rows_number'] += 1
            else:
                tolog = ", ".join([str(v) for v in list(dt)])
                logger.debug(f'Parcel not found into layer: {tolog}')

                # Class internal logging
                self.log['not_geolocated_rows'].append(", ".join([str(v) for v in list(dt)]))

        del(clayer)

# add to GEOLOCATION_CLASSES stack
GEOLOCATION_CLASSES.update({
    'with_cadastral': GeolocationCadastral
})