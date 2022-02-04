# coding=utf-8
""""Custom signals and listeners for Catalog

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

"""

__author__ = 'elpaso@itopen.it'
__date__ = '2019-01-14'
__copyright__ = 'Copyright 2019, Gis3W'

import django.dispatch

# Signal emitted when all catalogs need to be invalidated
invalidate_all_catalogs_signal = django.dispatch.Signal()
