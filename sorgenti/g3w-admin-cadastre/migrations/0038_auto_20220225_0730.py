# Generated by Django 2.2.26 on 2022-02-25 07:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cadastre', '0037_auto_20220225_0725'),
    ]

    operations = [
        migrations.AlterField(
            model_name='titolarita',
            name='id_soggetto',
            field=models.BigIntegerField(),
        ),
    ]