# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2019-02-21 08:54
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('catalog', '0011_auto_20190129_0733'),
    ]

    operations = [
        migrations.AlterField(
            model_name='record',
            name='xml',
            field=models.TextField(help_text='Maps to pycsw:XML'),
        ),
    ]
