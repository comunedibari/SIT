# Generated by Django 3.2.25 on 2024-07-30 10:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('qpdnd', '0008_license_node_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='qpdndproject',
            name='license',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='qpdnd.license'),
        ),
    ]
