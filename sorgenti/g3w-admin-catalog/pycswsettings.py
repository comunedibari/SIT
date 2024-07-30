# coding=utf-8
""""Settings for pycsw.

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

"""

__author__ = 'elpaso@itopen.it'
__date__ = '2019-01-14'
__copyright__ = 'Copyright 2019, ItOpen'


from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site

# Note: this is the complete list of settings:
# !!!! DO NOT REMOVE ANY OF THESE !!!!
# Django settings and catalog specific functions will override
# the following defaults.
_DEFAULT_PYCSW_SETTINGS = {
    "server": {
        "home": settings.BASE_DIR,
        "url": "",
        "mimetype": "application/xml; charset=UTF-8",
        "encoding": "UTF-8",
        "language": "en-US",
        "maxrecords": "50",
        "loglevel": "DEBUG",  # set this through django logging config
        "logfile": "",
        "ogc_schemas_base": "",
        "federatedcatalogues": "",
        "pretty_print": "true" if settings.DEBUG else "false",
        "gzip_compresslevel": "",
        "domainquerytype": "",
        "domaincounts": "true",
        "spatial_ranking": "",
        "profiles": "apiso,ebrim,rndt",
    },
    "manager": {
        "transactions": "",
        "allowed_ips": "",
        "csw_harvest_pagesize": "",
    },
    "metadata:main": {
        "identification_title": "",
        "identification_abstract": "",
        "identification_keywords": "",
        "identification_keywords_type": "",
        "identification_fees": "",
        "identification_accessconstraints": "",
        "provider_name": "",
        "provider_url": "",
        "contact_name": "",
        "contact_position": "",
        "contact_address": "",
        "contact_city": "",
        "contact_stateorprovince": "",
        "contact_postalcode": "",
        "contact_country": "",
        "contact_phone": "",
        "contact_fax": "",
        "contact_email": "",
        "contact_url": "",
        "contact_hours": "",
        "contact_instructions": "",
        "contact_role": "pointOfContact",
    },
    "repository": {
        "mappings": "catalog.mappings",
        "database": "",
        "table": "catalog_record",
        # Dynamic filter,set by the catalog
        "filter": "",
    },
    "metadata:inspire": {
        "enabled": "true",
        "languages_supported": "",
        "default_language": "",
        "date": "",
        "gemet_keywords": "",
        "conformity_service": "",
        "contact_name": "",
        "contact_email": "",
        "temp_extent": "",
    },
}


def get_default_pycsw_settings(request):
    """Returns PyCSW default settings

    Set server url according to request

    :param request: request
    :type request: Django request instance
    :return: the default (catalog independent) settings
    :rtype: dict
    """

    pycsw_settings = {}
    for section in _DEFAULT_PYCSW_SETTINGS.keys():
        pycsw_settings[section] = {}
        for key, default_value in _DEFAULT_PYCSW_SETTINGS[section].items():
            try:
                configured_value = settings.PYCSW_SETTINGS[section][key]
            except KeyError:
                configured_value = default_value
            pycsw_settings[section][key] = configured_value

    if hasattr(settings, 'CATALOG_HOST'):
        port = str(getattr(settings, 'CATALOG_PORT', '80'))
        pycsw_settings['server']['url'] = getattr(settings, 'CATALOG_URL_SCHEME', 'http') + '://' + \
                     getattr(settings, 'CATALOG_HOST', 'localhost') + \
                     ('' if port == '80' else ':' + port)

    else:
        pycsw_settings['server']['url'] = "{}://{}".format('https' if request.is_secure() else 'http', get_current_site(request))

    return pycsw_settings
