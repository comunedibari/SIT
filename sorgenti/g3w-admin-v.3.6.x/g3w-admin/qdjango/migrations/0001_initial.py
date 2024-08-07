# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-03-03 13:26


from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields
import django_extensions.db.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('core', '0005_auto_20160229_0815'),
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('qgis_file', models.FileField(upload_to=b'', verbose_name='QGIS project file')),
                ('title', models.CharField(max_length=255, verbose_name='Title')),
                ('description', models.TextField(blank=True, verbose_name='Description')),
                ('slug', django_extensions.db.fields.AutoSlugField(editable=False, unique=True, populate_from=['title'],verbose_name='Slug')),
                ('is_active', models.BooleanField(default=1, verbose_name='Is active')),
                ('thumbnail', models.ImageField(blank=True, null=True, upload_to=b'', verbose_name='Thumbnail')),
                ('initial_extent', models.CharField(max_length=255, verbose_name='Initial extent')),
                ('max_extent', models.CharField(max_length=255, verbose_name='Max extent')),
                ('is_panoramic_map', models.BooleanField(default=0, verbose_name='Is panoramic map')),
                ('qgis_version', models.CharField(default=b'', max_length=255, verbose_name='Qgis project version')),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Group', verbose_name='Group')),
            ],
            options={
                'permissions': (('view_project', 'Can view project'),),
            },
        ),
        migrations.AlterUniqueTogether(
            name='project',
            unique_together=set([('title', 'group')]),
        ),
    ]
