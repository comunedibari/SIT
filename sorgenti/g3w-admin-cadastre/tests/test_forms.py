# coding=utf-8
"""
    Test forms cadastre module
.. note:: This program is free software; you can redistribute it and/or modify
     it under the terms of the Mozilla Public License 2.0.
"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2019-12-04'
__copyright__ = 'Copyright 2019, GIS3W'

from django.test.client import RequestFactory
from django.test.testcases import settings
from cadastre.forms import ConfigForm, Config, ConfigCXFDBForm, ConfigUserForm
from core.models import G3WSpatialRefSys
from .base import CadastreTestsBase, CODICE_COMUNE, CODICE_COMUNE2
import psycopg2


class CadastreFormsTest(CadastreTestsBase):
    """ Test cadastre module configs"""

    def test_config_form(self):
        """ Test main form for main config model """


        # instance a request object
        request = RequestFactory()

        # add user
        request.user = self.test_user_admin1

        # qdjango project instance
        project = self.project.instance

        # check fail validation form with empty data
        form = ConfigForm(request=request)
        self.assertFalse(form.is_valid())

        # check create projectconfig without layers
        data = {
            'codice_comune': CODICE_COMUNE,
            'project': project.pk
        }

        form = ConfigForm(request=request, data=data)

        # check validation
        self.assertFalse(form.is_valid())

        # check create projectconfig with layers
        data = {
            'codice_comune': CODICE_COMUNE,
            'project': project.pk,
            'layers': [project.layer_set.all()[0].pk]
        }

        form = ConfigForm(request=request, data=data)

        # check validation
        self.assertTrue(form.is_valid())

        # check saved data
        form.save()

        pconfig = Config.objects.get(project=project)
        self.assertEqual(pconfig, form.instance)
        self.assertEqual(form.instance.codice_comune, CODICE_COMUNE)

        # check update
        data = {
            'codice_comune': CODICE_COMUNE2,
            'project': project.pk,
            'layers': [project.layer_set.all()[0].pk]
        }
        form = ConfigForm(request=request, data=data, instance=form.instance)
        form.save()

        self.assertEqual(form.instance.codice_comune, CODICE_COMUNE2)
        self.assertEqual(form.instance.configlayer_set.all()[0].layer, project.layer_set.all()[0])

        form.instance.delete()

        # TEST project with 2 layers
        # -------------------------------------------------

        # qdjango project instance
        project2l = self.project2l.instance

        data = {
            'codice_comune': CODICE_COMUNE2,
            'project': project2l.pk
        }

        form = ConfigForm(request=request, data=data)

        # check validation
        self.assertFalse(form.is_valid())

        # check create projectconfig with layers
        data = {
            'codice_comune': CODICE_COMUNE2,
            'project': project2l.pk,
            'layers': [project2l.layer_set.filter(origname='catasto')[0].pk]
        }

        form = ConfigForm(request=request, data=data)

        # check validation
        self.assertTrue(form.is_valid())

        # check create projectconfig with layers
        data = {
            'codice_comune': CODICE_COMUNE2,
            'project': project2l.pk,
            'layers': [l.pk for l in project2l.layer_set.all()]
        }

        form = ConfigForm(request=request, data=data)

        # check validation
        self.assertFalse(form.is_valid())
        self.assertTrue('layers' in form.errors)


    def test_ConfigCXFDB_form(self):
        """ Test form used to create CXF catasto table and connection if table exists """

        # get default db connection
        db_conn = settings.DATABASES['default']

        # instance a pg db connection
        pg_conn = psycopg2.connect(
            host=db_conn['HOST'],
            port=db_conn['PORT'],
            dbname=db_conn['NAME'],
            user=db_conn['USER'],
            password=db_conn['PASSWORD']
        )

        # instance a request object
        request = RequestFactory()

        # add user
        #request.user = self.test_user_admin1

        # check empty form
        form = ConfigCXFDBForm(request=request)
        self.assertFalse(form.is_valid())

        # check creation table/connection
        data = {
            'codice_comune': 'F035',
            'db_host': db_conn['HOST'],
            'db_port': db_conn['PORT'],
            'db_name': db_conn['NAME'],
            'db_schema': 'public',
            'db_table': 'test_cadastre',
            'db_user': db_conn['USER'],
            'db_password': db_conn['PASSWORD'],
            'srid': G3WSpatialRefSys.objects.get(srid=3003).srid,
            'provider': 'postgresql'
        }

        form = ConfigCXFDBForm(request=request, data=data)
        self.assertTrue(form.is_valid())
        form.save()

        # check table exists
        # =============================================================================================
        cursor = pg_conn.cursor()
        cursor.execute("SELECT EXISTS ("
                       "SELECT 1 FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n "
                       "ON n.oid = c.relnamespace "
                       "WHERE n.nspname = '{}' AND c.relname = '{}')".format('public', 'test_cadastre'))

        self.assertTrue(next(cursor)[0])

        cursor.close()
        pg_conn.close()

        form.instance.delete()

        # check connection error
        data = {
            'codice_comune': 'F035',
            'db_host': db_conn['HOST'],
            'db_port': db_conn['PORT'],
            'db_name': db_conn['NAME'],
            'db_schema': 'public',
            'db_table': 'test_cadastre',
            'db_user': 'XXXXXXX',
            'db_password': 'YYYYYYYY',
            'srid': G3WSpatialRefSys.objects.get(srid=3003).srid,
            'provider': 'postgresql'
        }

        form = ConfigCXFDBForm(request=request, data=data)
        self.assertFalse(form.is_valid())

        # check error __all__ for db connection
        self.assertTrue(str(form.errors['__all__'].data[0].message).startswith('DB CONNECTION'))

        # check SRID error
        data = {
            'codice_comune': 'F035',
            'db_host': db_conn['HOST'],
            'db_port': db_conn['PORT'],
            'db_name': db_conn['NAME'],
            'db_schema': 'public',
            'db_table': 'test_cadastre',
            'db_user': db_conn['USER'],
            'db_password': db_conn['PASSWORD'],
            'srid': G3WSpatialRefSys.objects.get(srid=2003).srid,
            'provider': 'postgresql'
        }

        form = ConfigCXFDBForm(request=request, data=data)
        self.assertFalse(form.is_valid())

        # check error __all__ for SRID table
        self.assertTrue(str(form.errors['__all__'].data[0].message).startswith('SRID problem'))

    def test_configUser_form(self):
        """ Test load data user form association """

        # instance a request object
        request = RequestFactory()

        # check empty form
        form = ConfigUserForm(request=request)
        self.assertFalse(form.is_valid())

        # check valid form and save it
        data = {
            'user': self.test_user_editor1.pk,
            'codice_comune': 'F035'
        }

        form = ConfigUserForm(request=request, data=data)
        self.assertTrue(form.is_valid())
        form.save()

        # check only once user codice_comune combination
        data = {
            'user': self.test_user_editor1.pk,
            'codice_comune': 'F035'
        }

        form1 = ConfigUserForm(request=request, data=data)
        self.assertFalse(form1.is_valid())
        self.assertTrue('codice_comune' in form1.errors)

        # check user is Editor Level 1
        data = {
            'user': self.test_user_admin1.pk,
            'codice_comune': 'B648'
        }

        form2 = ConfigUserForm(request=request, data=data)
        self.assertFalse(form2.is_valid())
        self.assertTrue('user' in form2.errors)

        form.instance.delete()










