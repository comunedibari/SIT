# coding=utf-8
""""Catalog APP loader

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

"""

from __future__ import unicode_literals

__author__ = 'elpaso@itopen.it'
__date__ = '2019-03-28'
__copyright__ = 'Copyright 2019, Gis3W'


import os
import warnings

from django.apps import AppConfig


class CatalogConfig(AppConfig):
    name = 'catalog'

    def ready(self):
        super(CatalogConfig, self).ready()

        from . import receivers

        # Monkey patch for pycsw profile loader
        def load_profiles(path, cls, profiles):
            ''' load CSW profiles, return dict by class name '''

            def look_for_subclass(modulename):
                try:
                    module = __import__(modulename)
                except ImportError:
                    module = __import__(modulename.replace('pycsw.plugins.profiles.', 'catalog.rndt_profile.'))
                    aps['plugins']['RNDT'] = module.__dict__['rndt_profile'].__dict__['rndt'].__dict__['rndt'].__dict__['RNDT']
                    return

                dmod = module.__dict__
                for modname in modulename.split('.')[1:]:
                    dmod = dmod[modname].__dict__

                for key, entry in dmod.items():
                    if key == cls.__name__:
                        continue

                    try:
                        if issubclass(entry, cls):
                            aps['plugins'][key] = entry
                    except TypeError:
                        continue

            aps = {}
            aps['plugins'] = {}
            aps['loaded'] = {}

            for prof in profiles.split(','):
                # fgdc, atom, dif, gm03 are supported in core
                # no need to specify them explicitly anymore
                # provide deprecation warning
                # https://github.com/geopython/pycsw/issues/118
                if prof in ['fgdc', 'atom', 'dif', 'gm03']:
                    warnings.warn('%s is now a core module, and does not need to be'
                                ' specified explicitly.  So you can remove %s from '
                                'server.profiles' % (prof, prof))
                else:
                    modulename='%s.%s.%s' % (path.replace(os.sep, '.'), prof, prof)
                    look_for_subclass(modulename)

            return aps


        from pycsw.plugins.profiles import profile
        profile.load_profiles = load_profiles
