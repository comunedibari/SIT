# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2019-01-14 08:15


from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('qdjango', '0036_layer_download'),
    ]

    operations = [
        migrations.AlterField(
            model_name='layer',
            name='qgs_layer_id',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='Qgis Layer Project ID'),
        ),
    ]