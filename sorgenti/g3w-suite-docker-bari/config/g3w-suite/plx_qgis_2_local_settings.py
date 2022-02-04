# coding=utf-8
from django.utils.translation import ugettext_lazy as _

G3WADMIN_PROJECT_APPS = []

G3WADMIN_LOCAL_MORE_APPS = [
        'frontend',
        'editing',
        'law',
        'cdu',
        'filemanager',
        'cadastre',
        'caching',
        'egovbari',
        'authldap',
        'spid_redirect'
]

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'g3w_admin',
        'USER': 'postgres',
        'PASSWORD': 'p_plan2018!@78',
        'HOST': 'localhost',
        'PORT': '5432',
    },
    'cadastre': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'censuario',
        'USER': 'postgres',
        'PASSWORD': 'FbjYg27S@',
        'HOST': 'dbserver-sit',
        'PORT': '5432',
    },
}

DATABASE_ROUTERS = [
    'cadastre.db.router.CadastreRouter'
]

CADASTRE_DATABASE = 'cadastre'
CADASTRE_DOCFA_DAT = 'docfa/protocolli'
CADASTRE_DOCFA_PLAN = 'docfa/planimetrie'
CADASTRE_PLAN_START = 'cadastre/planimetrie_iniziali'
CADASTRE_TMP_DIR = '/home/g3w-suite/tmp'
CADASTRE_DATA_SRID = 32633

TILESTACHE_CACHE_NAME = 'default'
TILESTACHE_CACHE_TYPE = 'Disk'
TILESTACHE_CACHE_DISK_PATH = '/home/g3w-suite/cache/'


FILEMANAGER_ROOT_PATH = '/home/g3w-suite/data/'

DATASOURCE_PATH = '/home/g3w-suite/data/dati_geografici/'

MEDIA_ROOT = '/home/g3w-suite/www/media/'
MEDIA_URL = '/media/'
STATIC_ROOT = '/home/g3w-suite/www/static/'
STATIC_URL = '/static/'


BROKER_URL = 'amqp://guest@localhost//'
CELERY_RESULT_BACKEND = 'db+sqlite:///celerydb.sqlite'
CELERY_RESULT_SERIALIZER = 'json'


DEBUG = False

FRONTEND = True
FRONTEND_APP = 'frontend'

# custom static settings ##
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

G3WADMIN_MIDDLEWARE = [
    'egovbari.middleware.SpidUserLogOutMiddleware'
]

from custom_planetek import *

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


CDU_PLUGIN_CLIENT_TITLE = 'SERVIZI AL CITTADINO'
CDU_PLUGIN_POSITION = 'search'
CDU_PLUGIN_ODT_DRIVER = 'fusion'

G3W_CLIENT_SEARCH_TITLE = 'SERVIZI AL CITTADINO'

FRONTEND_IMAGES_DIR = '{}custom_static/frontend_images'.format(FILEMANAGER_ROOT_PATH)
FRONTEND_IMAGES_URL = '{}frontend_images/'.format(G3WSUITE_CUSTOM_STATIC_URL)


CACHES = {
        'default': {
                'BACKEND': 'django.core.cache.backends.memcached.PyLibMCCache',
                'LOCATION': '127.0.0.1:11211'
                }
    }

# Nginx fcgiwrap
#QDJANGO_SERVER_URL = 'http://localhost/cgi-bin/qgis_mapserv.fcgi'
#QDJANGO_REGEX_GETCAPABILITIES = r'http:///cgi-bin/qgis_mapserv.fcgi\?map=[^\'" > &]+(?=&)'

# Apache2
QDJANGO_SERVER_URL = 'http://localhost:81/qgis'
QDJANGO_REGEX_GETCAPABILITIES = r'http://localhost:81/qgis\?map=[^\'" > &]+(?=&)'

from local_settings_ldap import *

ALLOWED_HOSTS = "*"

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
            'class': 'logging.handlers.RotatingFileHandler',
            'maxBytes': 1024*1024*10,
            'backupCount': 10,
            'filename': '/home/g3w-suite/logs/error.log',
            'formatter': 'verbose'
        },
        'file_cadastre': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': '/home/g3w-suite/logs/cadastre_debug.log',
            'formatter': 'verbose'
        },
        'file_debug': {
            'level': 'DEBUG',
            'filters': ['require_debug_true'],
            'class': 'logging.FileHandler',
            'filename': '/home/g3w-suite/logs/debug.log',
            'formatter': 'verbose'
        },
        'file_ldap_debug': {
            'level': 'DEBUG',
            #'filters': ['require_debug_true'],
            'class': 'logging.handlers.RotatingFileHandler',
            'maxBytes': 1024*1024*10, # 5 MB
            'backupCount': 10,
            'filename': '/home/g3w-suite/logs/auth_ldap.log',
            'formatter': 'verbose'
        },
    },
    'loggers': {
        'django.request': {
            'handlers': ['file', 'mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
        'cadastre.debug': {
            'handlers': ['file_cadastre'],
            'level': 'DEBUG'
        },
        'g3wadmin.debug': {
            'handlers': ['file_debug'],
            'level': 'DEBUG',
        },
        'django_auth_ldap': {
            'level': 'DEBUG',
            'handlers': ['file_ldap_debug'],
        },
    }
}

CLIENT_OWS_METHOD = 'POST'
G3WSUITE_SPID_USER = 'spid'
#SPID_LINK = 'https://sit.egov.ba.it'
SPID_LINK = '/idp-login'

SESSION_COOKIE_NAME = 'p_plan2018_com_abr788huj890'

#PRIVACY_MSG = "Questo sito utilizza i coockie per garantire una buona usabilità all'utilizzatore finale. <a href='https://egov.ba.it/en/privacy;jsessionid=767D300745F9C395E1DA3C44C9F82B6B'>Accedi</a> all’informativa completa sulla privacy<br> <br>This website uses cookies to ensure you get the best experience on our website. <a href='https://egov.ba.it/en/privacy;jsessionid=767D300745F9C395E1DA3C44C9F82B6B'>Access</a> to privacy information"
PRIVACY_MSG = _("This website uses cookies to ensure you get the best experience on our website. <a href='https://egov.ba.it/en/privacy;jsessionid=767D300745F9C395E1DA3C44C9F82B6B'>Access</a> to privacy information")
