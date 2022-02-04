=================
G3W-ADMIN-EGOVBARI
=================

G3W-ADMIN-EGOVBARI MODULO CUSTOM PER EGOV BARI

Installation
------------

Add like git submodule from main g3w-admin directory

::

     git submodule add -f https://<user>@bitbucket.org/gis3w/g3w-admin-egovbari.git g3w-admin/egovbari


Add 'editing' module to G3WADMIN_LOCAL_MORE_APPS config value inside local_settings.py:

::

    G3WADMIN_LOCAL_MORE_APPS = [
        ...
        'egovbari'
        ...
    ]


Sync tree menu by manage.py:

::

    ./manage.py sitetree_resync_apps egovbari

