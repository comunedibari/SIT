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
from django.conf import settings
from django.contrib.auth.models import User, Group as AuthGroup
from usersmanage.models import Userbackend
from usersmanage.configs import G3W_VIEWER1


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

        email = claims.get('email')
        username = self.get_username(claims)
        user = self.UserModel.objects.create_user(username, email=email)

        Userbackend.objects.create(user=user, backend='oidc')

        AuthGroup.objects.get(name=G3W_VIEWER1).user_set.add(user)

        return user

    def get_username(self, claims):
        """Generate username based on sub."""

        return claims.get('sub')

    def get_or_create_user(self, access_token, id_token, payload):

        user = super().get_or_create_user(access_token, id_token, payload)

        # If return user instance try to check if AuthGroup IAM exists and add to user
        if user:
            iam_user_group, created = AuthGroup.objects.get_or_create(name='IAM')
            iam_user_group.user_set.add(user)

        return user

    def authenticate(self, request, **kwargs):
        """For Change settings"""
        ret = super().authenticate(request, **kwargs)

        if ret:
            settings.LOGIN_REDIRECT_URL = '/'

        return ret
