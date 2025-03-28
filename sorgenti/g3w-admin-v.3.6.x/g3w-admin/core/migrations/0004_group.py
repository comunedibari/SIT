# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-02-16 10:43


from django.db import migrations, models
import django.utils.timezone
import model_utils.fields
import django_extensions.db.fields


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_qdjango2treeitem_type_header'),
    ]

    operations = [
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('name', models.CharField(max_length=255, unique=True, verbose_name='Name')),
                ('title', models.CharField(max_length=255, verbose_name='Title')),
                ('description', models.TextField(blank=True, verbose_name='Description')),
                ('slug', django_extensions.db.fields.AutoSlugField(editable=False, unique=True, populate_from=['name'], verbose_name='Slug')),
                ('is_active', models.BooleanField(default=1, verbose_name='Is active')),
                ('lang', models.CharField(choices=[(b'af', b'Afrikaans'), (b'ar', b'Arabic'), (b'ast', b'Asturian'), (b'az', b'Azerbaijani'), (b'bg', b'Bulgarian'), (b'be', b'Belarusian'), (b'bn', b'Bengali'), (b'br', b'Breton'), (b'bs', b'Bosnian'), (b'ca', b'Catalan'), (b'cs', b'Czech'), (b'cy', b'Welsh'), (b'da', b'Danish'), (b'de', b'German'), (b'el', b'Greek'), (b'en', b'English'), (b'en-au', b'Australian English'), (b'en-gb', b'British English'), (b'eo', b'Esperanto'), (b'es', b'Spanish'), (b'es-ar', b'Argentinian Spanish'), (b'es-co', b'Colombian Spanish'), (b'es-mx', b'Mexican Spanish'), (b'es-ni', b'Nicaraguan Spanish'), (b'es-ve', b'Venezuelan Spanish'), (b'et', b'Estonian'), (b'eu', b'Basque'), (b'fa', b'Persian'), (b'fi', b'Finnish'), (b'fr', b'French'), (b'fy', b'Frisian'), (b'ga', b'Irish'), (b'gd', b'Scottish Gaelic'), (b'gl', b'Galician'), (b'he', b'Hebrew'), (b'hi', b'Hindi'), (b'hr', b'Croatian'), (b'hu', b'Hungarian'), (b'ia', b'Interlingua'), (b'id', b'Indonesian'), (b'io', b'Ido'), (b'is', b'Icelandic'), (b'it', b'Italian'), (b'ja', b'Japanese'), (b'ka', b'Georgian'), (b'kk', b'Kazakh'), (b'km', b'Khmer'), (b'kn', b'Kannada'), (b'ko', b'Korean'), (b'lb', b'Luxembourgish'), (b'lt', b'Lithuanian'), (b'lv', b'Latvian'), (b'mk', b'Macedonian'), (b'ml', b'Malayalam'), (b'mn', b'Mongolian'), (b'mr', b'Marathi'), (b'my', b'Burmese'), (b'nb', b'Norwegian Bokmal'), (b'ne', b'Nepali'), (b'nl', b'Dutch'), (b'nn', b'Norwegian Nynorsk'), (b'os', b'Ossetic'), (b'pa', b'Punjabi'), (b'pl', b'Polish'), (b'pt', b'Portuguese'), (b'pt-br', b'Brazilian Portuguese'), (b'ro', b'Romanian'), (b'ru', b'Russian'), (b'sk', b'Slovak'), (b'sl', b'Slovenian'), (b'sq', b'Albanian'), (b'sr', b'Serbian'), (b'sr-latn', b'Serbian Latin'), (b'sv', b'Swedish'), (b'sw', b'Swahili'), (b'ta', b'Tamil'), (b'te', b'Telugu'), (b'th', b'Thai'), (b'tr', b'Turkish'), (b'tt', b'Tatar'), (b'udm', b'Udmurt'), (b'uk', b'Ukrainian'), (b'ur', b'Urdu'), (b'vi', b'Vietnamese'), (b'zh-hans', b'Simplified Chinese'), (b'zh-hant', b'Traditional Chinese')], max_length=20, verbose_name='lang')),
                ('header_logo_img', models.FileField(upload_to='logo_img', verbose_name='headerLogoImg')),
                ('header_logo_height', models.IntegerField(verbose_name='headerLogoHeight')),
                ('header_logo_link', models.URLField(blank=True, null=True, verbose_name='headerLogoLink')),
                ('max_scale', models.IntegerField(verbose_name='Max scale')),
                ('min_scale', models.IntegerField(verbose_name='Min scale')),
                ('panoramic_max_scale', models.IntegerField(verbose_name='Panoramic max scale')),
                ('panoramic_min_scale', models.IntegerField(verbose_name='Panoramic min scale')),
                ('units', models.CharField(choices=[('meters', 'Meters'), ('feet', 'Feet'), ('degrees', 'Degrees')], default='meters', max_length=255, verbose_name='Units')),
                ('srid', models.IntegerField(verbose_name='SRID/EPSG')),
                ('use_commercial_maps', models.BooleanField(default=False, verbose_name='Use commercial maps')),
                ('use_osm_maps', models.BooleanField(default=False, verbose_name='Use OpenStreetMap base map')),
                ('header_terms_of_use_text', models.TextField(blank=True, verbose_name='headerTermsOfUseText')),
                ('header_terms_of_use_link', models.URLField(blank=True, verbose_name='headerTermsOfUseLink')),
            ],
            options={
                'permissions': (('view_group', 'Can view group'),),
            },
        ),
    ]
