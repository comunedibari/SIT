# coding=utf-8
""""

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2020-07-09'
__copyright__ = 'Copyright 2015 - 2020, Gis3w'

from django.contrib import admin
from guardian.admin import GuardedModelAdmin
from .models import EleProProject, EleProDTM


@admin.register(EleProProject)
class EleProProjectAdmin(GuardedModelAdmin):
    pass


@admin.register(EleProDTM)
class EleProDTMAdmin(GuardedModelAdmin):
    pass
