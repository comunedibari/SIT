# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-08-17 07:55


from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0024_remove_group_header_logo_height'),
    ]

    operations = [
        migrations.AlterField(
            model_name='group',
            name='header_logo_link',
            field=models.URLField(blank=True, help_text='Enter link with http://, https//kote@25#t', null=True, verbose_name='headerLogoLink'),
        ),
    ]