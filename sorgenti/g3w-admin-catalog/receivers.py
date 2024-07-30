# coding=utf-8
""""Receivers for Catalog

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

"""

__author__ = 'elpaso@itopen.it'
__date__ = '2019-01-15'
__copyright__ = 'Copyright 2019, Gis3W'


import logging

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from qdjango.utils.models import temp_disconnect_signal

from .models import Catalog
from .signals import invalidate_all_catalogs_signal

logger = logging.getLogger('catalog')


@receiver(invalidate_all_catalogs_signal)
def invalidate_all_catalogs_receiver(**kwargs):
    """Listener to invalidate all catalogs"""

    _kwargs = {
        'signal': post_save,
        'receiver': invalidate_all_catalogs_receiver,
        'dispatch_uid': None,
        'sender': kwargs['sender']
    }

    __kwargs = {
        'signal': post_delete,
        'receiver': invalidate_all_catalogs_receiver,
        'dispatch_uid': None,
        'sender': kwargs['sender']
    }

    with temp_disconnect_signal(**_kwargs):
        with temp_disconnect_signal(**__kwargs):
            for c in Catalog.objects.all():
                c.is_valid = False
                c.save()
                assert c.is_valid == False
                logger.debug("Catalog %s invalidated in invalidate all catalogs" % c)


@receiver(post_save, sender=Catalog)
def invalidate_catalog_receiver(**kwargs):
    """Listener to invalidate a single catalog"""

    _kwargs = {
        'signal': post_save,
        'receiver': invalidate_catalog_receiver,
        'sender': Catalog,
        'dispatch_uid': None
    }

    with temp_disconnect_signal(**_kwargs):
        if not kwargs['created']:
            c = kwargs['instance']
            c.is_valid = False
            c.save()
            assert c.is_valid == False
            logger.debug("Catalog %s invalidated in invalidate single catalog" % c)
