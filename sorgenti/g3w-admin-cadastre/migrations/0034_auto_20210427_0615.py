# Generated by Django 2.2.20 on 2021-04-27 06:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cadastre', '0033_auto_20200109_1446'),
    ]

    operations = [
        migrations.AlterField(
            model_name='caratteristicheparticella',
            name='reddito_agrario',
            field=models.BigIntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='caratteristicheparticella',
            name='reddito_dominicale',
            field=models.BigIntegerField(blank=True, null=True),
        ),
    ]