# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2019-02-21 17:32
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('catalog', '0014_catalog_inspire_contact_phone'),
    ]

    operations = [
        migrations.AddField(
            model_name='catalog',
            name='inspire_geographical_extent',
            field=models.CharField(blank=True, help_text='inspire_geographical_extent of the service. Space separated values of lon/lat (west south east north', max_length=255, null=True, verbose_name='inspire_geographical_extent'),
        ),
        migrations.AlterField(
            model_name='catalog',
            name='identification_accessconstraints',
            field=models.CharField(blank=True, help_text='Text description for other constraints', max_length=255, null=True, verbose_name='identification_accessconstraints'),
        ),
    ]
