# Generated by Django 2.2.27 on 2022-03-15 13:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('catalog', '0049_record_eu_license'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='UELicense',
            new_name='EULicense',
        ),
    ]