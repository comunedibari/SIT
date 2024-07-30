==================
G3W-ADIMN-CADASTRE
==================

G3W-ADMIN-CADASTRE è un modulo per il caricamento e la consultazione dei dati catastali forniti dall'agenzia del territorio.

Requirements
------------

* Celery

::

    BROKER_URL = 'amqp://guest@localhost//'
    CELERY_RESULT_BACKEND = 'db+sqlite:///celerydb.sqlite'
    CELERY_RESULT_SERIALIZER = 'json'


Installation
------------

Add like git submodule from main g3w-admin directory

::

     git submodule add -f https://<user>@bitbucket.org/gis3w/g3w-admin-cadastre.git g3w-admin/cadastre


Install pip requirements.txt:

::

    sudo apt-get install libffi-dev
    pip install g3w-admin/cadastre/requirements.txt

Add cadastre module to G3W_LOCAL_MORE_APPS config value inside local_settings.py:

::

    G3WADMIN_LOCAL_MORE_APPS = [
        ...
        'cadastre'
        ...
    ]


Add cadastre database connection:

::

    DATABASES = {
        ...
        'cadastre': {
            #'ENGINE': 'django.db.backends.postgresql',
            'ENGINE': 'django.contrib.gis.db.backends.postgis',
            'NAME': 'g3w_cadastre',
            'USER': 'postgres',
            'PASSWORD': 'postgres',
            'HOST': 'localhost',
            'PORT': '5432',
        },
    }

Set CADASTRE_DATABASE settings value:

::

    CADASTRE_DATABASE = 'cadastre'
    CADASTRE_DOCFA_DAT = 'docfa/protocolli'
    CADASTRE_DOCFA_PLAN = 'docfa/planimetrie'
    CADASTRE_PLAN_START = 'cadastre/planimetrie_iniziali'
    CADASTRE_TMP_DIR = '/tmp' #Attention! not work for mod_wsgi, use another directory, for example data

    CADASTRE_ACCESS_DATA_LOGGING =  True(False, default)

    CADASTRE_SEARCHES = ['CF'] #['CF' (Fiscal code - default, 'NS' - (Name and surname)]

Add cadastre router to DATABASE_ROUTERS:

::

    DATABASE_ROUTERS = [
        'cadastre.db.router.CadastreRouter',
        ...
    ]

Sync tree menu by manage.py:

::

    ./manage.py sitetree_resync_apps cadastre


Apply migrations:

To build cadastre_config on to 'default' database:

::

    ./manage.py migrate cadastre


To build 'cadastre' database:

::

    ./manage.py migrate cadastre --database=cadastre


Install initial cadastre data:

::

    ./manage.py import_cadastre_data

For DOCFA
#########

For massive import of DOCFA ZIP file is possible to use `import_massive_docfa` command.

::

    ./manage.py import_massive_docfa <path_to_directory_with_month_zip_file_docfa>

IMPORTANT
********************

Is important that zip file must have a currect ordinated month filename, in example:

::

    DOCFA_2016_01.zip
    DOCFA_2016_01_INT.zip
    DOCFA_2016_02.zip
    ....

For CXF
#######

For user www.prgcloud.com credentials, set:
::

    CADASTRE_PRGCLOUD_USERNAME='<prgcloud_username>'
    CADASTRE_PRGCLOUD_PASSWORD='<prgcloud_password>'