=================
G3W-ADIMN-CDU
=================

G3W-ADMIN-CDU è un modulo per il calcolo e la realizzazione del Certificato di Destinazione Urbanistica


Installation
------------

Add like git submodule from main g3w-admin directory

::

    cd ~
    git https://<user>@bitbucket.org/gis3w/g3w-admin-cdu.git
    mv g3w-admin-cdu <path_of_g3w_suite>/g3w-admin/cdu

Add 'cdu' module to G3W_LOCAL_MORE_APPS config value inside local_settings.py:

::

    G3WADMIN_LOCAL_MORE_APPS = [
        ...
        'cdu'
        ...
    ]

Installa Python modules:

::

    pip install -r cdu/requirements.txt

Apply migrations:

::

    ./manage.py migrate cdu


Sync tree menu by manage.py:

::

    ./manage.py sitetree_resync_apps cdu


Config options

::

    CDU_PLUGIN_CLIENT_TITLE = <custom_title_for_client_plugin_section>
    CDU_PLUGIN_CLIENT_SEARCH_TITLE = <custom_title_for_client_searchs>
    CDU_PLUGIN_POSITION = <custom_position_on_left_section tools default>
    CDU_PLUGIN_TMP_DIR = <tmp file output path| main g3w-admin path default value>

Choice output format and odt driver

::

    CDU_PLUGIN_ODT_DRIVER = <'template'| 'fusion'>, 'template' default
    CDU_PLUGIN_FUSION_URL = <optional>, 'http://localhost:8765/form' default

if you set `CDU_PLUGIN_ODT_DRIVER` to `fusion`, you have to run
`py3o.fusion`, a server that exposes as a web service a way to render an ODT file into different formats:

::

    cd g3w-admin/cdu/py3o
    docker-compose up -d

TimbroDigital WS
----------------

Settings
========

::

    CDU_TD_BASE_URL = <base_url_ws>
    CDU_TD_TOKEN_API_URI = '<token_uri>' # 'authsvr/oauth/token' as default
    CDU_TD_AUDIT_API_URI = '<audit_uri' # 'ressvr/rest/dwhaudit' as default
    CDU_TD_BASIC_AUTH = '<basic_autentication>'



