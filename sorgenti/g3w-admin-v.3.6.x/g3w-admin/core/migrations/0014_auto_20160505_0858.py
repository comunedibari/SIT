# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-05-05 08:58


from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0013_auto_20160505_0830'),
    ]

    operations = [
        migrations.AlterField(
            model_name='group',
            name='srid',
            field=models.ForeignKey(db_column='srid', on_delete=django.db.models.deletion.CASCADE, to='core.G3WSpatialRefSys'),
        ),
    ]