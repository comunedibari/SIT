# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-10-04 11:43
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.manager


class Migration(migrations.Migration):

    dependencies = [
        ('cadastre', '0005_auto_20171004_0817'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='identificativiimmobiliari',
            managers=[
                ('cadastre_objects', django.db.models.manager.Manager()),
            ],
        ),
        migrations.AlterField(
            model_name='identificativiimmobiliari',
            name='id_immobile',
            field=models.IntegerField(),
        ),
        migrations.AlterUniqueTogether(
            name='identificativiimmobiliari',
            unique_together=set([('id_immobile', 'progressivo', 'codice_comune', 'sezione_urbana', 'sezione', 'foglio', 'numero', 'denominatore', 'subalterno')]),
        ),
        migrations.RunSQL(
            "CREATE UNIQUE INDEX identificativi_immobilia_id_immobile_progressivo__dd9f0540_inde "
            "ON public.identificativi_immobiliari "
            "USING btree ("
            "id_immobile, "
            "(COALESCE(progressivo, '-1'::integer)), "
            "(COALESCE(codice_comune, '0000'::character varying)) COLLATE pg_catalog.\"default\", "
            "(COALESCE(sezione_urbana, '-1-1-1'::character varying)) COLLATE pg_catalog.\"default\", "
            "(COALESCE(sezione, '-1'::integer)), "
            "(COALESCE(foglio, 'AAAA'::character varying)) COLLATE pg_catalog.\"default\", "
            "(COALESCE(numero, 'AAAAA'::character varying)) COLLATE pg_catalog.\"default\", "
            "(COALESCE(denominatore, '-1'::integer)), "
            "(COALESCE(subalterno, 'AAAA'::character varying)) COLLATE pg_catalog.\"default\")"
        )
    ]