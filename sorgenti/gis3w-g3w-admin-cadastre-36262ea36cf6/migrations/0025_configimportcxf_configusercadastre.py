# -*- coding: utf-8 -*-
# Generated by Django 1.11.18 on 2019-04-01 17:06
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('cadastre', '0024_auto_20190401_1705'),
    ]

    operations = [
        migrations.CreateModel(
            name='ConfigImportCxf',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('codice_comune', models.CharField(max_length=4, unique=True, verbose_name='Municipy code')),
                ('db_host', models.CharField(max_length=255, verbose_name='Ip or host DB')),
                ('db_port', models.IntegerField(default=5432, verbose_name='Port DB')),
                ('db_name', models.CharField(max_length=255, verbose_name='DB name')),
                ('db_schema', models.CharField(default=b'public', max_length=255, verbose_name='DB schema')),
                ('db_user', models.CharField(max_length=255, verbose_name='DB user')),
                ('db_password', models.CharField(max_length=255, verbose_name='DB password')),
            ],
        ),
        migrations.CreateModel(
            name='ConfigUserCadastre',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('codice_comune', models.CharField(max_length=4, verbose_name='Municipy code')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
