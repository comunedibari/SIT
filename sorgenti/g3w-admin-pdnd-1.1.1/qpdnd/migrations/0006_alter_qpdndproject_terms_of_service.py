# Generated by Django 3.2.25 on 2024-07-26 09:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('qpdnd', '0005_auto_20240726_0929'),
    ]

    operations = [
        migrations.AlterField(
            model_name='qpdndproject',
            name='terms_of_service',
            field=models.URLField(help_text='Set an url where to find the terms fo service. I.e.: https://smartbear.com/terms-of-use/', max_length=255, null=True),
        ),
    ]