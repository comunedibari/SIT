# Generated by Django 2.2.16 on 2021-01-08 11:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0066_auto_20200424_1422'),
    ]

    operations = [
        migrations.AddField(
            model_name='baselayer',
            name='order',
            field=models.PositiveIntegerField(db_index=True, default=0, editable=False, verbose_name='order'),
            preserve_default=False,
        ),
    ]