# Generated by Django 3.2.25 on 2024-07-31 07:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('qpdnd', '0009_qpdndproject_license'),
    ]

    operations = [
        migrations.AddField(
            model_name='qpdndproject',
            name='x_api_id',
            field=models.CharField(blank=True, max_length=36, null=True),
        ),
    ]