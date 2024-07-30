# coding=utf-8
""""Provider for PostgreSql.

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2021-05-13'
__copyright__ = 'Copyright 2015 - 2021, Gis3w'

from django.forms import ValidationError
from django.utils.translation import ugettext, ugettext_lazy as _
from .base import BaseProvider
import psycopg2


class PGProvider(BaseProvider):
    """DB provider for PostgreSql"""

    def __init__(self, **config_import_cxf):
        super().__init__(**config_import_cxf)

    def connect(self):
        """Create a psycopg2 connection object"""

        try:
            self.connection = psycopg2.connect(
                host=self.host,
                port=self.port,
                dbname=self.dbname,
                user=self.username,
                password=self.password
            )

        except Exception as e:
            raise ValidationError(
                _('DB CONNECTION problem: {}'.format(e)))

        super().connect()

    def table_exists(self):
        """
        Check is table exists inside DB

        :return: Table exists
        :return type: bool
        """

        cursor = self.connection.cursor()
        cursor.execute(f"SELECT EXISTS ("
                       f"SELECT 1 FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n "
                       f"ON n.oid = c.relnamespace "
                       f"WHERE n.nspname = '{self.schema}' AND c.relname = '{self.tablename}')")

        exists = False if not next(cursor)[0] else True
        cursor.close()
        return exists

    def clear_table_data_by_cod_com(self):
        """
        Delete from table data with cod_com
        """

        cursor = self.connection.cursor()
        cursor.execute(f"DELETE FROM {self.schema}.{self.tablename} WHERE codice_comune='{self.cod_com}'")
        cursor.close()
        self.connection.commit()

    def insert_table_data(self, rows):
        """
        Insert table data by INSERT statement
        """

        cursor = self.connection.cursor()
        for raw_data in rows:
            if raw_data is not None:
                geom = f"ST_GeomFromText('{raw_data['sgeometria']}',{str(raw_data['CRS'])})"
                sql = f"INSERT INTO {self.schema}" \
                      f".{self.tablename} (" \
                      f"nomefile, " \
                      f"codice_comune, " \
                      f"tipo, " \
                      f"sezione, " \
                      f"allegato, " \
                      f"foglio, " \
                      f"numero, " \
                      f"task_id, " \
                      f"geom) VALUES  (" \
                      f"'{raw_data['nomefile']}'," \
                      f"'{raw_data['codice_comune']}'," \
                      f"'{raw_data['tipo']}'," \
                      f"'{raw_data['sezione']}'," \
                      f"'{raw_data['allegato']}'," \
                      f"'{raw_data['foglio']}'," \
                      f"'{raw_data['numero']}'," \
                      f"'{raw_data['task_id']}', " \
                      f"{geom})"
                cursor.execute(sql)
        cursor.close()
        self.connection.commit()

    def check_crs(self):
        """
        Check if Table has same CRS than CXFImportConfig instance.

        :return: Result of check
        :return type: bool
        """

        cursor = self.connection.cursor()
        cursor.execute(f"SELECT Find_SRID('{self.schema}','{self.tablename}','geom')")
        tb_srid = next(cursor)[0]
        if tb_srid != self.srid:
            self.connection.close()
            raise ValidationError(
                _('SRID problem: Table has a SRID ({}) not equal to set in current form'.format(tb_srid)))

        cursor.close()

    def create_table(self):
        """
        Create Table inside DB
        """

        sql = f"CREATE TABLE {self.schema}.{self.tablename} " \
              f"(" \
              f"gid serial," \
              f"tipo character varying(1)," \
              f"foglio character varying(4)," \
              f"numero character varying(5)," \
              f"sezione character varying(1)," \
              f"allegato character varying(1)," \
              f"codice_comune character varying(4) NOT NULL," \
              f"nomefile character varying(11)," \
              f"geom geometry(Polygon,{self.srid})," \
              f"task_id character varying(255)," \
              f"CONSTRAINT {self.tablename}_pkey PRIMARY KEY (gid)" \
              f")" \
              f"WITH (" \
              f"OIDS=FALSE" \
              f")"

        cursor = self.connection.cursor()
        cursor.execute(sql)

        # create index on geom
        sql = f"CREATE INDEX sidx_{self.schema}_{self.tablename}_geom " \
              f"ON {self.schema}.{self.tablename} " \
              f"USING gist (geom)"

        cursor.execute(sql)
        cursor.close()
        self.connection.commit()


