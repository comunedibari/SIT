# coding=utf-8
""""Abstract class for DB providers.

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2021-05-13'
__copyright__ = 'Copyright 2015 - 2021, Gis3w'


class BaseProvider(object):
    """Base abstract class for providers"""

    connection = None

    def __init__(self, **config_import_cxf):

        # for connection
        self.host = config_import_cxf['db_host']
        self.port = config_import_cxf['db_port']
        self.dbname = config_import_cxf['db_name']
        self.schema = config_import_cxf['db_schema']
        self.tablename = config_import_cxf['db_table']

        # for comune
        self.cod_com = config_import_cxf['codice_comune']

        # user data
        self.username = config_import_cxf['db_user']
        self.password = config_import_cxf['db_password']

        # geo info
        # todo: check if G3WSpatialRefSys instance or str/number
        self.srid = config_import_cxf['srid'] \
            if isinstance(config_import_cxf['srid'], int) else config_import_cxf['srid'].srid

    def connect(self):
        """Instance a Db connection"""
        pass

    def close(self):
        """Close Db connection"""
        self.connection.close()

    def table_exists(self):
        """
        Check is table exists inside DB

        :return: Table exists
        :return type: bool
        """
        pass

    def clear_table_data_by_cod_com(self):
        """
        Delete from table data with cod_com
        """
        pass

    def insert_table_data(self):
        """
        Insert table data by INSERT statement
        """
        pass

    def check_crs(self):
        """
        Check if Table has same CRS than CXFImportConfig instance.

        :return: Result of check
        :return type: bool
        """
        print('pass')
        pass

    def create_table(self):
        """
        Create Table inside DB
        """
        pass