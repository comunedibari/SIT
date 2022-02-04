# coding=utf-8
"""" Geolocalexls geolocation base class

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2021-06-09'
__copyright__ = 'Copyright 2015 - 2021, Gis3w'

from django.utils.translation import ugettext_lazy as _
from django.http import HttpResponse
from tablib.core import InvalidDimensions
import tablib

from qgis.core import \
    QgsVectorFileWriter, \
    QgsVectorLayer, \
    QgsField

from qgis.PyQt.QtCore import QVariant

import tempfile
import os
import io
import zipfile

import logging

logger = logging.getLogger('geolocalexls')

GEOLOCATION_CLASSES = {}

RESULT_LOG_FILENAME = 'results.log'


class GeolocationException(Exception):
    pass


class GeolocationValidationError(GeolocationException):
    pass


def Geolocation(file_type, input_file, **kwargs):
    """Geolocation factory classes"""

    return GEOLOCATION_CLASSES[file_type](file_type, input_file, **kwargs)


class GeolocationBase(object):
    """Geolocation base class"""

    geometry_type = 'Point'
    shp_extentions = ('.shp', '.shx', '.dbf', '.prj')
    csv_separator = {
        'comma': ',',
        'semicolon': ';'
    }

    def __init__(self, file_type, input_file, **kwargs):

        # set properties
        self.file_type = file_type
        self.input_file = input_file

        # check for output_filename
        self.output_filename = kwargs['output_filename'] if 'output_filename' in kwargs and kwargs['output_filename'] \
            else self.get_output_filename()

        try:
            self.csv_delimiter = self.csv_separator[kwargs['csv_separator']] if 'csv_separator' in kwargs else None
        except:
            self.csv_delimiter = None

        self.ds = self._get_datasource_from_input_file()

        # Initialize class internal logging:
        self.log = {
            'geolocated_rows_number': 0,
            'not_geolocated_rows': [],
        }

    def get_output_filename(self):
        """
        Return filename from input_file
        :return: Output file name
        """

        return os.path.splitext(self.input_file.name)[0]

    def _create_qgis_layer(self):

        uri = self.geometry_type
        if hasattr(self, 'crs'):
            uri = uri + f'?crs=epsg:{self.crs}'

        vl = QgsVectorLayer(uri, "temp", "memory")

        # Create Fields
        # -------------
        pr = vl.dataProvider()

        attributes = []
        for hd in self.ds.headers:
            attributes.append(QgsField(hd, QVariant.String))
        pr.addAttributes(attributes)

        vl.updateFields()

        return vl, pr

    def _get_datasource_from_input_file(self):
        """Return input_file data and structure"""

        file_extension = os.path.splitext(self.input_file.name)[1][1:]

        try:
            file = self.input_file.read().decode() if file_extension == "csv" else self.input_file.read()
            kwargs = {}
            if file_extension == 'csv' and self.csv_delimiter:
                kwargs['delimiter'] = self.csv_delimiter
            return tablib.Dataset().load(file, format=file_extension, **kwargs)
        except InvalidDimensions as e:
            raise GeolocationValidationError(_('Invalid size: check if headers and rows have same column separator'))
        except Exception as e:
            raise GeolocationValidationError(e)

    def validate_input_data(self):
        """Method to validate input_file by file_type"""

        # first of all check if input_data has headers
        if not self.ds.headers:
            raise GeolocationValidationError(_('Input data has not HEADERS column.'))

    def geolocate(self):
        """Geolocate input_data create QgsVectorLayer"""
        pass

    def export_shp(self):
        """Export QgsVectorLayer as ShapeFile"""

        tmp_dir = tempfile.TemporaryDirectory()

        save_options = QgsVectorFileWriter.SaveVectorOptions()
        save_options.driverName = 'ESRI Shapefile'
        save_options.fileEncoding = 'utf-8'

        error_code, error_message = QgsVectorFileWriter.writeAsVectorFormatV2(
            self.output_vector,
            os.path.join(tmp_dir.name, self.output_filename),
            self.output_vector.transformContext(),
            save_options
        )

        if error_code != QgsVectorFileWriter.NoError:
            tmp_dir.cleanup()
            return GeolocationException(error_message)

        filenames = ["{}{}".format(self.output_filename, ftype)
                     for ftype in self.shp_extentions]

        # Add logs file:
        filenames.append(RESULT_LOG_FILENAME)

        with open(os.path.join(tmp_dir.name, RESULT_LOG_FILENAME), "w", encoding="utf-8") as fl:
            fl.write(f"Number of Geolocated rows: {self.log['geolocated_rows_number']}\n\n")
            fl.write("Not Gelocated rows:\n")
            fl.write("\n".join(self.log['not_geolocated_rows']))

        zip_filename = "{}.zip".format(self.output_filename)

        # Open BytesIO to grab in-memory ZIP contents
        s = io.BytesIO()

        zf = zipfile.ZipFile(s, "w")

        for fpath in filenames:

            # Add file, at correct path
            ftoadd = os.path.join(tmp_dir.name, fpath)
            if os.path.exists(ftoadd):
                zf.write(ftoadd, fpath)

        # Must close zip for all contents to be written
        zf.close()
        tmp_dir.cleanup()

        # Grab ZIP file from in-memory, make response with correct MIME-type
        response = HttpResponse(
            s.getvalue(), content_type="application/x-zip-compressed")
        response['Content-Disposition'] = 'attachment; filename=%s' % zip_filename
        response.set_cookie('fileDownload', 'true')
        return response
