==================
G3W-ADMIN-AUTHLDAP
==================

G3W-ADMIN-AUTHLDAP module to allow authentication by ldap server


Requirements
------------

* django-auth-ldap

Installation
------------

Add like git submodule from main g3w-admin directory

::

     git submodule add -f https://<user>@bitbucket.org/gis3w/g3w-admin-authldap.git g3w-admin/authldap


Install pip requirements.txt:

::

    pip install g3w-admin/caching/requirements.txt

Add authldap module to G3W_LOCAL_MORE_APPS config value inside local_settings.py:

::

    G3WADMIN_LOCAL_MORE_APPS = [
        ...
        'authldap'
        ...
    ]




Add authldap configuration

::

    import ldap
    from django_auth_ldap.config import LDAPSearch, GroupOfNamesType
    from django_auth_ldap.config import LDAPGroupQuery
    import logging

    logger = logging.getLogger('django_auth_ldap')
    logger.addHandler(logging.StreamHandler())
    logger.setLevel(logging.DEBUG)


    # Baseline configuration.
    AUTH_LDAP_SERVER_URI = "ldap://localhost:389"

    AUTH_LDAP_BIND_DN = "cn=admin,dc=ldap,dc=g3wsuite,dc=it"
    AUTH_LDAP_BIND_PASSWORD = "admin01"
    AUTH_LDAP_USER_SEARCH = LDAPSearch("ou=users,dc=ldap,dc=g3wsuite,dc=it",
        ldap.SCOPE_SUBTREE, "(uid=%(user)s)")

    # Set up the basic group parameters.
    AUTH_LDAP_GROUP_SEARCH = LDAPSearch("ou=groups,dc=ldap,dc=g3wsuite,dc=it",
        ldap.SCOPE_SUBTREE, "(objectClass=groupOfNames)"
    )
    AUTH_LDAP_GROUP_TYPE = GroupOfNamesType(name_attr="cn")

    # Populate the Django user from the LDAP directory.
    AUTH_LDAP_USER_ATTR_MAP = {
        "first_name": "givenName",
        "last_name": "sn",
        "email": "mail"
    }


    AUTH_LDAP_REQUIRE_GROUP = LDAPGroupQuery("cn=Editor Level 1,ou=groups,dc=ldap,dc=g3wsuite,dc=it") | \
                              LDAPGroupQuery("cn=Editor Level 2,ou=groups,dc=ldap,dc=g3wsuite,dc=it") | \
                              LDAPGroupQuery("cn=Viewer Level 2,ou=groups,dc=ldap,dc=g3wsuite,dc=it") | \
                              LDAPGroupQuery("cn=Viewer Level 1,ou=groups,dc=ldap,dc=g3wsuite,dc=it") | \
                              LDAPGroupQuery("cn=superuser,ou=groups,dc=ldap,dc=g3wsuite,dc=it")

    AUTH_LDAP_USER_FLAGS_BY_GROUP = {
        "is_superuser": "cn=superuser,ou=groups,dc=ldap,dc=g3wsuite,dc=it"
    }

    # This is the default, but I like to be explicit.
    AUTH_LDAP_ALWAYS_UPDATE_USER = True

    AUTH_LDAP_MIRROR_GROUPS = True
    AUTH_LDAP_MIRROR_GROUPS_EXCEPT =('superuser',)

    # Use LDAP group membership to calculate group permissions.
    AUTH_LDAP_FIND_GROUP_PERMS = False

    # Cache group memberships for an hour to minimize LDAP traffic
    AUTH_LDAP_CACHE_GROUPS = False
    AUTH_LDAP_GROUP_CACHE_TIMEOUT = 3600


    # Keep ModelBackend around for per-user permissions and maybe a local
    # superuser.
    AUTHENTICATION_BACKENDS = (
        'django_auth_ldap.backend.LDAPBackend',
        'django.contrib.auth.backends.ModelBackend',
        'guardian.backends.ObjectPermissionBackend'
    )