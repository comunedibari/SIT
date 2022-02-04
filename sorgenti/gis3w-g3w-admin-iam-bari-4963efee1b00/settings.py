# coding=utf-8
""""
Mozilla django oidc IAM Bari openid connect settings

.. note:: This program is free software; you can redistribute it and/or modify
          it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'elpaso@itopen.it'
__date__ = '2021-10-19'
__copyright__ = 'Copyright 2021, Gis3W'


#########################################################
#

import urllib3
import os

# IAM Bari
OIDC_RP_CLIENT_ID = os.environ.get("OIDC_RP_CLIENT_ID")
OIDC_RP_CLIENT_SECRET = os.environ.get("OIDC_RP_CLIENT_SECRET")
OIDC_OP_AUTHORIZATION_ENDPOINT = "https://coll.partecipa.ba.it/sso/oauth2/authorize"
OIDC_OP_TOKEN_ENDPOINT = "https://coll.partecipa.ba.it/sso/oauth2/access_token"
OIDC_OP_USER_ENDPOINT = "https://coll.partecipa.ba.it/sso/oauth2/userinfo"
OIDC_OP_JWKS_ENDPOINT = "https://coll.partecipa.ba.it/sso/oauth2/connect/jwk_uri"
OIDC_RP_SIGN_ALGO = "RS256"


# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# The following insecure options have been used for development
# DO NOT USE IN PRODUCTION
# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

OIDC_VERIFY_SSL = False
OIDC_VERIFY_JWT = False
OIDC_VERIFY_KID = False
OIDC_ALLOW_UNSECURED_JWT = True
