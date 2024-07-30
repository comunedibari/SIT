# coding=utf-8
"""
Custom backend for Comba bari net
.. note:: This program is free software; you can redistribute it and/or modify
     it under the terms of the Mozilla Public License 2.0.
"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2019-05-06'
__copyright__ = 'Copyright 2019, GIS3W'

import re
from django.core.cache import cache
from django_auth_ldap.backend import LDAPBackend, LDAPSearch, _LDAPUser, logger
import ldap


class _BariLDAPUser(_LDAPUser):

    def __init__(self, backend, username=None, user=None, request=None):
        username = username[0:20]
        super(_BariLDAPUser, self).__init__(backend, username=username, user=user, request=request)

    def _load_user_attrs(self):
        if self.dn is not None:
            search = LDAPSearch("DC=comba,DC=comune,DC=bari,DC=it",
                                ldap.SCOPE_SUBTREE, "(sAMAccountName={})".format(self._username))
            results = search.execute(self.connection)

            logger.debug(search)

            if results is not None and len(results) > 0:
                self._user_attrs = results[0][1]
                self._user_dn = self._user_attrs['distinguishedname'][0]

    '''
    def _construct_simple_user_dn(self):

        user_dn = "sAMAccountName={},OU=Utenti,DC=comba,DC=comune,DC=bari,DC=it".format(self._username)

        return user_dn
    '''


class BariLDAPBackend(LDAPBackend):

    def authenticate(self, request, username=None, password=None, **kwargs):
        if password or self.settings.PERMIT_EMPTY_PASSWORD:
            ldap_user = _BariLDAPUser(self, username=username.strip(), request=request)
            user = self.authenticate_ldap_user(ldap_user, password)
        else:
            logger.debug('Rejecting empty password for {}'.format(username))
            user = None

        return user