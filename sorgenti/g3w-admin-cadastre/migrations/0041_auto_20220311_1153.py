# Generated by Django 2.2.27 on 2022-03-11 11:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cadastre', '0040_auto_20220310_1705'),
    ]

    operations = [
        migrations.AlterField(
            model_name='titolarita',
            name='soggetto_riferimento',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='Soggetto di riferimento'),
        ),
    ]
