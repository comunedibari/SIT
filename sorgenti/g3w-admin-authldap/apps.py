# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.apps import AppConfig


class AuthldapConfig(AppConfig):
    name = 'authldap'
    verbose_name = 'Auth LDAP'

    def ready(self):

        # import signal handlers
        import authldap.receivers
        from usersmanage.models import USER_BACKEND_TYPES
        USER_BACKEND_TYPES['ldap'] = 'LDAP'

