# coding=utf-8
""""Abstraction provider for different DB provider, i.e. Oracle, PostgreSql ...

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2021-05-13'
__copyright__ = 'Copyright 2015 - 2021, Gis3w'

from .cxfproviders import PGProvider, ORAProvider


class CXFDBProvider(object):
    """Factory class for DB providers"""

    DB_PROVIDERS = {
        'postgresql': PGProvider,
        'oracle': ORAProvider
    }

    def __init__(self, **config_import_cxf):

        # get provider
        try:
            self.provider_key = config_import_cxf['provider']
            if self.provider_key not in self.DB_PROVIDERS.keys():
                raise Exception(f'Provider must be one of: {", ".join(list(self.DB_PROVIDERS.keys()))}')
        except KeyError:
            raise Exception('Provider param is mandatory!')

        # Instance specific provider
        self.provider = self.DB_PROVIDERS[self.provider_key](**config_import_cxf)

    def __enter__(self):
        """ Return provider instance after activated connection"""
        self.provider.connect()
        return self.provider

    def __exit__(self, exc_type, exc_val, exc_tb):
        """ Close DB provider connection"""
        self.provider.close()


