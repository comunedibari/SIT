# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-07-27 14:49


from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0022_group_background_color'),
    ]

    operations = [
        migrations.AlterField(
            model_name='group',
            name='background_color',
            field=models.CharField(blank=True, default='#ffffff', max_length=7),
        ),
    ]