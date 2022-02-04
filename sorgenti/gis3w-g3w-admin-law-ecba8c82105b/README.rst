=================
G3W-ADMIN-LAW
=================

G3W-ADMIN-LAW is a laws managment module.

Installation
------------

Add like git submodule from main g3w-admin directory

::

     git submodule add -f https://<user>@bitbucket.org/gis3w/g3w-admin-law.git g3w-admin/law


Add 'notes' module to G3WADMIN_LOCAL_MORE_APPS config value inside local_settings.py:

::

    G3WADMIN_LOCAL_MORE_APPS = [
        ...
        'law'
        ...
    ]



Apply migrations:

To build 'ogc' database:

::

    ./manage.py migrate law

Sync tree menu by manage.py:

::

    ./manage.py sitetree_resync_apps law

Is necessary WasyPrint, to install:

::

    sudo apt-get install libffi-dev

after run requiremnts:

::

    pip install -r requirements.txt