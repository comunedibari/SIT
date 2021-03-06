# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2020-01-28 16:17
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('catalog', '0024_auto_20200128_1521'),
    ]

    operations = [
        migrations.AddField(
            model_name='record',
            name='modified_date',
            field=models.DateTimeField(auto_now_add=True, help_text='Maps to pycsw:Modified', null=True),
        ),
        migrations.AlterField(
            model_name='record',
            name='date',
            field=models.DateTimeField(auto_now_add=True, help_text='Maps to pycsw:Date', null=True),
        ),
    ]
