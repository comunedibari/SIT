# Generated by Django 3.2.25 on 2024-09-20 08:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('qpdnd', '0011_auto_20240920_0809'),
    ]

    operations = [
        migrations.AlterField(
            model_name='qpdndproject',
            name='qpdnd_env',
            field=models.CharField(choices=[('prod', 'PRODUCTION'), ('test', 'TESTING')], default='test', help_text='Set the PDND environment for this API (Production, Testing)', max_length=4, null=True),
        ),
    ]