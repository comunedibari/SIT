# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-10-09 13:34
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cadastre', '0010_auto_20171009_1315'),
    ]

    operations = [
        migrations.AddField(
            model_name='config',
            name='codice_comune',
            field=models.CharField(blank=True, max_length=4),
        ),
    ]