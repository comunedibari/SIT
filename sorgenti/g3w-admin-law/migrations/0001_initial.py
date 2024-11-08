# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-03-25 10:41
from __future__ import unicode_literals

from django.db import migrations, models
from django_extensions.db import fields
import django.db.models.deletion
import django.utils.timezone

import model_utils.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Articles',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.CharField(max_length=255, verbose_name='Article number')),
                ('title', models.CharField(blank=True, max_length=255, verbose_name='Title')),
                ('comma', models.CharField(blank=True, max_length=255, verbose_name='Article comma number')),
                ('content', models.TextField(verbose_name='Article content')),
                ('slug', fields.AutoSlugField(blank=True, editable=False, null=True, populate_from='number', unique=True, verbose_name='Slug')),
            ],
            options={
                'permissions': (('view_articles', 'Can view law articles list'),),
            },
        ),
        migrations.CreateModel(
            name='Laws',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('name', models.CharField(max_length=255, verbose_name='Law name')),
                ('description', models.TextField(blank=True, verbose_name='Law description')),
                ('variation', models.CharField(blank=True, max_length=255, verbose_name='Variation')),
                ('fromdate', models.DateField(verbose_name='Valid from')),
                ('todate', models.DateField(verbose_name='Valid to')),
                ('slug', fields.AutoSlugField(blank=True, editable=False, populate_from='name', unique=True, verbose_name='Slug')),
            ],
            options={
                'permissions': (('view_laws', 'Can view laws list'),),
            },
        ),
        migrations.AddField(
            model_name='articles',
            name='law',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='law.Laws'),
        ),
    ]
