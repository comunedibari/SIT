# Generated by Django 2.2.9 on 2020-01-07 10:03

from django.db import migrations
from django_extensions.db import fields

class Migration(migrations.Migration):

    dependencies = [
        ('law', '0004_auto_20190613_1308'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='articles',
            options={},
        ),
        migrations.AlterModelOptions(
            name='laws',
            options={'permissions': (('manage_articles', 'Can work on articles'),)},
        ),
        migrations.AlterField(
            model_name='articles',
            name='slug',
            field=fields.AutoSlugField(blank=True, editable=False, null=True, populate_from='number', unique=True, verbose_name='Slug'),
        ),
        migrations.AlterField(
            model_name='laws',
            name='slug',
            field=fields.AutoSlugField(blank=True, editable=False, populate_from='name', unique=True, verbose_name='Slug'),
        ),
    ]
