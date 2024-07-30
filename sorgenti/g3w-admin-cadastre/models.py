# -*- coding: utf-8 -*-
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.gis.db import models
from django.contrib.auth.models import User, Group as AuthGroup
from django.db.models.query import QuerySet, IntegrityError, connections, transaction, partition, AutoField
from django.db.models.manager import BaseManager
from django.forms.models import model_to_dict
from django.utils.translation import ugettext_lazy as _
from guardian.shortcuts import assign_perm, remove_perm
from model_utils.models import TimeStampedModel, AutoCreatedField
from model_utils import Choices
from qdjango.models import Project, Layer
from usersmanage.utils import \
    get_users_for_object, \
    get_objects_by_perm, \
    setPermissionUserObject, \
    get_viewers_for_object, \
    get_groups_for_object
from usersmanage.configs import *
from core.models import G3WSpatialRefSys

import logging

logger = logging.getLogger('django.request')



TIPO_CATASTO = Choices(
    (u'F', 'FAB'),
    (u'T', 'TER'),
)
TIPO_FABBRICATO = Choices(
    (u'F', u'Fabbricato(F)'),
)

TIPO_IMMOBILE = Choices(
    (u'F', u'Fabbricato(F)'),
    (u'T', u'Terreno(T)'),
)

FLAG_CLASSAMENTO =  Choices(
    (u'1', u'classamento proposto dalla parte'),
    (u'2', u'classamento proposto dalla parte e validato dall\'ufficio'),
    (u'3', u'classamento automatico(attribuito in sostituzione del classamento proposto)'),
    (u'4', u'classamento rettificato( in sostituzione del classamento proposto)'),
    (u'5', u'classamento proposto divenuto definitivo per decorrenza termini'),
    (u' ', u'residuale su uiu antecedenti DOCFA')
)

TERRENO_REDDITO = Choices(
    (u'0', u'Calcolabile(0)'),
    (u'1', u'Non calcolabile(1)'),
)

TERRENO_PORZIONE = Choices(
    (u'0', u'Assenti(0)'),
    (u'1', u'Esistenza porzioni(1)'),
)

TERRENO_DEDUZIONI = Choices(
    (u'0', u'Assenti(0)'),
    (u'1', u'Esistenza deduzioni(1)'),
)

TIPO_SOGGETTO = Choices(
    (u'P', u'Persona fisica(F)'),
    (u'G', u'Persona giuridica(G)'),
)

TIPO_REGIME = Choices(
    (u'C', u'Comunione(C)'),
    (u'P', u'Bene personale(P)'),
    (u'S', u'In separazione(S)'),
    (u'D', u'In comunione de residuo(D)'),
)

SESSO = Choices(
    (u'1', u'Maschio(1)'),
    (u'2', u'Femmina(2)'),
)

CXF_DB_PROVIDERS = Choices(
    ('postgresql', 'PostgreSql'),
    ('oracle', 'Oracle')
)


class CadastreQuerySet(QuerySet):
    pass

    # def bulk_create(self, objs, batch_size=None):
    #
    #     assert batch_size is None or batch_size > 0
    #
    #     for parent in self.model._meta.get_parent_list():
    #         if parent._meta.concrete_model is not self.model._meta.concrete_model:
    #             raise ValueError("Can't bulk create a multi-table inherited model")
    #     if not objs:
    #         return objs
    #     self._for_write = True
    #     connection = connections[self.db]
    #     fields = self.model._meta.concrete_fields
    #     objs = list(objs)
    #     self._populate_pk_values(objs)
    #     #with transaction.atomic(using=self.db, savepoint=False):
    #     objs_with_pk, objs_without_pk = partition(lambda o: o.pk is None, objs)
    #     if objs_with_pk:
    #         self._batched_insert(objs_with_pk, fields, batch_size)
    #     if objs_without_pk:
    #         fields = [f for f in fields if not isinstance(f, AutoField)]
    #         ids = self._batched_insert(objs_without_pk, fields, batch_size)
    #     return objs
    #
    # def _batched_insert(self, objs, fields, batch_size):
    #     """
    #     A little helper method for bulk_insert to insert the bulk one batch
    #     at a time. Inserts recursively a batch from the front of the bulk and
    #     then _batched_insert() the remaining objects again.
    #     """
    #     if not objs:
    #         return
    #     ops = connections[self.db].ops
    #     batch_size = (batch_size or max(ops.bulk_batch_size(fields, objs), 1))
    #     inserted_ids = []
    #     for item in [objs[i:i + batch_size] for i in range(0, len(objs), batch_size)]:
    #         try:
    #             if connections[self.db].features.can_return_ids_from_bulk_insert:
    #                 inserted_id = self._insert(item, fields=fields, using=self.db, return_id=True)
    #                 if isinstance(inserted_id, list):
    #                     inserted_ids.extend(inserted_id)
    #                 else:
    #                     inserted_ids.append(inserted_id)
    #             else:
    #                 self._insert(item, fields=fields, using=self.db)
    #         except IntegrityError as e:
    #             continue
    #     return inserted_ids


class CadastreManager(BaseManager.from_queryset(CadastreQuerySet)):
    pass


class CategorieCatastali(models.Model):

    categoria = models.CharField(max_length=3, primary_key=True)
    descrizione = models.CharField(max_length=255)

    def __unicode__(self):
        return "{}".format(self.categoria)

    class Meta:
        db_table = 'categorie_catastali'
        verbose_name_plural = 'Categorie catastali'
        verbose_name = 'Categoria catastale'


class SezioniCensuarie(models.Model):

    tipo = models.CharField(choices=TIPO_CATASTO, max_length=1)
    provincia = models.CharField(max_length=2)
    codice_comune = models.CharField(max_length=4)
    sezione = models.CharField(max_length=1)
    descrizione = models.CharField(max_length=255)

    def __unicode__(self):
        return "{} [{}({})]".format(self.sezione, self.codice_comune, self.provincia)

    class Meta:
        db_table = 'sezioni_censuarie'
        verbose_name_plural = 'Sezioni censuarie'
        verbose_name = 'Sezione censuaria'


class CodiciPartita(models.Model):

    tipo = models.CharField(choices=TIPO_CATASTO, max_length=1)
    partita = models.CharField(max_length=7)
    descrizione = models.CharField(max_length=255)

    class Meta:
        db_table = 'codici_partita'
        verbose_name_plural = 'Codici partita'
        verbose_name = 'Codice partita'


class TipiNota(models.Model):

    tipo = models.CharField(choices=TIPO_CATASTO, max_length=1)
    nota = models.CharField(max_length=1)
    descrizione = models.CharField(max_length=255)

    class Meta:
        db_table = 'tipi_nota'
        verbose_name_plural = 'Tipi nota'
        verbose_name = 'Tipo nota'


class QualitaTerreni(models.Model):

    qualita = models.IntegerField(primary_key=True)
    descrizione = models.CharField(max_length=255)

    def __unicode__(self):
        return "{} - {}".format(self.qualita, self.descrizione)

    def __str__(self):
        return self.__unicode__()

    class Meta:
        db_table = 'qualita_terreni'
        verbose_name_plural = 'Qualità terreni'
        verbose_name = 'Qualità terreno'


class CodiciDiritto(models.Model):

    codice_diritto = models.CharField(max_length=3, primary_key=True)
    descrizione = models.CharField(max_length=255)

    def __unicode__(self):
        return "{}".format(self.codice_diritto)

    class Meta:
        db_table = 'codici_diritto'
        verbose_name_plural = 'Codici diritto'
        verbose_name = 'Codice diritto'


class UnitaImmobiliare(models.Model):
    """
    Modello con dati chiave per fabbricati.
    """
    id_immobile = models.IntegerField()
    codice_comune = models.CharField(blank=True, null=True, max_length=4)
    progressivo = models.IntegerField(blank=True, null=True)
    
    sezione = models.CharField(max_length=1, null=True, blank=True)

    zona = models.CharField(blank=True, null=True, max_length=3)
    #categoria = models.ForeignKey(CategorieCatastali, db_column='categoria', null=True, blank=True)
    categoria = models.CharField(max_length=3, null=True, blank=True)
    classe = models.CharField(blank=True, null=True, max_length=2)
    consistenza = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    superficie = models.IntegerField(blank=True, null=True)
    rendita_lire = models.BigIntegerField(blank=True, null=True)
    rendita_euro = models.DecimalField(max_digits=18, decimal_places=2, blank=True, null=True)
    lotto = models.CharField(blank=True, null=True, max_length=2)
    edificio = models.CharField(blank=True, null=True, max_length=2)
    scala = models.CharField(blank=True, null=True, max_length=2)
    interno_1 = models.CharField(blank=True, null=True, max_length=3)
    interno_2 = models.CharField(blank=True, null=True, max_length=3)
    piano_1 = models.CharField(blank=True, null=True, max_length=4)
    piano_2 = models.CharField(blank=True, null=True, max_length=4)
    piano_3 = models.CharField(blank=True, null=True, max_length=4)
    piano_4 = models.CharField(blank=True, null=True, max_length=4)

    partita = models.CharField(blank=True, null=True, max_length=7)

    flag_classamento = models.CharField(choices=FLAG_CLASSAMENTO, blank=True, null=True, max_length=1)
    protocollo_notifica = models.CharField(blank=True, null=True, max_length=18)
    data_notifica = models.DateField(blank=True, null=True)

    id_mutazionale_iniziale = models.IntegerField(blank=True, null=True)
    id_mutazionale_finale = models.IntegerField(blank=True, null=True)

    annotazione = models.CharField(blank=True, null=True, max_length=400)

    task_id = models.CharField(max_length=255, null=True, blank=True)


    class Meta:
        db_table = 'unita_immobiliari'
        verbose_name_plural = 'Unità immobiliari'
        verbose_name = 'Unità immobiliare'


class DatiAtto(models.Model):

    id = models.IntegerField(primary_key=True)
    codice_comune = models.CharField(blank=True, null=True, max_length=4)

    data_efficacia = models.DateField('Data di Efficacia conclusiva', blank=True, null=True)
    data_registrazione = models.DateField('Data di registrazione conclusiva', blank=True, null=True)
    tipo_nota = models.CharField(blank=True, null=True, max_length=1)  # todo: forse mettere una choice
    numero_nota = models.CharField(blank=True, null=True, max_length=6)
    progressivo_nota = models.CharField(blank=True, null=True, max_length=3)
    anno_nota = models.IntegerField(blank=True, null=True)

    codice_casuale = models.CharField(blank=True, null=True, max_length=3)
    descrizione_casuale = models.CharField(blank=True, null=True, max_length=100)

    task_id = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'dati_atto'
        verbose_name_plural = 'Dati atto'
        verbose_name = 'Dato atto'


class IdentificativiImmobiliari(models.Model):

    cadastre_objects = CadastreManager()
    objects = models.Manager()

    id_immobile = models.IntegerField()
    progressivo = models.IntegerField(blank=True, null=True)
    codice_comune = models.CharField(blank=True, null=True, max_length=4)
    sezione = models.CharField(max_length=1, null=True, blank=True)

    sezione_urbana = models.CharField(blank=True, null=True, max_length=3)
    foglio = models.CharField(blank=True, null=True, max_length=4)
    numero = models.CharField(blank=True, null=True, max_length=5)
    denominatore = models.IntegerField(blank=True, null=True)
    subalterno = models.CharField(blank=True, null=True, max_length=4)
    edificialita = models.CharField(blank=True, null=True, max_length=1)  # todo: fare un choice

    task_id = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'identificativi_immobiliari'
        verbose_name_plural = 'Identificativi immobiliari'
        verbose_name = 'Identificativo immobiliare'
        unique_together = ('id_immobile', 'progressivo', 'codice_comune', 'sezione_urbana', 'sezione', 'foglio',
                          'numero', 'denominatore', 'subalterno')


class Indirizzi(models.Model):

    id_immobile = models.IntegerField()
    progressivo = models.IntegerField(blank=True, null=True)
    codice_comune = models.CharField(blank=True, null=True, max_length=4)
    sezione = models.CharField(max_length=1, null=True, blank=True)

    toponimo = models.IntegerField(blank=True, null=True)
    indirizzo = models.CharField(blank=True, null=True, max_length=50)
    civico_1 = models.CharField(blank=True, null=True, max_length=6)
    civico_2 = models.CharField(blank=True, null=True, max_length=6)
    civico_3 = models.CharField(blank=True, null=True, max_length=6)
    codice_strada = models.IntegerField(blank=True, null=True)

    task_id = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'indirizzi'
        verbose_name_plural = 'Indirizzi'
        verbose_name = 'Indirizzo'


class UtilitaComuniUI(models.Model):

    id_immobile = models.IntegerField()
    progressivo = models.IntegerField(blank=True, null=True)
    codice_comune = models.CharField(blank=True, null=True, max_length=4)
    sezione = models.CharField(max_length=1, null=True, blank=True)

    sezione_urbana = models.CharField(blank=True, null=True, max_length=3)
    foglio = models.CharField(blank=True, null=True, max_length=4)
    numero = models.CharField(blank=True, null=True, max_length=5)
    denominatore = models.IntegerField(blank=True, null=True)
    subalterno = models.CharField(blank=True, null=True, max_length=4)

    task_id = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'utilita_comuni_ui'
        verbose_name_plural = 'Utilità comuni UI'
        verbose_name = 'Utilità comune UI'


class RiserveUI(models.Model):

    id_immobile = models.IntegerField()
    progressivo = models.IntegerField(blank=True, null=True)
    codice_comune = models.CharField(blank=True, null=True, max_length=4)
    sezione = models.CharField(max_length=1, null=True, blank=True)

    codice_riserva = models.CharField(blank=True, null=True, max_length=1)
    partita_iscrizione_riserva = models.CharField(blank=True, null=True, max_length=7)

    task_id = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'riserve_ui'
        verbose_name_plural = 'Riserve UI'
        verbose_name = 'Riserva UI'


class CaratteristicheParticella(models.Model):
    """
    Modello per Terreni
    """

    id_particella = models.IntegerField()
    progressivo = models.IntegerField(blank=True, null=True)
    codice_comune = models.CharField(blank=True, null=True, max_length=4)
    sezione = models.CharField(max_length=1, null=True, blank=True)
    edificialita = models.CharField(blank=True, null=True, max_length=1)  # todo: fare un choice
    qualita = models.ForeignKey(QualitaTerreni, db_column='qualita', on_delete=models.CASCADE)
    classe = models.CharField(blank=True, null=True, max_length=2)

    ettari = models.IntegerField(blank=True, null=True)
    are = models.IntegerField(blank=True, null=True)
    centiare = models.IntegerField(blank=True, null=True)
    flag_reddito = models.CharField(choices=TERRENO_REDDITO, blank=True, null=True, max_length=1)
    flag_porzione = models.CharField(choices=TERRENO_PORZIONE, blank=True, null=True, max_length=1)
    flag_deduzioni = models.CharField(choices=TERRENO_DEDUZIONI, blank=True, null=True, max_length=1)

    reddito_dominicale = models.BigIntegerField(blank=True, null=True)
    reddito_agrario = models.BigIntegerField(blank=True, null=True)
    reddito_dominicale_euro = models.DecimalField(max_digits=12, decimal_places=3, blank=True, null=True)
    reddito_agrario_euro = models.DecimalField(max_digits=11, decimal_places=3, blank=True, null=True)

    partita = models.CharField(blank=True, null=True, max_length=7)
    annotazione = models.CharField(blank=True, null=True, max_length=800)
    id_mutazionale_iniziale = models.IntegerField(blank=True, null=True)
    id_mutazionale_finale = models.IntegerField(blank=True, null=True)

    task_id = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'caratteristiche_particella'
        verbose_name_plural = 'Caratteristiche particelle'
        verbose_name = 'Caratteristiche particella'


class Particella(models.Model):

    cadastre_objects = CadastreManager()
    objects = models.Manager()

    id_particella = models.IntegerField()
    progressivo = models.IntegerField(blank=True, null=True)
    codice_comune = models.CharField(blank=True, null=True, max_length=4)
    sezione = models.CharField(max_length=1, null=True, blank=True)

    foglio = models.CharField(blank=True, null=True, max_length=4)
    numero = models.CharField(blank=True, null=True, max_length=5)
    denominatore = models.IntegerField(blank=True, null=True)
    subalterno = models.CharField(blank=True, null=True, max_length=4)

    task_id = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'particella'
        verbose_name_plural = 'Particelle'
        verbose_name = 'Particella'
        unique_together = ('id_particella', 'progressivo', 'codice_comune', 'sezione', 'foglio',
                           'numero', 'denominatore', 'subalterno')

    @classmethod
    def area(cls, codice_comune, foglio, numero, sezione=None):
        """
        Calculate area value from CaratteristicheParticella

        :param codice_comune: ISTAT codice comune
        :param foglio: zfill(4) cadastre parcel sheet
        :param numero: zfill(5) cadastre parcel
        :param sezione: one string cadastre section
        :return: None if Particella or CaratteristicheParticella Instance found, CaratteristicaParticella area in mq
        """

        try:
            particella = cls.objects.get(codice_comune=codice_comune, foglio=foglio, numero=numero, sezione=sezione)
            carateristica_particella = CaratteristicheParticella.objects.get(id_particella=particella.id_particella)

            return carateristica_particella.ettari * 10000 + \
                   carateristica_particella.are * 100 + \
                   carateristica_particella.centiare

        except ObjectDoesNotExist as e:
            logger.error(f"Particella area: {e}")
            return None


class DeduzioniParticella(models.Model):

    id_particella = models.IntegerField()
    progressivo = models.IntegerField(blank=True, null=True)
    codice_comune = models.CharField(blank=True, null=True, max_length=4)
    sezione = models.CharField(max_length=1, null=True, blank=True)

    simbolo = models.CharField(blank=True, null=True, max_length=6)  # todo:: agggiunger choice or table foreign key

    task_id = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'deduzioni_particella'
        verbose_name_plural = 'Deduzioni particelle'
        verbose_name = 'Deduzione particella'


class RiserveParticella(models.Model):

    id_particella = models.IntegerField()
    progressivo = models.IntegerField(blank=True, null=True)
    codice_comune = models.CharField(blank=True, null=True, max_length=4)
    sezione = models.CharField(max_length=1, null=True, blank=True)

    codice = models.CharField(blank=True, null=True, max_length=1)
    partita = models.CharField(blank=True, null=True, max_length=7)

    task_id = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'riserve_particella'
        verbose_name_plural = 'Riserve particelle'
        verbose_name = 'Riserva particella'


class PorzioniParticella(models.Model):

    id_particella = models.IntegerField()
    progressivo = models.IntegerField(blank=True, null=True)
    codice_comune = models.CharField(blank=True, null=True, max_length=4)
    sezione = models.CharField(max_length=1, null=True, blank=True)

    id_porzione = models.CharField(blank=True, null=True, max_length=2)
    qualita = models.ForeignKey(QualitaTerreni, db_column='qualita', on_delete=models.CASCADE)
    classe = models.CharField(blank=True, null=True, max_length=2)
    ettari = models.IntegerField(blank=True, null=True)
    are = models.IntegerField(blank=True, null=True)
    centiare = models.IntegerField(blank=True, null=True)

    task_id = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'porzioni_particella'
        verbose_name_plural = 'Porzioni particelle'
        verbose_name = 'Porzione particella'


class PersonaFisica(models.Model):

    cadastre_objects = CadastreManager()
    objects = models.Manager()

    id_soggetto = models.BigIntegerField(primary_key=True)
    codice_comune = models.CharField(blank=True, null=True, max_length=4)

    cognome = models.CharField(blank=True, null=True, max_length=50)
    nome = models.CharField(blank=True, null=True, max_length=50)
    sesso = models.CharField(choices=SESSO, blank=True, null=True, max_length=1)
    data_nascita = models.DateField('Data di nascita', blank=True, null=True)
    luogo_nascita = models.CharField('Luogo di nascita', blank=True, null=True, max_length=255)
    codice_fiscale = models.CharField(blank=True, null=True, max_length=16)
    indicazioni_supplementari = models.CharField(blank=True, null=True, max_length=100)

    task_id = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'persona_fisica'
        verbose_name_plural = 'Persone fisiche'
        verbose_name = 'Persona fisica'
        unique_together = ('id_soggetto', 'codice_comune', 'luogo_nascita')


class PersonaGiuridica(models.Model):

    cadastre_objects = CadastreManager()
    objects = models.Manager()

    id_soggetto = models.BigIntegerField(primary_key=True)
    codice_comune = models.CharField(blank=True, null=True, max_length=4)

    denominazione = models.CharField(blank=True, null=True, max_length=150)
    sede = models.CharField(blank=True, null=True, max_length=255)
    codice_fiscale_piva = models.CharField(blank=True, null=True, max_length=11)

    task_id = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'persona_giuridica'
        verbose_name_plural = 'Persone giuridiche'
        verbose_name = 'Persona giuridica'
        unique_together = ('id_soggetto', 'codice_comune', 'sede')


class Titolarita(models.Model):

    id_immobile = models.IntegerField(null=True, blank=True)
    id_particella = models.IntegerField(null=True, blank=True)
    codice_comune = models.CharField(blank=True, null=True, max_length=4)
    sezione = models.CharField(max_length=1, null=True, blank=True)
    id_soggetto = models.BigIntegerField()

    codice_diritto = models.ForeignKey(CodiciDiritto, db_column='codice_diritto', on_delete=models.CASCADE)
    titolo_non_codificato = models.CharField(blank=True, null=True, max_length=200)

    quota_numeratore = models.IntegerField(blank=True, null=True)
    quota_denominatore = models.IntegerField(blank=True, null=True)
    regime = models.CharField(choices=TIPO_REGIME, blank=True, null=True, max_length=1)

    soggetto_riferimento = models.CharField('Soggetto di riferimento', blank=True, null=True, max_length=255)

    id_mutazionale_iniziale = models.IntegerField(blank=True, null=True)
    id_mutazionale_finale = models.IntegerField(blank=True, null=True)

    tipo_soggetto = models.CharField(choices=TIPO_SOGGETTO, blank=True, null=True, max_length=1)
    tipo_fornitura = models.CharField(max_length=1)

    task_id = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'titolarita'
        verbose_name_plural = 'Titolarità'
        verbose_name = 'Titolarità'


class RelazioneFabbricatiDOCFA(models.Model):

    protocollo =  models.CharField(max_length=255, null=True, blank=True)
    codice_comune = models.CharField(blank=True, null=True, max_length=4)
    sezione = models.CharField(max_length=1, null=True, blank=True)
    sezione_urbana = models.CharField(blank=True, null=True, max_length=3)
    foglio = models.CharField(blank=True, null=True, max_length=4)
    numero = models.CharField(blank=True, null=True, max_length=5)
    denominatore = models.IntegerField(blank=True, null=True)

    task_id = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'relazione_fabbricati_docfa'
        verbose_name_plural = 'Relazioni fabbricati DOCFA'
        verbose_name = 'Relazione fabbricati DOCFA'


class RelazioneUiuDOCFA(models.Model):
    protocollo = models.CharField(max_length=255)
    id_uiu = models.IntegerField() # id_immobile
    codice_comune_uiu = models.CharField(blank=True, null=True, max_length=4)
    sezione_uiu = models.ForeignKey(SezioniCensuarie, db_column='sezione', null=True, blank=True,
                                    on_delete=models.SET_NULL)

    task_id = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'relazione_uiu_docfa'
        verbose_name_plural = 'Relazioni uiu DOCFA'
        verbose_name = 'Relazione uiu DOCFA'


class DatiMDOCFA(models.Model):

    docfa = models.CharField(max_length=255)
    id_uiu = models.IntegerField()  # id_immobile
    codice_comune_uiu = models.CharField(blank=True, null=True, max_length=4)
    sezione_uiu = models.ForeignKey(SezioniCensuarie, db_column='sezione', null=True, blank=True,
                                    on_delete=models.SET_NULL)
    progressivo_poligono = models.IntegerField()
    ambiente = models.CharField(max_length=1)
    superficie = models.CharField(max_length=255)
    altezza = models.CharField(max_length=255)
    altezza_max = models.CharField(max_length=255, null=True, blank=True)

    task_id = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'dati_m_docfa'
        verbose_name_plural = 'Dati M DOCFA'
        verbose_name = 'Dato M DOCFA'


class DOCFA(models.Model):
    protocollo = models.CharField(max_length=255)
    path = models.TextField()
    path_pdf = models.TextField()
    fornitura = models.CharField(max_length=255)
    data_registrazione = models.DateField(null=True, blank=True)
    periodo = models.CharField(max_length=255)

    task_id = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'docfa'
        verbose_name_plural = 'DOCFA'
        verbose_name = 'DOCFA'


class Planimetrie(models.Model):
    """
    Planimetrie by docfa
    """
    nome_file = models.CharField(max_length=255)
    numero = models.TextField()
    is_elaborato = models.IntegerField()
    docfa = models.CharField(max_length=255)
    id_uiu = models.IntegerField(null=True, blank=True)
    formato = models.CharField(max_length=255)
    scala = models.CharField(max_length=255)
    path = models.TextField()

    task_id = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'planimetrie'
        verbose_name_plural = 'Planimetrie'
        verbose_name = 'Planimetria'


class PlanimetrieIniziali(models.Model):
    """
    Planimetrie acquistate dalla Agenzia delle Entrate
    """

    codice_comune = models.CharField(max_length=4)
    codice_generico = models.IntegerField(blank=True, null=True)
    foglio = models.CharField(max_length=4)
    numero = models.CharField(max_length=5)
    sezione = models.ForeignKey(SezioniCensuarie, db_column='sezione', null=True, blank=True, on_delete=models.SET_NULL)
    subalterno = models.CharField(null=True, max_length=4)
    nome_file = models.TextField()

    class Meta:
        db_table = 'planimetrie_iniziali'
        verbose_name_plural = 'Planimetrie iniziali'
        verbose_name = 'Planimetria iniziale'


class Prm(TimeStampedModel):
    """
    Modello che contiene i dati del file informativo PRM
    """

    codice_comune = models.CharField(max_length=10)
    tipo_fornitura = models.CharField(max_length=5)
    descrizione = models.CharField(max_length=255, null=True, blank=True)
    is_aggiornamento = models.BooleanField(default=True)
    n_record = models.IntegerField()
    file = models.FileField(upload_to='prm_files')
    data_richiesta = models.DateField()
    data_elaborazione = models.DateField()
    data_selezione = models.DateField()
    data_registrazione = models.DateField(null=True, blank=True)
    fogli_estratti = models.CharField(max_length=255)
    task_id = models.CharField(max_length=255)

    class Meta:
        ordering = ['-created']
        verbose_name_plural = 'PRM'
        verbose_name = 'PRM'


class ImportDOCFA(TimeStampedModel):
    """
    Importazioni docfa
    """

    nome_fornitura = models.CharField(max_length=255)
    codice_comune = models.CharField(max_length=4, null=True, blank=True)
    data_elaborazione = models.DateField(null=True, blank=True)
    n_record = models.IntegerField(null=True, blank=True)
    n_docfa = models.IntegerField(null=True, blank=True)
    n_planimetrie = models.IntegerField(null=True, blank=True)
    file = models.FileField(upload_to='docfa_files')
    task_id = models.CharField(max_length=255)

    class Meta:
        ordering = ['-created']
        verbose_name_plural = 'Import DOCFA'
        verbose_name = 'Import DOCFA'


# configuration tables, on default database (g3w-admin)
class Config(models.Model):
    """
    Model for config cadastre module
    """
    project = models.ForeignKey(Project, models.CASCADE, related_name="%(app_label)s_%(class)s_related")
    codice_comune = models.CharField(max_length=4, blank=False)

    @staticmethod
    def getData(project_id):
        try:
            return Config.objects.filter(project_id=project_id)[0]
        except IndexError:
            return None

    def __getattribute__(self, attr):
        if attr == 'viewers':
            return get_users_for_object(self.project, 'edit_cadastre_association', [G3W_VIEWER1, G3W_VIEWER2],
                                                       with_anonymous=False)
        if attr == 'viewer_user_groups':
            return get_groups_for_object(self.project, 'edit_cadastre_association', grouprole='viewer')

        return super(Config, self).__getattribute__(attr)

    def setPermissionToEditor(self):
        """ Check and give or remove permission to editor level 1 and editor level 2"""

        currentEditor = get_users_for_object(self.project, 'change_project', [G3W_EDITOR1, G3W_EDITOR2],
                                             with_anonymous=False)
        currentEditorPermission = get_users_for_object(self.project, 'edit_cadastre_association', [G3W_EDITOR1, G3W_EDITOR2],
                                                       with_anonymous=False)
        permissionEditorToRemove = list(set(currentEditorPermission) - set(currentEditor))

        if len(currentEditor) > 0 :
            for ce in currentEditor:
                setPermissionUserObject(ce, self.project, ['edit_cadastre_association'])
        if len(permissionEditorToRemove):
            for per in permissionEditorToRemove:
                setPermissionUserObject(per, self.project, ['edit_cadastre_association'], mode='remove')

    def set_permissions_to_editor_user_groups(self):
        """ Check and giv or remove permission to editor groups """

        # current editor user groups with change permission on project
        currentEditorGroup = get_groups_for_object(self.project, 'change_project', grouprole='editor')

        currentEditorGroupPermission = get_groups_for_object(self.project, 'edit_cadastre_association',
                                                             grouprole='editor')
        permissionEditorGroupToRemove = list(set(currentEditorGroupPermission) - set(currentEditorGroup))

        if len(currentEditorGroup) > 0 :
            for ceg in currentEditorGroup:
                setPermissionUserObject(ceg, self.project, ['edit_cadastre_association'])
        if len(permissionEditorGroupToRemove):
            for pegr in permissionEditorGroupToRemove:
                setPermissionUserObject(pegr, self.project, permissions=['edit_cadastre_association'],
                                        mode='remove')

    def addPermissionsToViewers(self, users_id):

        for user_id in users_id:
            setPermissionUserObject(User.objects.get(pk=user_id), self.project,
                                    permissions='qdjango.edit_cadastre_association')

    def removePermissionsToViewers(self, users_id=None):

        for user_id in users_id:
            setPermissionUserObject(User.objects.get(pk=user_id), self.project,
                            permissions='edit_cadastre_association', mode='remove')

    def add_permissions_to_viewer_user_groups(self, groups_id):
            self._permissions_to_user_groups_viewer(groups_id=groups_id)

    def remove_permissions_to_viewer_user_groups(self, groups_id):
            self._permissions_to_user_groups_viewer(groups_id=groups_id, mode='remove')

    def _permissions_to_user_groups_viewer(self, groups_id, mode='add'):

        for group_id in groups_id:
            auth_group = AuthGroup.objects.get(pk=group_id)
            setPermissionUserObject(auth_group, self.project, permissions=['edit_cadastre_association'],
                                    mode=mode)


class ConfigLayer(models.Model):
    """Config layer"""

    config = models.ForeignKey(Config, on_delete=models.CASCADE)
    layer = models.ForeignKey(Layer, on_delete=models.CASCADE)


class IstatCodiciUi(models.Model):
    codice_regione = models.CharField(max_length=255, blank=True, null=True)
    codice_citta_metropolitana = models.CharField(max_length=255, blank=True, null=True)
    codice_provincia_1 = models.CharField(max_length=255, blank=True, null=True)
    progressivo_del_comune_2 = models.CharField(max_length=255, blank=True, null=True)
    codice_comune_formato_alfanumerico = models.CharField(max_length=255, blank=True, null=True)
    denominazione_in_italiano = models.CharField(max_length=255, blank=True, null=True)
    denominazione_in_tedesco = models.CharField(max_length=255, blank=True, null=True)
    codice_ripartizione_geografica = models.CharField(max_length=255, blank=True, null=True)
    ripartizione_geografica = models.CharField(max_length=255, blank=True, null=True)
    denominazione_regione = models.CharField(max_length=255, blank=True, null=True)
    denominazione_citta_metropolitana = models.CharField(max_length=255, blank=True, null=True)
    denominazione_provincia = models.CharField(max_length=255, blank=True, null=True)
    flag_comune_capoluogo_di_provincia = models.CharField(max_length=255, blank=True, null=True)
    sigla_automobilistica = models.CharField(max_length=255, blank=True, null=True)
    codice_comune_formato_numerico = models.CharField(primary_key=True, max_length=255)
    codice_comune_numerico_con_107_province_dal_2006_al_2009 = models.CharField(max_length=255, blank=True, null=True)
    codice_comune_numerico_con_103_province_dal_1995_al_2005 = models.CharField(max_length=255, blank=True, null=True)
    codice_catastale_del_comune = models.CharField(max_length=255, blank=True, null=True)
    popolazione_legale_2011_09_10_2011 = models.CharField(max_length=255, blank=True, null=True)
    codice_nuts1_2010 = models.CharField(max_length=255, blank=True, null=True)
    codice_nuts2_2010_3 = models.CharField(max_length=255, blank=True, null=True)
    codice_nuts3_2010 = models.CharField(max_length=255, blank=True, null=True)
    codice_nuts1_2006 = models.CharField(max_length=255, blank=True, null=True)
    codice_nuts2_2006_3 = models.CharField(max_length=255, blank=True, null=True)
    codice_nuts3_2006 = models.CharField(max_length=255, blank=True, null=True)

    def __unicode__(self):
        return self.codice_catastale_del_comune

    class Meta:
        managed = True
        db_table = 'istat_codici_ui'
        verbose_name_plural = 'ISTAT Codici UI'
        verbose_name = 'ISTAT Codici UI'


class ImportCatasto(TimeStampedModel):
    """
    Imports gemetric cadastre data
    """

    codice_comune = models.CharField(max_length=4, null=True, blank=True)
    n_file = models.IntegerField(null=True, blank=True)
    fogli = models.TextField(null=True, blank=True)
    file = models.FileField(upload_to='catasto_files')
    sup_data = models.TextField(null=True)
    task_id = models.CharField(max_length=255)

    class Meta:
        ordering = ['-created']
        verbose_name_plural = 'Import Geometric Cadastre'
        verbose_name = 'Import Geometric Cadastre'


class Catasto(models.Model):
    """
    Model for cadastre geometric data
    """
    gid = models.AutoField(primary_key=True)
    codice_comune = models.CharField(max_length=4, blank=False)
    sezione = models.CharField(max_length=1, null=True, blank=True)
    foglio = models.CharField(blank=True, null=True, max_length=4)
    numero = models.CharField(blank=True, null=True, max_length=5)
    tipo = models.CharField(blank=True, null=True, max_length=1)
    nomefile = models.CharField(blank=True, null=True, max_length=11)
    sez = models.CharField(blank=True, null=True, max_length=1)
    #data_ini = models.DateTimeField(blank=True, null=True)
    #data_fin = models.DateTimeField(blank=True, null=True)
    task_id = models.CharField(max_length=255, null=True)
    the_geom = models.PolygonField(srid=settings.CADASTRE_DATA_SRID, blank=True, null=True)

    class Meta:
        db_table = 'catasto'


class TransformCatasto(models.Model):
    """
    Model for catasto trasform operation
    """

    foglio = models.CharField(max_length=255)
    transform = models.TextField()


class ConfigUserCadastre(models.Model):
    """
    Model for save Editor1 User can add censuario and cxf data
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    codice_comune = models.CharField(_('Municipy code'), max_length=4, blank=False)

    def set_permission_add_prm(self):
        """
        Add permission add_prm to self user
        """
        assign_perm('cadastre.add_prm', self.user)
        assign_perm('cadastre.add_importcatasto', self.user)
        assign_perm('cadastre.add_importdocfa', self.user)

    def remove_permission_add_prm(self):
        """
        Remove permission add_prm to self user
        """
        remove_perm('cadastre.add_prm', self.user)
        remove_perm('cadastre.add_importcatasto', self.user)
        remove_perm('cadastre.add_importdocfa', self.user)


class ConfigImportCxf(models.Model):
    """
    Model for db data for cxf DB table
    """

    codice_comune = models.CharField(_('Municipy code'), max_length=4, blank=False, unique=True)
    provider = models.CharField(_('DB Provider'), choices=CXF_DB_PROVIDERS, max_length=40, blank=False,
                                default='postgresql')
    db_host = models.CharField(_('Ip or host DB'), max_length=255)
    db_port = models.IntegerField(_('Port DB'), default=5432)
    db_name = models.CharField(_('DB name'), max_length=255)
    db_schema = models.CharField(_('DB schema'), max_length=255, default='public')
    db_table = models.CharField(_('DB table'), max_length=255)
    db_user = models.CharField(_('DB user'), max_length=255)
    db_password = models.CharField(_('DB password'), max_length=255)
    srid = models.ForeignKey(G3WSpatialRefSys, db_column='srid', null=True, on_delete=models.SET_NULL)
    transform = models.BooleanField(_('Apply transformation (for CRS)'), default=True)

    def conn(self):
        """
        Return connection dict
        """

        return model_to_dict(self)


        #
        # return {
        #     'HOST': self.db_host,
        #     'NAME': self.db_name,
        #     'SCHEMA': self.db_schema,
        #     'PORT': self.db_port,
        #     'TABLE': self.db_table,
        #     'USER': self.db_user,
        #     'PASSWORD': self.db_password,
        #     'SRID': self.srid.srid,
        # }


class CadastreDataAccessLog(models.Model):
    """
    Model to log cadastre data access by users
    """
    created = AutoCreatedField()
    user = models.CharField(max_length=50, null=True, blank=True)
    type = models.CharField(max_length=10, null=True, blank=True)
    msg = models.TextField()
    #msg = JSONField()