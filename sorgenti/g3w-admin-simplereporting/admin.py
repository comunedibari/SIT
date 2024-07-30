# coding=utf-8
""""Simpolerteporting admin module

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2021-04-08'
__copyright__ = 'Copyright 2015 - 2021, Gis3w'

from django.contrib import admin
from .models import SimpleRepoProject, SimpleRepoLayer

@admin.register(SimpleRepoProject)
class SimpleRepoProjectAdmin(admin.ModelAdmin):
    ...

@admin.register(SimpleRepoLayer)
class SimpleRepoLayerAdmin(admin.ModelAdmin):
    ...
