# Generated by Django 2.2.26 on 2022-02-25 07:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cadastre', '0036_configlayer'),
    ]

    operations = [
        migrations.AlterField(
            model_name='personafisica',
            name='id_soggetto',
            field=models.BigIntegerField(primary_key=True, serialize=False),
        ),
    ]
