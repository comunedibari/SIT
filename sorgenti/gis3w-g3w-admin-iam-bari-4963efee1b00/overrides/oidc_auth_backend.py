# coding=utf-8
""""

Custom OIDC auth backend for IAM Bari, use `sub` instead of `email`

.. note:: This program is free software; you can redistribute it and/or modify
          it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'elpaso@itopen.it'
__date__ = '2021-10-19'
__copyright__ = 'Copyright 2021, Gis3W'


from mozilla_django_oidc.auth import OIDCAuthenticationBackend
from django.contrib.auth.models import User
from usersmanage.models import Userbackend


class IAMOIDCAB(OIDCAuthenticationBackend):

    def filter_users_by_claims(self, claims):
        """Filter user by `sub` (fiscal code)"""

        sub = claims.get('sub')
        #email = claims.get('email')

        if not sub:
            return self.UserModel.objects.none()

        return self.UserModel.objects.filter(username=sub)

    def create_user(self, claims):
        """Return object for a newly created user account."""

        email = claims .get('email')
        username = self.get_username(claims)
        user = self.UserModel.objects.create_user(username, email=email)
        Userbackend.objects.create(user=user, backend='oidc')

        return user

    def get_username(self, claims):
        """Generate username based on sub."""

        return claims.get('sub')
