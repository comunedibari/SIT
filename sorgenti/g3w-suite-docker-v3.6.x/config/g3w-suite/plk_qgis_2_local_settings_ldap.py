import ldap
from django_auth_ldap.config import LDAPSearch, GroupOfNamesType
from django_auth_ldap.config import ActiveDirectoryGroupType

AUTH_LDAP_GLOBAL_OPTIONS = {
	ldap.OPT_X_TLS_REQUIRE_CERT: ldap.OPT_X_TLS_NEVER
}


# BASELINE CONFIGURATION
#===========================
AUTH_LDAP_SERVER_URI = "ldap://80.253.40.201:389"
#AUTH_LDAP_SERVER_URI = "ldaps://195.31.167.172:636"
#AUTH_LDAP_SERVER_URI = "ldap://195.31.167.169:636 ldap://195.31.167.169:3269 ldap://195.31.167.172:636 ldap://195.31.172:3269"

#AUTH_LDAP_USER_DN_TEMPLATE = "sAMAccountName=%(user)s,OU=Utenti,DC=comba,DC=comune,DC=bari,DC=it"
AUTH_LDAP_USER_DN_TEMPLATE = "%(user)s@comba.comune.bari.it"

#AUTH_LDAP_BIND_DN = ""
#AUTH_LDAP_BIND_PASSWORD = ""
#AUTH_LDAP_USER_SEARCH = LDAPSearch("OU=Utenti,DC=comba,DC=comune,DC=bari,DC=it",
#    ldap.SCOPE_SUBTREE, "(sAMAccountName=%(user)s)")

AUTH_LDAP_BIND_AS_AUTHENTICATING_USER = True
# Set up the basic group parameters.
#===================================
AUTH_LDAP_GROUP_SEARCH = LDAPSearch("OU=Urbanistica ed Edilizia Privata,OU=Utenti,DC=comba,DC=comune,DC=bari,DC=it",
    ldap.SCOPE_SUBTREE, "(objectClass=group)"
    #ldap.SCOPE_SUBTREE, "(objectClass=posixGroup)"
)

AUTH_LDAP_GROUP_TYPE = ActiveDirectoryGroupType(name_attr="CN")

# Populate the Django user from the LDAP directory.
#==================================================
AUTH_LDAP_USER_ATTR_MAP = {
    #"username": "sAMAccountName",
    "first_name": "givenName",
    "last_name": "sn"
#    "email": "mail"
}

#AUTH_LDAP_USER_FLAGS_BY_GROUP = {
#    "is_superuser": "CN=SIT-Amministratori,OU=Urbanistica ed Edilizia Privata,OU=Utenti,DC=comba,DC=comune,DC=bari,DC=it"
#}

# This is the default, but I like to be explicit.
AUTH_LDAP_ALWAYS_UPDATE_USER = True

#AUTH_LDAP_MIRROR_GROUPS = False

# Use LDAP group membership to calculate group permissions.
AUTH_LDAP_FIND_GROUP_PERMS = False

# Cache group memberships for an hour to minimize LDAP traffic
AUTH_LDAP_CACHE_GROUPS = False
AUTH_LDAP_GROUP_CACHE_TIMEOUT = 3600


# Keep ModelBackend around for per-user permissions and maybe a local
# superuser.

AUTHENTICATION_BACKENDS = (
    'authldap.backend.BariLDAPBackend',
    'django.contrib.auth.backends.ModelBackend',
    'guardian.backends.ObjectPermissionBackend'
)
