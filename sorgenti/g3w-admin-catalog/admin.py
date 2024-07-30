# coding=utf-8
""""Admin Models for catalog and record entries

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

"""
from __future__ import unicode_literals

from django.contrib import admin

from . import models


@admin.register(models.Record)
class RecordAdmin(admin.ModelAdmin):
    list_display = ("id", "identifier", "title", "temporal_extent_begin",)
    date_hierarchy = "temporal_extent_begin"


@admin.register(models.Catalog)
class CatalogAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'slug',
        'is_active'
    )


@admin.register(models.EULicense)
class UELicenseAdmin(admin.ModelAdmin):
    list_display = (
        'op_code',
        'url'
    )


@admin.register(models.InspireLimitationsOnPublicAccess)
class InspireLimitationsOnPublicAccessAdmin(admin.ModelAdmin):
    list_display = (
        'label',
        'url'
    )


