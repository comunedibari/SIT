# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-06-09 07:37


from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0020_auto_20160530_0740'),
    ]

    operations = [
        migrations.AlterField(
            model_name='g3weditingfeaturelock',
            name='feature_lock_id',
            field=models.CharField(db_index=True, max_length=32),
        ),
    ]