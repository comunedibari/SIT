# coding=utf-8
""""Custom signals for CDU module.

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2021-10-11'
__copyright__ = 'Copyright 2015 - 2021, Gis3w'

import django.dispatch

# Signal called before CDU calculate
before_calculate = django.dispatch.Signal()

# Signal called after CDU calculate
after_calculate = django.dispatch.Signal()

# Signal called before CDU generation document(odt|pdf)
before_write_document = django.dispatch.Signal(providing_args=['request'])

# Signal called after CDU generation document(odt|pdf)
after_write_document = django.dispatch.Signal(providing_args=['request'])