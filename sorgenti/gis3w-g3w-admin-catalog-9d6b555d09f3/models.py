# coding=utf-8
""""Models for PyCSW and catalog endpoint entries

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

"""
from __future__ import unicode_literals

import logging
import re
from functools import partial

from autoslug import AutoSlugField
from core.models import Group, MacroGroup
from django.conf import settings
from django.core.cache import caches
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ImproperlyConfigured, ValidationError
from django.db import models
from django.db.models.signals import post_delete, post_save
from django.urls import reverse
from django.utils.translation import ugettext_lazy as _
from model_utils import Choices
from multiselectfield import MultiSelectField
from qdjango.utils.models import temp_disconnect_signal

from .signals import invalidate_all_catalogs_signal

__author__ = 'elpaso@itopen.it'
__date__ = '2019-01-11'
__copyright__ = 'Copyright 2019, ItOpen'


logger = logging.getLogger('catalog')

class ActiveCatalogManager(models.Manager):

    def get_queryset(self):
        return super(ActiveCatalogManager, self).get_queryset().filter(is_active=True)


class Catalog(models.Model):
    """CSW catalog endpoint with a scope and metadata.

    It can be a global endpoint, a group endpoint or a macrogroup endpoint.

    """

    SCOPE = Choices(
        ('GLOBAL', _('Global (serves all projects)')),
        ('GROUP', _('Group (serves a single group)')),
        ('MACROGROUP', _('Macrogroup (serves a macrogroup)')),
    )

    INSPIRE_CONFORMITY_SERVICE = Choices(
        ('conformant', _('conformant')),
        ('notConformant', _('notConformant')),
        ('notEvaluated', _('notEvaluated')),
    )

    INSPIRE_GEMET_THEMES = Choices(
        ("Addresses", _("Addresses")),
        ("Administrative units", _("Administrative units")),
        ("Agricultural and aquaculture facilities", _(
            "Agricultural and aquaculture facilities")),
        ("Area management/restriction/regulation zones and reporting units",
         _("Area management/restriction/regulation zones and reporting units")),
        ("Atmospheric conditions", _("Atmospheric conditions")),
        ("Bio-geographical regions", _("Bio-geographical regions")),
        ("Buildings", _("Buildings")),
        ("Cadastral parcels", _("Cadastral parcels")),
        ("Coordinate reference systems", _("Coordinate reference systems")),
        ("Elevation", _("Elevation")),
        ("Energy resources", _("Energy resources")),
        ("Environmental monitoring facilities", _(
            "Environmental monitoring facilities")),
        ("Geographical grid systems", _("Geographical grid systems")),
        ("Geographical names", _("Geographical names")),
        ("Geology", _("Geology")),
        ("Habitats and biotopes", _("Habitats and biotopes")),
        ("Human health and safety", _("Human health and safety")),
        ("Hydrography", _("Hydrography")),
        ("Land cover", _("Land cover")),
        ("Land use", _("Land use")),
        ("Meteorological geographical features", _(
            "Meteorological geographical features")),
        ("Mineral resources", _("Mineral resources")),
        ("Natural risk zones", _("Natural risk zones")),
        ("Oceanographic geographical features", _(
            "Oceanographic geographical features")),
        ("Orthoimagery", _("Orthoimagery")),
        ("Population distribution — demography", _(
            "Population distribution — demography")),
        ("Production and industrial facilities", _(
            "Production and industrial facilities")),
        ("Protected sites", _("Protected sites")),
        ("Sea regions", _("Sea regions")),
        ("Soil", _("Soil")),
        ("Species distribution", _("Species distribution")),
        ("Statistical units", _("Statistical units")),
        ("Transport networks", _("Transport networks")),
        ("Utility and governmental services", _(
            "Utility and governmental services")),
    )

    LANGUAGE_CHOICES = (
        ('bul', 'bul'),
        ('cze', 'cze'),
        ('dan', 'dan'),
        ('dut', 'dut'),
        ('eng', 'eng'),
        ('est', 'est'),
        ('fin', 'fin'),
        ('fre', 'fre'),
        ('ger', 'ger'),
        ('gre', 'gre'),
        ('hun', 'hun'),
        ('gle', 'gle'),
        ('ita', 'ita'),
        ('lav', 'lav'),
        ('lit', 'lit'),
        ('mlt', 'mlt'),
        ('pol', 'pol'),
        ('por', 'por'),
        ('rum', 'rum'),
        ('slo', 'slo'),
        ('slv', 'slv'),
        ('spa', 'spa'),
        ('swe', 'swe'),
    )

    __CATALOG_PROVIDER_REGISTRY = {}

    class _CatalogProviderEntry():

        def __init__(self, scope, record_factory, senders=[]):
            self.scope = scope
            self.record_factory = record_factory
            self.senders = senders

    # Main identifier
    name = models.CharField(_('Catalog name'), max_length=255,
                            help_text=_('Name into CSW service URL'))
    slug = AutoSlugField(
        _('Slug'), populate_from='name', unique=True, always_update=True
    )
    is_active = models.BooleanField(_('Is active'), default=True)
    is_valid = models.BooleanField(_('Is valid'), default=False, help_text=_(
        'This field is managed by signals, an invalid catalog will be regenerated by a management command called by CRON'))
    order = models.IntegerField(_('Order'), default=1)

    scope = models.CharField(
        _('Catalog application level'),
        default=SCOPE.GLOBAL,
        choices=SCOPE,
        max_length=50,
        help_text=_('Catalog application scope-level')
    )
    group = models.ForeignKey(
        Group,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        help_text=_('Group (serves a single group). This field is ignored unless catalog application level is "Group"'))

    macrogroup = models.ForeignKey(
        MacroGroup,
        blank=True, null=True,
        on_delete=models.CASCADE,
        help_text=_('Macrogroup (serves a macrogroup). This field is ignored unless scope is "MacroGroup"'))

    # General Metadata
    # TODO: check which are mandatory
    identification_title = models.CharField(
        _('Identification title'), max_length=255, blank=True, null=True, help_text=_('Required by Inspire and RNDT'))
    identification_abstract = models.CharField(
        _('Identification abstract'), max_length=255, blank=True, null=True, help_text=_('Required by Inspire and RNDT'))
    identification_keywords = models.CharField(
        _('Identification keywords'), max_length=255, blank=True, null=True)
    identification_keywords_type = models.CharField(
        _('Identification keywords type'), max_length=255, blank=True, null=True,
        help_text=_('From keyword type as per the ISO 19115 MD_KeywordTypeCode codelist). Typical values are: discipline, temporal, place, theme, stratum'))
    identification_fees = models.CharField(
        _('Identification fees'), max_length=255, blank=True, null=True)

    # TODO: get choice values from https://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/gmxCodelists.xml#MD_RestrictionCode
    identification_accessconstraints = models.CharField(
        _('Identification access contraints'),
        help_text=_('Text description for other constraints'),
        max_length=255,
        blank=True, null=True)
    provider_name = models.CharField(
        _('Provider name'), max_length=255, blank=True, null=True)
    provider_url = models.CharField(
        _('Provider url'), max_length=255, blank=True, null=True)
    contact_name = models.CharField(
        _('Contact name'), max_length=255, blank=True, null=True,
        help_text="{} | {}".format(
            _('Contact name and surename'),
            _('DCAT-US: <a href="https://resources.data.gov/resources/dcat-us/#contactPoint">"<i>contactPoint</i>"</a>'))
    )
    contact_position = models.CharField(
        _('Contact position'), max_length=255, blank=True, null=True)
    contact_address = models.CharField(
        _('Contact address'), max_length=255, blank=True, null=True)
    contact_city = models.CharField(
        _('Contact city'), max_length=255, blank=True, null=True)
    contact_stateorprovince = models.CharField(
        _('Contact state/province'), max_length=255, blank=True, null=True)
    contact_postalcode = models.CharField(
        _('Contact postalcode'), max_length=255, blank=True, null=True)
    contact_country = models.CharField(
        _('Contact country'), max_length=255, blank=True, null=True)
    contact_phone = models.CharField(
        _('Contect phone'), max_length=255, blank=True, null=True)
    contact_fax = models.CharField(
        _('Contect fax'), max_length=255, blank=True, null=True)
    contact_email = models.CharField(
        _('Contact email'), max_length=255, blank=True, null=True,
        help_text="{} | {}".format(
            _('Contact email address'),
            _('DCAT-US: <a href="https://resources.data.gov/resources/dcat-us/#contactPoint">"<i>contactPoint</i>"</a>')))
    contact_url = models.CharField(
        _('Contact URL'), max_length=255, blank=True, null=True)
    contact_hours = models.CharField(
        _('Contact hours'), max_length=255, blank=True, null=True)
    contact_instructions = models.CharField(
        _('Contact instructions'), max_length=255, blank=True, null=True)
    contact_role = models.CharField(
        _('Contact role'), max_length=255, blank=True, null=True)

    # Inspire section

    inspire_enabled = models.BooleanField(
        _('Metadata INSPIRE activation'), default=False,
        help_text=_('whether to enable the INSPIRE extension')
    )
    inspire_languages_supported = MultiSelectField(
        _('INSPIRE languages supported'), choices=LANGUAGE_CHOICES, max_length=255, blank=True, null=True, default='ita',
        help_text=_('list of comma separated 3 letter codes of supported languages (see http://inspire.ec.europa.eu/schemas/common/1.0/enums/enum_eng.xsd, simpleType euLanguageISO6392B)'))
    inspire_default_language = models.CharField(
        _('2.1.1.2 Default language'),
        choices=LANGUAGE_CHOICES,
        max_length=255, blank=True,
        null=True,
        default='ita',
        help_text=_('3 letter code of the default language (see http://inspire.ec.europa.eu/schemas/common/1.0/enums/enum_eng.xsd, simpleType euLanguageISO6392B)'))
    inspire_date = models.DateField(
        _('2.1.1.7 INSPIRE date'), blank=True, null=True,
        help_text=_('date of INSPIRE metadata offering (in ISO 8601 format), maps to dateStamp'))
    inspire_gemet_keywords = MultiSelectField(
        _('INSPIRE gemet keywords'),
        choices=INSPIRE_GEMET_THEMES,
        max_length=1024,
        blank=True, null=True,
        help_text="{} | {}".format(_('a comma-seperated keyword list of GEME INSPIRE theme keywords about the service (see http://inspire.ec.europa.eu/schemas/common/1.0/enums/enum_eng.xsd, complexType inspireTheme_eng)'),
                                   _('DCAT-US: <a href="https://resources.data.gov/resources/dcat-us/#keyword">"<i>keyword</i>"</a>'))
        )
    inspire_conformity_service = models.CharField(
        _('Conformity INSPIRE'),
        max_length=20,
        choices=INSPIRE_CONFORMITY_SERVICE,
        blank=True, null=True,
        help_text=_('the level of INSPIRE conformance for spatial data sets and services (conformant, notConformant, notEvaluated)'))
    inspire_contact_organization = models.CharField(
        _('2.1.1.6 Contact point: organization'), max_length=255, blank=True, null=True,
        help_text="{} | {}".format(_('the organization name responsible for the INSPIRE/RNDT metadata'),
                                   _('DCAT-US: <a href="https://resources.data.gov/resources/dcat-us/#publisher">"<i>publisher</i>"</a>'))
        )
    inspire_contact_email = models.CharField(
        _('2.1.1.6 Contact point: email'), max_length=255, blank=True, null=True,
        help_text=_('the email address of entity responsible for the INSPIRE/RNDT metadata'))
    inspire_contact_url = models.CharField(
        _('2.1.1.6 Contact point: URL'), max_length=255, blank=True, null=True,
        help_text=_('the URL of entity responsible for the INSPIRE/RNDT metadata'))
    inspire_contact_phone = models.CharField(
        _('2.1.1.6   Contact point: phone'), max_length=255, blank=True, null=True,
        help_text=_('the telephone number of entity responsible for the INSPIRE/RNDT metadata'))

    inspire_temp_extent = models.CharField(
        _('Temporal extent validation'), max_length=255, blank=True, null=True,
        help_text=_('temporal extent of the service (in ISO 8601 format). Either a single date (i.e. yyyy-mm-dd), or an extent (i.e. yyyy-mm-dd/yyyy-mm-dd)'))
    inspire_geographical_extent = models.CharField(
        _('Geographical extent'), max_length=255, blank=True, null=True,
        help_text=_('Space separated values of lon/lat (west south east north)'))

    # RNDT section
    rndt_enabled = models.BooleanField(
        _('RNDT metadata activation'),
        default=False,
        help_text=_('whether to enable the RNDT extension')
    )

    rndt_codice_ipa = models.CharField(
        _('RNDT iPA administration code'),
        max_length=32,
        null=True,
        blank=True,
        help_text=_('RNDT: iPA administration code, a part fo file identifier')
    )

    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True, editable=False)

    objects = models.Manager()
    active = ActiveCatalogManager()

    @property
    def rndt_file_identifier(self):
        """
        Il formato consigliato è il seguente:
            iPA:cod-Ente:aaaammgg:hhmmss
            dove:
                • iPA è il codice IPA assegnato all’Amministrazione nel
                momento dell’accreditamento come da comma 1 dell’art. 19
                dell’allegato A del DPCM 1 aprile 2008;
                • cod-Ente è un codice interno a discrezione
                dell’Amministrazione che può essere anche un progressivo;
                • aaaammgg è la data corrente (anno-mese-giorno);
                • hhmmss è l’orario corrente (ore-minuti-secondi).
                La parte obbligatoria del formato è il codice iPA che deve, perciò,
                essere sempre presente come prefisso dell’identificatore. La
                condizione imprescindibile è che l’identificativo debba essere univoco.
                Il separatore tra il codice iPA e la restante parte dell’identificatore è
                “:” (due punti).
        """

        return "%s:%s:%s" % (self.rndt_codice_ipa, self.rndt_codice_ente, self.updated_at.strftime('%Y%m%d:%H%I%S'))

    @property
    def rndt_metadata_identifier(self):
        """RNDT metadata identifier"""

        return '{0}:{1:010}'.format(self.rndt_codice_ipa, self.pk)

    @property
    def rndt_codice_ente(self):
        """RNDT codice ente: pk"""
        return '{:010}'.format(self.pk)

    def __unicode__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('catalog:detail', args=[str(self.pk)])

    def get_fields(self):
        """Return all fields and values from current model

        :return: list of (field_name, field_value) tuples
        :rtype: list of tuples
        """

        return [(field.name, field.value_to_string(self)) for field in self._meta.fields]

    def get_fields_label(self):
        """Return all fields label

        :return: dict of field_name: field_label
        :rtype: dict
        """

        return {field.name: _(field.verbose_name) for field in self._meta.fields}

    class Meta:
        verbose_name = _('Catalog endpoint')
        verbose_name_plural = _('Catalog endpoints')
        ordering = ['order']

    def inspire_fields(self):
        """Return a kvp dictionary of inspire specific fields and values

        :return: inspire fields and values
        :rtype: dict
        """

        return {f: v for f, v in self.get_fields() if f.startswith('inspire_')}

    def inspire_required_fields(self):
        """Return a kvp dictionary of inspire required fields and values,
        this includes inspire_fields() and adds some other fields.

        Note: inspire_distributor_contact* are not required

        :return: inspire required fields and values
        :rtype: dict
        """

        other_fields = ('inspire_languages_supported', 'inspire_default_language', 'identification_abstract', 'identification_title')
        return {f: v for f, v in self.get_fields() if (f in self.inspire_fields() or f in other_fields) and '_distributor_contact' not in f}

    def rndt_fields(self):
        """Return a kvp dictionary of RNDT specific fields and values

        :return: RNDT fields and values
        :rtype: dict
        """

        return {f: v for f, v in self.get_fields() if f.startswith('rndt_')}

    def rndt_required_fields(self):
        """Return a kvp dictionary of RNDT required fields and values, this
        includes all ispire fields

        :return: RNDT required fields and values
        :rtype: dict
        """

        result = self.inspire_required_fields()
        result.update(self.rndt_fields())
        return result

    def clean(self):
        """Model validation, that check for consistency between
        scope and (macro)group FKs
        Also checks for INSPIRE and RNDT
        """

        # get fields label
        labels = self.get_fields_label()

        # RNDT implies INSPIRE
        if self.rndt_enabled:
            self.inspire_enabled = True

        if self.scope == self.SCOPE.GROUP and self.group is None:
            raise ValidationError(
                _('You must select a group or set another scope for the catalog.'))
        if self.scope == self.SCOPE.MACROGROUP and self.macrogroup is None:
            raise ValidationError(
                _('You must select a macro group or set another scope for the catalog.'))

        if self.rndt_enabled:
            for rndt_field in self.rndt_required_fields().keys():
                if getattr(self, rndt_field) is None or not getattr(self, rndt_field):
                    raise ValidationError(
                        _('RNDT is enabled: you need to fill in "%s".') % labels[rndt_field])
        elif self.inspire_enabled:
            for inspire_field in self.inspire_required_fields().keys():
                if getattr(self, inspire_field) is None or not getattr(self, inspire_field):
                    raise ValidationError(
                        _('INSPIRE is enabled: you need to fill in "%s".') % labels[inspire_field])

        if self.inspire_geographical_extent:
            if not re.match(r'-?\d+(\.\d+)?\s-?\d+(\.\d+)?\s-?\d+(\.\d+)?\s-?\d+(\.\d+)?', self.inspire_geographical_extent):
                raise ValidationError(
                    _('inspire_geographical_extent is not correct, please use format space separated values of lon/lat (west south east north)'))

    def save(self, *args, **kwargs):
        """Call clean before save"""

        self.clean()
        super(Catalog, self).save(*args, **kwargs)

    def harvest(self):
        """Call all record factory functions from registered providers,
        passing the group(s) if the catalog is bound to one (or more)
        groups.

        Note: this method can be rather slow: consider using a CRON

        :return: IDs of harvested records
        :rtype: list of ints
        """

        groups = []
        records = []
        if self.scope == self.SCOPE.GLOBAL:
            providers = self.__CATALOG_PROVIDER_REGISTRY.values()
        elif self.scope in self.SCOPE.GROUP:
            providers = [e for e in self.__CATALOG_PROVIDER_REGISTRY.values(
            ) if e.scope == self.SCOPE.GROUP]
            groups = [self.group]
        elif self.scope in self.SCOPE.MACROGROUP:
            providers = [e for e in self.__CATALOG_PROVIDER_REGISTRY.values(
            ) if e.scope == self.SCOPE.MACROGROUP]
            groups = [g for g in self.macrogroup.group_set.all()]

        for provider in providers:
            entries = provider.record_factory(groups=groups)

            #logger.info('Harvesting %s entries from %s' % (len(entries), provider))
            for entry in entries:
                """ Il formato consigliato è il seguente: iPA:cod-Ente:aaaammgg:hhmmss dove:
                    iPA è il codice IPA; cod-Ente è un codice interno a discrezione
                    dell’Amministrazione che può essere anche un progressivo; aaaammgg è la
                    data corrente (anno-mese-giorno); hhmmss è l’orario corrente (ore-minuti-
                    secondi).
                """
                # Store entry identifier
                entry_identifier = entry['identifier']
                # Complete identifier: prepend codice IPA if it isset and append timestamp
                ipa = self.rndt_codice_ipa + ':' if self.rndt_codice_ipa else ''
                entry['identifier'] = ipa + entry['identifier'] + ':' + self.updated_at.strftime('%Y%m%d:%H%I%S')

                # project/record is being added to multiple catalogs
                try:
                    record = Record.objects.filter(
                        catalog=self, identifier__contains=entry_identifier)[0]
                    for k, v in entry.items():
                        current_value = getattr(record, k, None)

                        # Update only for links parameter because CATALOG_HOST settings can change
                        if current_value is None or current_value == '' or (k == 'links' and v != current_value):
                            setattr(record, k, v)
                    record.save()
                except IndexError:
                    entry['catalog'] = self
                    record = Record.objects.create(**entry)
                records.append(record.pk)
        logger.info('Catalog %s harvested %s records' %
                    (self.pk, len(records)))
        return records

    def regenerate(self):
        """Create or update all record for the catalog records

        Note: this method can be rather slow consider using a CRON
              async call

        :return:IDs of harvested records
        :rtype: list of ints
        """

        old_ids = set(self.record_set.all().values_list('pk', flat=True))
        new_ids = set(self.harvest())
        to_delete = old_ids - new_ids
        Record.objects.filter(pk__in=to_delete).delete()

        # Block signals or the catalog will be set as not valid again
        from .receivers import invalidate_catalog_receiver

        _kwargs = {
            'sender': Catalog,
            'signal': post_save,
            'receiver': invalidate_catalog_receiver,
            'dispatch_uid': None
        }

        with temp_disconnect_signal(**_kwargs):
            self.is_valid = True
            self.save()
            assert self.is_valid

        return new_ids

    @classmethod
    def regenerate_all_catalogs(cls, *args, **kwargs):
        """Regenerate all catalogs

        Note: this method can be rather slow consider using a CRON
              async call

        :return: number of harvested records
        :rtype: int
        """
        records = 0
        for catalog in cls.objects.all():
            records += len(catalog.invalidate())
        return records

    @classmethod
    def register_catalog_record_provider(cls, record_factory, scope=SCOPE.GLOBAL, senders=[]):
        """Register a new records provider.

        The caller can optionally specify a list of senders models to attach
        listeners for post_save and post_delete, the listeners will trigger
        catalog invalidation (executed asynchronously by a CRON task).

        :param record_factory: provider method that return records information
        :type record_factory: callable that accepts a groups argument with a (possibly empty) list of Group instances
        :param scope: catalog scope, defaults to SCOPE.GLOBAL
        :param scope: Catalog.SCOPE, optional
        :param senders: list of models to attach listeners, defaults to []
        :param senders: list, optional
        :raises ImproperlyConfigured: raised when the SCOPE is not valid
        """

        if scope not in Catalog.SCOPE:
            raise ImproperlyConfigured(
                _('%s registerCatalogRecordProvider registration must provide a valid Catalog.SCOPE') % record_factory)

        if not record_factory in cls.__CATALOG_PROVIDER_REGISTRY:
            entry = Catalog._CatalogProviderEntry(
                scope, record_factory, senders)
            cls.__CATALOG_PROVIDER_REGISTRY[record_factory] = entry
            for sender in senders:
                def _f(*args, **kwargs):
                    invalidate_all_catalogs_signal.send(
                        sender=kwargs['sender'])
                post_save.connect(_f, sender=sender, weak=False)
                post_delete.connect(_f, sender=sender, weak=False)

    @classmethod
    def unregister_all(cls):
        """Clear the record provider registry, mainly useful for testing."""
        cls.__CATALOG_PROVIDER_REGISTRY = {}

    @classmethod
    def registry(cls):
        """Returns the registry instance, mainly useful for testing."""
        return cls.__CATALOG_PROVIDER_REGISTRY

    @classmethod
    def clear_pod_cache(cls, catalog_slug):
        """
        Clear cache by catalog slug of Project Open Data (pod) API

        :param catalog_slug: 'Slug' of catalog model instance
        """

        if 'catalog' in settings.CACHES:
            caches['catalog'].delete(f'pod_{catalog_slug}')

    @classmethod
    def update_or_create_pod_cache(cls, catalog_slug, data):
        """
        Update or create cache by catalog slug of Project Open Data (pod) API

        :param catalog_slug: 'Slug' of catalog model instance
        :param data: dict data to save in to cache
        """

        if 'catalog' in settings.CACHES:
            caches['catalog'].set(f'pod_{catalog_slug}', data, timeout=None)

    @classmethod
    def retrieve_pod_cache(cls, catalog_slug):
        """
        Retrieve cache by catalog slug of Project Open Data (pod) API

        :param catalog_slug: 'Slug' of catalog model instance
        :return: cache value by key
        """

        return caches['catalog'].get(f'pod_{catalog_slug}') if 'catalog' in settings.CACHES else None


# TODO - we may not need all these fields
# investigate how the searching is done
# TODO - Add the remaining indexes
class Record(models.Model):
    """
    Most of the fields are nullable in order to allow external
    manipulation of the database by PyCSW

    The following RNDT/INSPIRE fields are inherited from the Catalog
    related parent row:

    - 2.1.1.7 Data dei metadati dateStamp
    - 2.1.5.4 Conformità: specifiche (from catalog)
    - 2.1.5.5 Conformità: grado (from catalog)


    The following RNDT/INSPIRE fields are automatically calculated:

    - 2.1.2.5 Identificatore
    - 2.1.4.1 Localizzazione geografica
    - 2.1.6.1 Sistema di riferimento spaziale
    - 2.1.7.1 Formato di distribuzione
    - 2.1.7.3 Risorsa on-line (WMS/WFS)


    The following RNDT/INSPIRE fields are hardcoded values:

    - 2.1.1.8 Nome dello Standard
    - 2.1.1.9 Versione dello Standard
    - 2.1.2.3 Formato di presentazione
    - 2.1.2.11 Set di caratteri
    - 2.1.2.12 Tipo di rappresentazione spaziale
    - 2.1.3.1 Limitazione d’uso (No conditions apply)
    - 2.1.3.2 Vincoli di accesso (Altri vincoli - Dato pubblico)
    - 2.1.3.3 Vincoli di fruibilità
    - 2.1.3.4 Altri vincoli (Altri vincoli - Dato pubblico)
    - 2.1.3.5 Vincoli di sicurezza (non classificato)
    - 2.1.5.1 Livello di qualità


    The following (optional) RNDT/INSPIRE fields are NOT supported/implemented:

    - 2.1.2.6 ID livello superiore
    - 2.1.2.7 Altri dettagli
    - 2.1.2.9 Parole chiave - !! GEMET only is allowed !!
    - 2.1.2.16 Informazioni supplementari
    - 2.1.4.2 Estensione verticale
    - 2.1.4.3 Estensione temporale


    """

    # See http://inspire.ec.europa.eu/metadata-codelist/TopicCategory
    INSPIRE_TOPIC_CATEGORY = Choices(
        #('Label	Definition', 'Description'),
        ('farming', _('Farming - Rearing of animals and/or cultivation of plants.')),
        ('biota',  _('Biota - Flora and/or fauna in natural environment.')),
        ('boundaries',  _('Boundaries - Legal land descriptions.')),
        ('climatologyMeteorologyAtmosphere', _(
            'Climatology / Meteorology / Atmosphere - Processes and phenomena of the atmosphere.')),
        ('economy', _("Economy - Economic activities, conditions and employment.")),
        ('elevation',  _('Elevation - Height above or below sea level.')),
        ('environment',  _(
            'Environment - Environmental resources, protection and conservation.')),
        ('geoscientificInformation',  _(
            'Geoscientific Information - Information pertaining to earth sciences.')),
        ('health',  _('Health, health services, human ecology, and safety.')),
        ('imageryBaseMapsEarthCover', _('Imagery / Base Maps / Earth Cover.')),
        ('intelligenceMilitary', _(
            'Intelligence / Military - Military bases, structures, activities.')),
        ('inlandWaters', _(
            'Inland water features, drainage systems and their characteristics.')),
        ('location', _('Location - Positional information and services.')),
        ('oceans', _('Oceans - Features and characteristics of salt water bodies (excluding inland waters).')),
        ('planningCadastre', _(
            'Planning / Cadastre - Information used for appropriate actions for future use of the land.')),
        ('society', _('Society - Characteristics of society and cultures.')),
        ('structure', _('Structure - Man-made construction.')),
        ('transportation', _(
            'Transportation - Means and aids for conveying persons and/or goods.')),
        ('utilitiesCommunication', _(
            'Utilities / Communication - Energy, water and waste systems and communications infrastructure and services.')),
    )

    INPIRE_RESOURCE_MAINTENANCE_FREQUENCY = Choices(
        ("annually", _("data is updated every year")),
        ("asNeeded", _(
            "data is updated as deemed necessary, applies to resources with 'completed' status")),
        ("biannually", _("data is updated twice each year 	")),
        ("biennially", _("resource is updated every 2 years 	")),
        ("continual", _("data is repeatedly and frequently updated 	use for data that is updated at a greater than daily frequency")),
        ("daily", _("data is updated each day 	")),
        ("fortnightly", _("data is updated every two weeks 	")),
        ("irregular", _("data is updated in intervals that are uneven in duration 	")),
        ("monthly", _("data is updated each month 	")),
        ("notPlanned", _(
            "there are no plans to update the data, applies to resources with 'completed' status")),
        ("periodic", _("resource is updated at regular intervals, ")),
        ("quarterly", _("data is updated every three months")),
        ("semimonthly", _("resource updated twice a monthly")),
        ("unknown", _("frequency of maintenance for the data is not known")),
        ("weekly", _("data is updated on a weekly basis")),
    )

    # Note: this is the filter field for ParentIdentifier
    catalog = models.ForeignKey(
        Catalog, on_delete=models.CASCADE, help_text='Maps to pycsw:ParentIdentifier')

    identifier = models.CharField(
        _('2.1.2.5 Identifier'),
        # editable=False,  # auto
        max_length=255,
        db_index=True,
        help_text=_("2.1.2.5 File identifier - Maps to pycsw:Identifier")
    )

    # FIXME: check if can be removed
    typename = models.CharField(
        editable=False,  # auto
        max_length=100,
        default="gmd:MD_Metadata",
        db_index=True,
        help_text="Maps to pycsw:Typename"
    )
    # FIXME: check if can be removed
    schema = models.CharField(
        editable=False,
        max_length=100,
        default="http://www.isotc211.org/2005/gmd",
        help_text="Maps to pycsw:Schema",
        db_index=True,
    )
    # FIXME: check if can be removed
    metadata_source = models.CharField(
        editable=False,
        max_length=255,
        default="local",
        help_text='maps to pycsw:MdSource',
        db_index=True
    )
    # FIXME: check if can be removed
    insert_date = models.DateTimeField(
        editable=False,
        auto_now_add=True,
        help_text='Maps to pycsw:InsertDate'
    )

    # TODO: auto field or better: remove
    xml = models.TextField(
        #default='<gmd:MD_Metadata '
        #        'xmlns:gmd="http://www.isotc211.org/2005/gmd"/>',
        help_text='Maps to pycsw:XML',
        editable=False,
    )
    # FIXME: check if can be removed
    any_text = models.TextField(
        help_text='Maps to pycsw:AnyText',
        editable=False,
    )
    # TODO - Could import pycountry and perform validation on the language
    # TODO - Perhaps including all languages in a checkbox is overkill...
    # code sample:
    # import pycountry
    # [(k, v.name) for k, v in pycountry.languages.indices[
    #     "iso639_3_code"].iteritems()]
    language = models.CharField( # Maps to pycsw:Language
        _('2.1.2.14 Language'),
        max_length=3,
        choices=Catalog.LANGUAGE_CHOICES,
        default='eng',
        blank=True,
        null=True,
        help_text="{} | {}".format(
            _("2.1.2.14 Data Language"),
            _('DCAT-US: <a href="https://resources.data.gov/resources/dcat-us/#language">"<i>language</i>"</a>')
        )
    )
    title = models.CharField(
        _('2.1.2.1 Title'),
        max_length=255,
        null=True,
        help_text="{} | {}".format(
            _('2.1.2.1 Title data'),
            _('DCAT-US: <a href="https://resources.data.gov/resources/dcat-us/#title">"<i>title</i>"</a>')
        )  # Maps to pycsw:Title
    )
    abstract = models.TextField(
        _('2.1.2.8 Abstract'),
        blank=True,
        null=True,
        # Maps to pycsw:Abstract
        help_text="{} | {}".format(
            _('2.1.2.8 Abstract data description'),
            _('DCAT-US: <a href="https://resources.data.gov/resources/dcat-us/#description">"<i>description</i>"</a>'))
    )
    #'Maps to pycsw:Keywords'
    keywords = MultiSelectField(
        _('2.1.2.9 Keywords'), choices=Catalog.INSPIRE_GEMET_THEMES, max_length=1024, blank=True, null=False,
        help_text="{} | {}".format(
            _('2.1.2.9 Record keywords - a comma-seperated keyword list of GEMET INSPIRE theme keywords about the service (see http://inspire.ec.europa.eu/schemas/common/1.0/enums/enum_eng.xsd, complexType inspireTheme_eng)'),
            _('DCAT-US: <a href="https://resources.data.gov/resources/dcat-us/#keyword">"<i>keyword</i>"</a>')
            )
        )
    # FIXME: check if can be removed
    keywords_types = models.CharField(
        editable=False,
        max_length=255,
        blank=True,
        null=True,
        help_text='Maps to pycsw:Keywordstype'
    )
    format = models.CharField(
        _('2.1.7.1 Distribution format'),
        # editable=False,
        max_length=50,
        null=True,
        blank=True,
        # Maps to pycsw:Format
        help_text=_("2.1.7.1 Description about data format")
    )
    source = models.CharField(
        editable=False,
        max_length=512,
        blank=True,
        null=True,
        help_text='Maps to pycsw:Source'
    )
    # FIXME: this is apparently not used, dateStamp is taken from the parent Catalog value
    date = models.DateTimeField(
        null=True, blank=True,
        # auto_now_add=True,
        help_text='Maps to pycsw:Date'
    )
    modified_date = models.DateField(
        _('2.1.2.2 Modified date'),
        null=True, blank=True,
        # auto_now_add=True,
        help_text="{} | {}".format(_('2.1.2.2 Modified date'), _('DCAT-US: <a href="https://resources.data.gov/resources/dcat-us/#modified">"<i>modified</i>"</a>'))
    )
    creation_date = models.DateField(
        _('2.1.2.2 Creation date'),
        null=True, blank=True,
        # auto_now_add=True,
        help_text="{} | {}".format(_('2.1.2.2 Data creation date'), _('DCAT-US: <a href="https://resources.data.gov/resources/dcat-us/#issued">"<i>issued</i>"</a>'))  # Maps to pycsw:CreationDate
    )
    revision_date = models.DateField(
        _('2.1.2.2 Revision date'),
        null=True, blank=True,
        # auto_now_add=True,
        help_text=_('2.1.2.2 Data revision date')  # Maps to pycsw:RevisionDate
    )
    publication_date = models.DateField(
        _('2.1.2.2 Publication date'),
        null=True, blank=True,
        # auto_now_add=True,
        # Maps to pycsw:PublicationDate
        help_text=_('2.1.2.2 Data publication date')
    )
    # FIXME: check if can be removed
    type = models.CharField(
        editable=False,
        max_length=50,
        null=True,
        blank=True,
        help_text='Maps to pycsw:Type'
    )
    bounding_box = models.TextField(
        _('2.1.4.1 Bounding box'),
        null=True,
        blank=True,
        # Maps to pycsw:BoundingBox
        help_text=_(
            '2.1.4.1 Data bounding box. Automatically calculated from layer')
    )
    crs = models.CharField(
        _('2.1.6.1 Coordinate reference system'),
        max_length=255,
        null=True,
        blank=True,
        # Maps to pycsw:CRS
        help_text=_('2.1.6.1 Data Coordinate reference system')
    )
    # FIXME: remove: unused
    alternate_title = models.CharField(
        editable=False,
        max_length=255,
        blank=True,
        null=True,
        help_text='Maps to pycsw:AlternateTitle'
    )
    # FIXME: remove: unused
    organization_name = models.CharField(
        editable=False,  # inherit
        max_length=255,
        null=True,
        blank=True,
        help_text='Maps to pycsw:OrganizationName'
    )
    # FIXME: remove: unused
    security_constraints = models.CharField(
        _('2.1.3.5 Security constraints'),
        # editable=False,
        max_length=255,
        null=True,
        blank=True,
        #help_text='Maps to pycsw:SecurityConstraints'
    )
    topic_category = models.CharField(
        _('2.1.2.15 Topic category'),
        max_length=255,
        null=True,
        blank=True,
        choices=INSPIRE_TOPIC_CATEGORY,
        help_text='2.1.2.15 Main topic data'  # Maps to pycsw:TopicCategory
    )
    resource_language = models.CharField(
        _('2.1.2.14 Language'),
        editable=True,
        max_length=30,
        blank=True,
        null=True,
        # Maps to pycsw:ResourceLanguage
        help_text='2.1.2.14 Language used for data - inherited from catalog if left blank'
    )
    # FIXME: check if can be removed
    geographic_description_code = models.CharField(
        editable=False,
        max_length=50,
        null=True,
        blank=True,
        help_text='Maps to pycsw:GeographicDescriptionCode'
    )
    denominator = models.IntegerField(
        _('2.1.2.13 Spatial resolution'),
        default=1000,
        help_text='2.1.2.13 General density data factor'
    )
    distance_value = models.CharField(
        editable=False,
        max_length=50,
        null=True,
        blank=True,
        help_text='2.1.2.13 Risoluzione spaziale - Maps to pycsw:DistanceValue'
    )
    distance_uom = models.CharField(
        editable=False,
        max_length=200,
        null=True,
        blank=True,
        help_text='2.1.2.13 Risoluzione spaziale- Maps to pycsw:DistanceUOM'
    )
    # FIXME: not implemented: check if can be removed
    temporal_extent_begin = models.DateTimeField(
        _('2.1.4.3 Temporal extension: start'),
        # editable=False,
        max_length=255,
        null=True,
        blank=True,
        # Maps to pycsw:TempExtent_begin
        help_text=_('2.1.4.3 Start of data average time')
    )
    # FIXME: not implemented: check if can be removed
    temporal_extent_end = models.DateTimeField(
        _('2.1.4.3 Temporal extension: end'),
        # editable=False,
        max_length=255,
        null=True,
        blank=True,
        # Maps to pycsw:TempExtent_end
        help_text=_('2.1.4.3 End of data average time')
    )
    # FIXME: check if can be removed: hardcoded
    service_type = models.CharField(
        editable=False,
        max_length=30,
        null=True,
        blank=True,
        help_text='Maps to pycsw:ServiceType'
    )
    # FIXME: check if can be removed: hardcoded
    service_type_version = models.CharField(
        editable=False,
        max_length=30,
        null=True,
        blank=True,
        help_text='Maps to pycsw:ServiceTypeVersion'
    )
    # FIXME: check if can be removed: hardcoded
    operation = models.CharField(
        editable=False,
        max_length=30,
        null=True,
        blank=True,
        help_text='Maps to pycsw:Operation'
    )
    # FIXME: check if can be removed: hardcoded
    coupling_type = models.CharField(
        editable=False,
        max_length=30,
        null=True,
        blank=True,
        help_text='Maps to pycsw:CouplingType'
    )
    # FIXME: check if can be removed: hardcoded
    operates_on = models.CharField(
        editable=False,
        max_length=255,
        null=True,
        blank=True,
        help_text='Maps to pycsw:OperatesOn'
    )
    # FIXME: check if can be removed: hardcoded
    operates_on_identifier = models.CharField(
        editable=False,  # auto
        max_length=255,
        null=True,
        blank=True,
        help_text='Maps to pycsw:OperatesOnIdentifier'
    )
    # FIXME: check if can be removed: hardcoded
    operates_on_name = models.CharField(
        editable=False,
        max_length=255,
        null=True,
        blank=True,
        help_text='Maps to pycsw:OperatesOnName'
    )
    # FIXME: check if can be removed: hardcoded
    degree = models.CharField(
        editable=False,
        max_length=255,
        null=True,
        blank=True,
        help_text='Maps to pycsw:Degree'
    )
    # FIXME: check if can be removed: hardcoded
    access_constraints = models.TextField(
        _('2.1.3.2 Access constraints'),
        # editable=False,
        null=True,
        blank=True,
        #help_text='Maps to pycsw:AccessConstraints'
    )
    # FIXME: check if can be removed: hardcoded
    other_constraints = models.TextField(
        _('2.1.3.4 Other constraints'),
        # editable=False,  # auto
        null=True,
        blank=True,
        #help_text='Maps to pycsw:OtherConstraints'
    )
    # FIXME: check if can be removed: hardcoded
    classification = models.CharField(
        editable=False,
        max_length=255,
        null=True,
        blank=True,
        help_text='Maps to pycsw:Classification'
    )
    # FIXME: check if can be removed: hardcoded
    condition_applying_to_access_and_use = models.TextField(
        editable=False,
        null=True,
        blank=True,
        help_text='Maps to pycsw:ConditionApplyingToAccessAndUse'
    )
    lineage = models.TextField(
        _('2.1.5.3 Lineage'),
        null=True,
        blank=True,
        # Maps to pycsw:Lineage
        help_text=_(
            '2.1.5.3 Descriptive text about process history and/or general quality of data')
    )
    responsible_party_role = models.CharField(
        editable=False,
        max_length=255,
        null=True,
        blank=True,
        help_text='Maps to pycsw:ResponsiblePartyRole'
    )
    specification_title = models.CharField(
        editable=False,  # hardcoded
        max_length=255,
        null=True,
        blank=True,
        help_text='Maps to pycsw:SpecificationTitle'
    )
    specification_date = models.DateTimeField(
        editable=False,  # hardcoded
        blank=True,
        null=True,
        help_text='Maps to pycsw:SpecificationDate'
    )
    specification_date_type = models.CharField(
        editable=False,  # hardcoded
        max_length=30,
        null=True,
        blank=True,
        help_text='Maps to pycsw:SpecificationDateType'
    )
    creator = models.CharField(
        editable=False,  # auto
        max_length=255,
        null=True,
        blank=True,
        help_text='Maps to pycsw:Creator'
    )
    publisher = models.CharField(
        editable=False,  # auto
        max_length=255,
        null=True,
        blank=True,
        help_text='Maps to pycsw:Publisher'
    )
    contributor = models.CharField(
        editable=False,  # auto
        max_length=255,
        null=True,
        blank=True,
        help_text='Maps to pycsw:Contributor'
    )
    relation = models.CharField(
        editable=False,
        max_length=255,
        null=True,
        blank=True,
        help_text='Maps to pycsw:Relation'
    )
    links = models.CharField(
        editable=True,  # auto
        max_length=1024,
        null=True,
        blank=True,
        help_text='Maps to pycsw:Links'
    )
    accuracy = models.FloatField(
        _('2.1.5.2 Positional accuracy'),
        default=1.0,
        help_text=_('2.1.5.2 Positional accuracy in meters')
    )

    # INSPIRE overrides

    inspire_use_limitation = models.TextField(
        _('2.1.3.1 Use limitation'), blank=True, null=True,
        help_text=_('2.1.3.1 Use limitation - Restrictions on data usage and access, inherited from catalog - No conditions apply - if left blank'))

    inspire_contact_organization = models.CharField(
        _('2.1.2.10 INSPIRE contactor organization'), max_length=255, blank=True, null=True,
        help_text="{} | {}".format(
            _('2.1.2.10 Responsabile dei metadati - the organization name responsible for the INSPIRE/RNDT metadata, inherited from catalog if left blank'),
            _('DCAT-US: <a href="https://resources.data.gov/resources/dcat-us/#publisher">"<i>publisher</i>"</a>')
            )
        )
    inspire_contact_email = models.CharField(
        _('2.1.2.10 INSPIRE contact email'), max_length=255, blank=True, null=True,
        help_text=_('2.1.2.10 Responsabile dei metadati - the email address of entity responsible for the INSPIRE/RNDT metadata, inherited from catalog if left blank'))
    inspire_contact_url = models.CharField(
        _('2.1.2.10 INSPIRE contact url'), max_length=255, blank=True, null=True,
        help_text=_('2.1.2.10 Responsabile dei metadati - the URL of entity responsible for the INSPIRE/RNDT metadata, inherited from catalog if left blank'))
    inspire_contact_phone = models.CharField(
        _('2.1.2.10 INSPIRE contact phone'), max_length=255, blank=True, null=True,
        help_text=_('2.1.2.10 Responsabile dei metadati - the telephone number of entity responsible for the INSPIRE/RNDT metadata, inherited from catalog if left blank'))

    # RNDT Distributor overrides
    rndt_distributor_contact_organization = models.CharField(
        _('2.1.7.2 Data distributor: organization'),
        max_length=255,
        blank=True, null=True,
        help_text=_('2.1.7.2 Data distributor - RNDT the organization name of the distributor, inherited from catalog if left blank'))
    rndt_distributor_contact_email = models.CharField(
        _('2.1.7.2 Data distributor: email'),
        max_length=255,
        blank=True, null=True,
        help_text=_('2.1.7.2 Data distributor - the email address of the distributor, inherited from catalog if left blank'))
    rndt_distributor_contact_url = models.CharField(
        _('2.1.7.2 Data distributor: URL'),
        max_length=255,
        blank=True, null=True,
        help_text=_('2.1.7.2 Data distributor - the URL of the distributor, inherited from catalog if left blank'))
    rndt_distributor_contact_phone = models.CharField(
        _('2.1.7.2 Data distributor: phone'),
        max_length=255,
        blank=True, null=True,
        help_text=_('2.1.7.2 Data distributor - the telephone number of the distributor, inherited from catalog if left blank'))

    # INSPIRE Owner overrides (citedResponsibleParty)
    inspire_owner_contact_organization = models.CharField(
        _('2.1.2.4 INSPIRE owner contact organization'), max_length=255, blank=True, null=True,
        help_text=_('2.1.2.4 Responsabile - INSPIRE the organization name of the owner, inherited from catalog if left blank'))
    inspire_owner_contact_email = models.CharField(
        _('2.1.2.4 INSPIRE owner contact email'), max_length=255, blank=True, null=True,
        help_text=_('2.1.2.4 Responsabile - the email address of the owner, inherited from catalog if left blank'))
    inspire_owner_contact_url = models.CharField(
        _('2.1.2.4 INSPIRE owner contact url'), max_length=255, blank=True, null=True,
        help_text=_('2.1.2.4 Responsabile - the URL of the owner, inherited from catalog if left blank'))
    inspire_owner_contact_phone = models.CharField(
        _('2.1.2.4 INSPIRE owner contact phone'), max_length=255, blank=True, null=True,
        help_text=_('2.1.2.4 Responsabile - the telephone number of the owner, inherited from catalog if left blank'))

    # Free (not GEMET) keywords from project's getProjectSettings
    project_keywords = models.TextField(_('Project keywords'), blank=True, null=True, editable=False, help_text=_(
        'These additional (not-GEMET) keywords are automatically updated form the getProjectSettings'))

    # Added even if RNDT sais it's not required
    rndt_resource_maintenance_frequency = models.CharField(
        _('2.1.8.1 Frequenza di aggiornamento'),
        max_length=255,
        default='unknown',
        choices=INPIRE_RESOURCE_MAINTENANCE_FREQUENCY,
        help_text=_(
            '2.1.8.1 Frequenza con la quale sono registrati gli aggiornamenti dei dati.')
    )

    # Add general data relative to project type and unique identification
    g3w_project_type = models.CharField(_('G3W-SUITE project type'), blank=True, null=True, max_length=255)
    g3w_layer_id = models.IntegerField(_('G3W-SUITE layer id/pk'), blank=True, null=True)

    def rndt_dataset_identifier(self):
        """
        Il formato consigliato è il seguente:
            iPA:cod-Ente
            dove:
                • iPA è il codice IPA assegnato all’Amministrazione nel
                momento dell’accreditamento come da comma 1 dell’art. 19
                dell’allegato A del DPCM 1 aprile 2008;
                • cod-Ente è un codice interno a discrezione
                dell’Amministrazione che può essere anche un progressivo;
                Il separatore tra il codice iPA e la restante parte dell’identificatore è
                “:” (due punti).
        """

        return '{0}:{1}'.format(self.catalog.rndt_codice_ipa if self.catalog.rndt_codice_ipa else 'IPA', self.identifier)

    class Meta:
        unique_together = (("catalog", "identifier"),)

    def clean(self):
        """Apply defaults from catalog"""

        if not self.keywords:
            self.keywords = self.catalog.inspire_gemet_keywords

        # Always override
        self.language = self.catalog.inspire_default_language

    def save(self, *args, **kwargs):
        """Call clean before save"""

        self.clean()
        super(Record, self).save(*args, **kwargs)

    def __str__(self):
        return self.identifier

    def __unicode__(self):
        return self.identifier
