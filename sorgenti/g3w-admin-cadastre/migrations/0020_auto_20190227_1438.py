# -*- coding: utf-8 -*-
# Generated by Django 1.11.18 on 2019-02-27 14:38
from __future__ import unicode_literals

import django.contrib.gis.db.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cadastre', '0019_config_attrs'),
    ]

    operations = [
        migrations.CreateModel(
            name='Catasto',
            fields=[
                ('gid', models.AutoField(primary_key=True, serialize=False)),
                ('codice_comune', models.CharField(max_length=4)),
                ('sezione', models.CharField(blank=True, max_length=1, null=True)),
                ('foglio', models.CharField(blank=True, max_length=4, null=True)),
                ('numero', models.CharField(blank=True, max_length=5, null=True)),
                ('tipo', models.CharField(blank=True, max_length=1, null=True)),
                ('nomefile', models.CharField(blank=True, max_length=11, null=True)),
                ('sez', models.CharField(blank=True, max_length=1, null=True)),
                ('the_geom', django.contrib.gis.db.models.fields.PolygonField(blank=True, null=True, srid=32632)),
            ],
            options={
                'db_table': 'catasto',
            },
        ),
        migrations.RemoveField(
            model_name='config',
            name='attrs',
        ),
    ]