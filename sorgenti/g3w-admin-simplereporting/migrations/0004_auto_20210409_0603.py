# Generated by Django 2.2.20 on 2021-04-09 06:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('simplereporting', '0003_auto_20210409_0542'),
    ]

    operations = [
        migrations.AlterField(
            model_name='simplerepolayer',
            name='simplerepo_project',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='simplerepo_layer', to='simplereporting.SimpleRepoProject'),
        ),
    ]
