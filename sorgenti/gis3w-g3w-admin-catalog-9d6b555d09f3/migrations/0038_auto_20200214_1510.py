# -*- coding: utf-8 -*-
# Generated by Django 1.11.23 on 2020-02-14 15:10
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('catalog', '0037_auto_20200213_1540'),
    ]

    operations = [
        migrations.AlterField(
            model_name='record',
            name='inspire_owner_contact_email',
            field=models.CharField(blank=True, help_text='2.1.2.4 Responsabile - the email address of the owner, inherited from catalog if left blank', max_length=255, null=True, verbose_name='2.1.2.4 INSPIRE owner contact email'),
        ),
        migrations.AlterField(
            model_name='record',
            name='inspire_owner_contact_organization',
            field=models.CharField(blank=True, help_text='2.1.2.4 Responsabile - INSPIRE the organization name of the owner, inherited from catalog if left blank', max_length=255, null=True, verbose_name='2.1.2.4 INSPIRE owner contact organization'),
        ),
        migrations.AlterField(
            model_name='record',
            name='inspire_owner_contact_phone',
            field=models.CharField(blank=True, help_text='2.1.2.4 Responsabile - the telephone number of the owner, inherited from catalog if left blank', max_length=255, null=True, verbose_name='2.1.2.4 INSPIRE owner contact phone'),
        ),
        migrations.AlterField(
            model_name='record',
            name='inspire_owner_contact_url',
            field=models.CharField(blank=True, help_text='2.1.2.4 Responsabile - the URL of the owner, inherited from catalog if left blank', max_length=255, null=True, verbose_name='2.1.2.4 INSPIRE owner contact url'),
        ),
    ]
