# Override settings for G3W-SUITE docker
# Destination: /code/g3w-admin/base/settings/local_settings.py
# Read connection parameters from environment
from django.utils.translation import ugettext_lazy as _
import os
import urllib3

G3WADMIN_PROJECT_APPS = []

G3WADMIN_LOCAL_MORE_APPS = [
    'caching',
    'editing',
    'filemanager',
    'qplotly',
    'cadastre',
    'law',
    'cdu',
    'catalog',
    'egovbari',
    'authldap',
    #'spid_redirect',
    'geolocalexls',
    'frontend',
    'mozilla_django_oidc',  # Must be loaded after auth
    'iam_bari',
    'portal',
    'authjwt',
    'qtimeseries',
    'simplereporting',
    #'openrouteservice'
    'eleprofile',
    'qprocessing'
]

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': os.getenv('G3WSUITE_POSTGRES_DBNAME'),
        'USER': os.getenv('G3WSUITE_POSTGRES_USER_LOCAL') if os.getenv('G3WSUITE_POSTGRES_USER_LOCAL') else "%s@%s" % (
            os.getenv('G3WSUITE_POSTGRES_USER'), os.getenv('G3WSUITE_POSTGRES_HOST')),
        'PASSWORD': os.getenv('G3WSUITE_POSTGRES_PASS'),
        'HOST': os.getenv('G3WSUITE_POSTGRES_HOST'),
        'PORT': os.getenv('G3WSUITE_POSTGRES_PORT'),
    },
    'cadastre': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': os.getenv('CADASTRE_POSTGRES_DBNAME'),
        'USER': os.getenv('CADASTRE_POSTGRES_USER_LOCAL'),
        'PASSWORD': os.getenv('CADASTRE_POSTGRES_PASS'),
        'HOST': os.getenv('CADASTRE_POSTGRES_HOST'),
        'PORT': os.getenv('CADASTRE_POSTGRES_PORT'),
    },
}

MEDIA_ROOT = '/shared-volume/media/'
MEDIA_URL = '/media/'
STATIC_ROOT = '/shared-volume/static/'
STATIC_URL = '/static/'

DEBUG = False if int(os.getenv('G3WSUITE_DEBUG', 0)) == 0 else True

DATASOURCE_PATH = '/shared-volume/project_data/'

FRONTEND = True
FRONTEND_APP = 'frontend'

PRIVACY_MSG = _("This website uses cookies to ensure you get the best experience on our website. <a href='https://egov.ba.it/en/privacy;jsessionid=767D300745F9C395E1DA3C44C9F82B6B'>Access</a> to privacy information")

# CACHING
# =======================================
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://redis:6379/0",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    }
}

# CUSTOM CLIENT SETTINGS
# ========================================
G3WSUITE_POWERD_BY = False

G3WSUITE_CUSTOM_STATIC_URL = '/custom_static/'
G3WSUITE_MAIN_LOGO = G3WSUITE_CUSTOM_STATIC_URL +'img/logo.png'
G3WSUITE_RID_LOGO = G3WSUITE_CUSTOM_STATIC_URL + 'img/logo_small.png'
G3WSUITE_LOGIN_LOGO = G3WSUITE_CUSTOM_STATIC_URL +'img/logo.png'
G3WSUITE_FAVICON = G3WSUITE_CUSTOM_STATIC_URL + 'img/favicon.ico'
G3WSUITE_CUSTOM_TITLE = 'SIT - AVMTB'
G3WSUITE_CUSTOM_CSS = [
    G3WSUITE_CUSTOM_STATIC_URL +'css/custom.css'
]

G3W_CLIENT_HEADER_CUSTOM_LINKS = [
    #login_logout_client_spid,
    {
        'url': 'http://opinioni.egov.ba.it/ls/index.php/118945?118945X3X9=ASSIT',
        'title': 'Aiutaci a migliorare: esprimi il tuo giudizio sul servizio',
        'img': G3WSUITE_CUSTOM_STATIC_URL + 'img/faccine.png',
        'target': '_blank'
    },
   #  {
   #     'title': 'Credits',
   #     'content': '<img style="width:100%" src="https://sit.egov.ba.it/static/img/all2.png"/>',
   #     'type': 'modal',
   #     'position': 3
   # },
]

G3W_CLIENT_LEGEND = {
        'color': 'black',
        'fontsize': 12,
        'transparent': False,
        'boxspace': 4,
        'layerspace': 4,
        'layertitle': True,
        'layertitlespace': 4,
        'symbolspace': None,
        'iconlabelspace': 2,
        'symbolwidth': 8,
        'symbolheight': 4
}

G3W_CLIENT_RIGHT_PANEL = {
        'width': 33
}

G3W_CLIENT_SEARCH_TITLE = 'SERVIZI AL CITTADINO'

CLIENT_OWS_METHOD = 'POST'

# VARIUS SETTINGS
# ======================================
G3WADMIN_VECTOR_LAYER_DOWNLOAD_FORMATS = ['xls', 'shp', 'gpx', 'csv']

# EGOVBARI SETTINGS
# =======================================
G3WADMIN_MIDDLEWARE = [
    'egovbari.middleware.SpidUserLogOutMiddleware',

]

# SPID_REDIRECT SETTINGS
# =======================================
G3WSUITE_SPID_USER = 'spid'
SPID_LINK = '/idp-login'

# CACHING SETTINGS
# =======================================
TILESTACHE_CACHE_NAME = 'default'
TILESTACHE_CACHE_TYPE = 'Disk'  # or 'Memcache'
TILESTACHE_CACHE_DISK_PATH = os.getenv('G3WSUITE_TILECACHE_PATH')
TILESTACHE_CACHE_BUFFER_SIZE = os.getenv('TILESTACHE_CACHE_BUFFER_SIZE')
TILESTACHE_CACHE_TOKEN = os.getenv('TILESTACHE_CACHE_TOKEN')

# FILEMANAGER SETTINGS
# =======================================
FILEMANAGER_ROOT_PATH = os.getenv(
    'G3WSUITE_FILEMANAGER_ROOT_PATH', '/shared-volume/project_data')
FILENAMANAGER_MAX_N_FILES = os.getenv('G3WSUITE_FILENAMANAGER_MAX_N_FILES', 10)

# EDITING SETTINGS
# ======================================
USER_MEDIA_ROOT = FILEMANAGER_ROOT_PATH + '/' + \
    os.getenv('G3WSUITE_USER_MEDIA_ROOT', 'user_media') + '/'

EDITING_ANONYMOUS = True

# CDU SETTINGS
# ======================================
CDU_PLUGIN_ODT_DRIVER = 'fusion'
CDU_PLUGIN_FUSION_URL = 'http://py3o:8765/form'
CDU_PLUGIN_CLIENT_TITLE = 'SERVIZI AL CITTADINO'
CDU_PLUGIN_POSITION = 'search'

# TimbroDigitale WS
CDU_TD_BASE_URL = 'http://10.10.1.12:8080/'
CDU_TD_TOKEN_API_URI = 'authsvr/oauth/token'
CDU_TD_AUDIT_API_URI = 'ressvr/rest/dwhaudit'
CDU_TD_BASIC_AUTH = 'Basic ' + os.getenv('CDU_TD_BASIC_AUTH')


# CADASTRE CONF
#===============================

CADASTRE_DATABASE = 'cadastre'
CADASTRE_DOCFA_DAT = 'docfa/protocolli'
CADASTRE_DOCFA_PLAN = 'docfa/planimetrie'
CADASTRE_PLAN_START = 'docfa/planimetrie_iniziali'
CADASTRE_TMP_DIR = '/shared-volume/tmp'
CADASTRE_DATA_SRID = 3003
CADASTRE_SEARCHES = ['CF', 'NS']

CADASTRE_ACCESS_DATA_LOGGING = True

DATABASE_ROUTERS = [
    'cadastre.db.router.CadastreRouter'
]

# CATALOG CONF
# ===============================
USE_TZ = False

CATALOG_HOST = 'http://10.0.11.9'
CATALOG_PORT = 80

PYCSW_SETTINGS = {
    "server": {
        "home": "/",
        "loglevel": "DEBUG",
        "logfile": "/shared-volume/logs/pycws.log",
    },
    "manager": {
        "transactions": "false",
        "allowed_ips": "*",
    },
    "repository": {
        "database": "postgresql://{USER}:{PASSWORD}@{HOST}/{NAME}".format(**DATABASES['default']),
    },
    "metadata:inspire": {
        "enabled": "true",
    },
}

CATALOG_URL_SCHEME = 'http'
CATALOG_HOST = '10.0.11.9' #todo: to update after protuction

# CELERY CONF
#================================

BROKER_URL = 'redis://redis:6379/1'
CELERY_RESULT_SERIALIZER = 'json'
#CELERY_RESULT_BACKEND = 'db+postgresql://{0}:{1}@{2}/{3}'.format(
#    DATABASES['default']['USER'],
#    DATABASES['default']['PASSWORD'],
#    DATABASES['default']['HOST'],
#    DATABASES['default']['NAME'],
#)
CELERY_RESULT_BACKEND = 'db+sqlite:////shared-volume/celerydb.sqlite'

# PORTAL SETTINGS
# ===============================
#Enable/disable menu sections
PORTAL_SECTIONS = [
    'maps',
    'info',
    # 'news',
    # 'archives'
]

# Optional
# Activete Link to Admin
PORTAL_ADMIN_BTN = True #(False, default)


# OPENROUTESERVICE SETTINGS
# ===============================
# settings for 'openrouteservice' module is in 'G3WADMIN_LOCAL_MORE_APPS'
# ORS API endpoint
ORS_API_ENDPOINT = os.getenv('ORS_API_ENDPOINT')
# Optional, can be blank if the key is not required by the endpoint
ORS_API_KEY = os.getenv('ORS_API_KEY', '')
# List of available ORS profiles
ORS_PROFILES = {
    "driving-car": {"name": "Car"},
    "driving-hgv": {"name": "Heavy Goods Vehicle"}
}
# Max number of ranges (it depends on the server configuration)
ORS_MAX_RANGES = int(os.getenv('ORS_MAX_RANGES', 6))
# Max number of locations(it depends on the server configuration)
ORS_MAX_LOCATIONS = int(os.getenv('ORS_MAX_LOCATIONS', 2))

# HUEY Task scheduler
# Requires redis
# HUEY configuration
HUEY = {
    # Huey implementation to use.
    'huey_class': 'huey.RedisExpireHuey',
    'name': 'g3w-suite',
    'url': 'redis://redis:6379/?db=2',
    'immediate': False,  # If DEBUG=True, run synchronously.
    'consumer': {
        'workers': 1,
        'worker_type': 'process',
    },
}

if "authldap" in G3WADMIN_LOCAL_MORE_APPS:
    from .local_settings_ldap import *

# IAM_BARI
# ===============================================
# IAM Bari
OIDC_RP_CLIENT_ID = os.environ.get("OIDC_RP_CLIENT_ID")
OIDC_RP_CLIENT_SECRET = os.environ.get("OIDC_RP_CLIENT_SECRET")
OIDC_OP_AUTHORIZATION_ENDPOINT = "https://accedi.comune.bari.it/sso/oauth2/authorize"
OIDC_OP_TOKEN_ENDPOINT = "https://accedi.comune.bari.it/sso/oauth2/access_token"
OIDC_OP_USER_ENDPOINT = "https://accedi.comune.bari.it/sso/oauth2/userinfo"
OIDC_OP_JWKS_ENDPOINT = "https://accedi.comune.bari.it/sso/oauth2/connect/jwk_uri"
OIDC_RP_SIGN_ALGO = "RS256"
OIDC_CALLBACK_CLASS = "iam_bari.overrides.oidc_callback.G3WOIDCCallbackClass"



# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# The following insecure options have been used for development
# DO NOT USE IN PRODUCTION
# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

# urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
#
# OIDC_VERIFY_SSL = False
# OIDC_VERIFY_JWT = False
# OIDC_VERIFY_KID = False
# OIDC_ALLOW_UNSECURED_JWT = True


ALLOWED_HOSTS = "*"

# Is required by caching module
QDJANGO_SERVER_URL = 'http://localhost:8000'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        },
        'require_debug_true': {
            '()': 'django.utils.log.RequireDebugTrue'
        }
    },
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s'
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler',
            'formatter': 'verbose'
        },
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/tmp/error.log',
            'formatter': 'verbose'
        },
        'file_debug': {
            'level': 'DEBUG',
            'filters': ['require_debug_true'],
            'class': 'logging.FileHandler',
            'filename': '/tmp/debug.log',
            'formatter': 'verbose'
        },
        'file_debug_cdu': {
            'level': 'DEBUG',
            'class': 'logging.handlers.RotatingFileHandler',
            'maxBytes': 1024*1024*10, #10 MB
            'backupCount': 5,
            'encoding': 'utf-8',
            'filename': '/shared-volume/logs/cdu.log',
            'formatter': 'verbose'
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
        },
        'file_ldap_debug': {
            'level': 'DEBUG',
            'class': 'logging.handlers.RotatingFileHandler',
            'maxBytes': 1024*1024*10, # 5 MB
            'backupCount': 10,
            'filename': '/shared-volume/logs/auth_ldap.log',
            'formatter': 'verbose'
        },

    },
    'loggers': {
        'django.request': {
            'handlers': ['console', 'mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
        'g3wadmin.debug': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
        'pycsw.server': {
            'handlers': ['console'],
            'level': 'ERROR',
        },
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'ERROR',
        },
        'catalog': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
        'celery.task': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
        'openrouteservice': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
        'geolocalexls': {
            'handlers': ['console'],
            'level': 'ERROR',
        },
        'g3wadmin.cdu': {
            'handlers': ['console', 'file_debug_cdu'],
            'level': 'DEBUG',
        },
        'django_auth_ldap': {
            'level': 'DEBUG',
            'handlers': ['file_ldap_debug'],
        },
        'openrouteservice': {
            'level': 'DEBUG',
            'handlers': ['console'],
        },
        #'': {
        #    'level': 'DEBUG',
        #    'handlers': ['console'],
        #},


    }
}


VENDOR_KEYS = {
     'google': 'AIzaSyDVp1qEC6SH2on0gfBO-9_6ylgwrUoPQOE',
}


SESSION_COOKIE_NAME = 'gi3w-suite-bari-yerhdbds7264tyrfkg95726shfkl'
#SESSION_COOKIE_NAME = '__Host-yerhdbds7264tyrfkg95726shfkl'
#CSRF_COOKIE_NAME = '__Host-csrftoken'

ALTAMURA_MAGROGROUP_NAME = 'Altamura'

CORS_ALLOWED_ORIGINS = [
    "http://sit.comune.altamura.ba.it",
    "https://sit.comune.altamura.ba.it",
    "http://localhost:8006"
]


CORS_ALLOW_ALL_ORIGINS = True

## Additional CORS settings (cookie only = reccomendend when using a sub-domain for authentication)
# ------------------------------------------------------

CORS_ALLOW_CREDENTIALS  = True                   # enable CORS Authentication
# CORS_ORIGIN_WHITELIST   = CORS_ALLOWED_ORIGINS
CSRF_TRUSTED_ORIGINS    = CORS_ALLOWED_ORIGINS            # CHANGE ME: '.yourdomain.com' in PRODUCTION!
CSRF_COOKIE_SAMESITE    = 'strict'                   # TODO: uninstall "django-samesite-none" in Django >= v3.1
CSRF_COOKIE_SECURE      = False                  # CHANGE ME: True in PRODUCTION!
# SESSION_COOKIE_DOMAIN   = CSRF_COOKIE_DOMAIN
#SESSION_COOKIE_SAMESITE = CSRF_COOKIE_SAMESITE
#SESSION_COOKIE_SECURE   = CSRF_COOKIE_SECURE

REST_FRAMEWORK = {
    'EXCEPTION_HANDLER': 'core.api.base.views.G3WExceptionHandler',
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 100,
    'UNICODE_JSON': False,
    #'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_AUTHENTICATION_CLASSES': [
            'rest_framework.authentication.SessionAuthentication',
            'rest_framework.authentication.BasicAuthentication',
            #'rest_framework_simplejwt.authentication.JWTAuthentication'
    ]
}

# QPROCESSING SETTINGS
# --------------------
QPROCESSING_ASYNC_RUN = True

# SESSISON BY REDIS
# -------------------------------------------
SESSION_ENGINE = 'redis_sessions.session'
SESSION_REDIS = {
    'host': 'redis',
    'port': 6379,
    'db': 3,
    'prefix': 'session',
    'socket_timeout': 1,
    'retry_on_timeout': False
    }


