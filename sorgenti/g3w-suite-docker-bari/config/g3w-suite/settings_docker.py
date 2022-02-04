# Override settings for G3W-SUITE docker
# Destination: /code/g3w-admin/base/settings/local_settings.py
# Read connection parameters from environment
from django.utils.translation import ugettext_lazy as _
import os

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
    #'authldap',
    'spid_redirect',
    'geolocalexls',
    'frontend'
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

DEBUG = False if os.getenv('G3WSUITE_DEBUG', 0) == 0 else True

DATASOURCE_PATH = '/shared-volume/project_data/'

FRONTEND = True
FRONTEND_APP = 'frontend'

PRIVACY_MSG = _("This website uses cookies to ensure you get the best experience on our website. <a href='https://egov.ba.it/en/privacy;jsessionid=767D300745F9C395E1DA3C44C9F82B6B'>Access</a> to privacy information")


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

from .custom_planetek import *

G3W_CLIENT_HEADER_CUSTOM_LINKS = [
    login_logout_client_spid,
    {
        'url': 'http://opinioni.egov.ba.it/ls/index.php/118945?118945X3X9=ASSIT',
        'title': 'Aiutaci a migliorare: esprimi il tuo giudizio sul servizio',
        'img': G3WSUITE_CUSTOM_STATIC_URL + 'img/faccine.png',
        'target': '_blank'
    },
    {
       'title': 'Credits',
       'content': '<img style="width:100%" src="https://sit.egov.ba.it/static/img/all2.png"/>',
       'type': 'modal',
       'position': 3
   },
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
    'egovbari.middleware.SpidUserLogOutMiddleware'
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

# CDU SETTINGS
# ======================================
CDU_PLUGIN_ODT_DRIVER = 'fusion'
CDU_PLUGIN_FUSION_URL = 'http://py3o:8765/form'
CDU_PLUGIN_CLIENT_TITLE = 'SERVIZI AL CITTADINO'
CDU_PLUGIN_POSITION = 'search'


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

BROKER_URL = 'amqp://guest:guest@rabbitmq:5672//'
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


# # OPENROUTESERVICE SETTINGS
# # ===============================
# # settings for 'openrouteservice' module is in 'G3WADMIN_LOCAL_MORE_APPS'
# # ORS API endpoint
# ORS_API_ENDPOINT = os.getenv('G3WSUITE_ORS_API_ENDPOINT')
# # Optional, can be blank if the key is not required by the endpoint
# ORS_API_KEY = os.getenv('G3WSUITE_ORS_API_KEY', '')
# # List of available ORS profiles
# ORS_PROFILES = {
#     "driving-car": {"name": "Car"},
#     "driving-hgv": {"name": "Heavy Goods Vehicle"}
# }
# # Max number of ranges (it depends on the server configuration)
# ORS_MAX_RANGES = int(os.getenv('ORS_MAX_RANGES', 6))
# # Max number of locations(it depends on the server configuration)
# ORS_MAX_LOCATIONS = int(os.getenv('ORS_MAX_LOCATIONS', 2))
#
# # HUEY Task scheduler
# # Requires redis
# # HUEY configuration
# HUEY = {
#     # Huey implementation to use.
#     'huey_class': 'huey.RedisExpireHuey',
#     'name': 'g3w-suite',
#     'url': 'redis://redis:6379/?db=0',
#     'immediate': False,  # If DEBUG=True, run synchronously.
#     'consumer': {
#         'workers': 1,
#         'worker_type': 'process',
#     },
# }

#from .local_settings_ldap import *

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
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
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
        # 'g3wadmin.cdu': {
        #     'handlers': ['console'],
        #     'level': 'DEBUG',
        # },
    }
}




SESSION_COOKIE_NAME = 'gi3w-suite-andria-yerhdbds7264tyrfkg95726shfkl'
