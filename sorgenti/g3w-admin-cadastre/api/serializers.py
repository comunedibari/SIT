from django.core.exceptions import ObjectDoesNotExist
from django.urls import reverse
from django.db.models import Q
from rest_framework import serializers
from rest_framework.fields import empty, DateField
from collections import OrderedDict
from cadastre.models import *
from cadastre.utils.data import get_subalterni, get_comune_data
from collections import OrderedDict
import datetime

import logging

logger = logging.getLogger('module_cadastre')


class CatastoDateField(DateField):
    """
    Per le date che sonoinf formato sbagliato dal censuario: 00010101
    """

    def to_representation(self, value):
        try:
            return super(CatastoDateField, self).to_representation(value)
        except:
            try:
                if value == datetime.date(1, 1, 1):
                    raise Exception
                return '{0.day:02d}/{0.month:02d}/{0.year:4d}'.format(value)
            except:
                return None


class CatastoStadiSerializerMixin(object):

    def get_titolarita_serialized(self, titolarita, tipo_tit='F'):

        items_titolarita = {}
        for tito in titolarita:

            tito_data = TitolaritaSerializer(tito).data

            if not items_titolarita.get(tito.id_mutazionale_iniziale):
                items_titolarita[tito.id_mutazionale_iniziale] = {'soggetti': [tito_data]}
            else:
                items_titolarita[tito.id_mutazionale_iniziale]['soggetti'].append(tito_data)

            # add atti
            items_titolarita[tito.id_mutazionale_iniziale]['atti'] = []

            # atto iniziale
            items_titolarita[tito.id_mutazionale_iniziale]['atti'].append(
                DatiAttoSerializer(DatiAtto.objects.get(pk=tito.id_mutazionale_iniziale), tipo_tit=tipo_tit).data)

            # atto finale
            if tito.id_mutazionale_finale:
                items_titolarita[tito.id_mutazionale_iniziale]['atti'].append(
                    DatiAttoSerializer(DatiAtto.objects.get(pk=tito.id_mutazionale_finale), tipo_tit=tipo_tit).data)

        # reaorder by data_efficacia
        def order_func(o):
            try:
                return datetime.datetime.strptime(o[1]['atti'][0]['data_efficacia'], '%d/%m/%Y')
            except Exception as e:

                # i.e. 0001/01/01 date
                logger.error(f'Error on data_efficacia {e}')
                return datetime.datetime(1970, 1, 1)

        return OrderedDict(sorted(items_titolarita.items(), key=order_func, reverse=True))


class TipoTitSerilizerMixin(object):

    def __init__(self, instance=None, data=empty, **kwargs):
        if 'tipo_tit' in kwargs:
            self.tipoTit = kwargs['tipo_tit']
            del (kwargs['tipo_tit'])
        else:
            self.tipoTit = 'F'
        super(TipoTitSerilizerMixin, self).__init__(instance, data, **kwargs)


class TerreniSerializerMixin(serializers.Serializer):

    superficie = serializers.SerializerMethodField()
    qualita = serializers.SerializerMethodField()


    def get_superficie(self, instance):
        superficie = []
        if instance.ettari != 0:
            superficie.append("{} ha".format(instance.ettari))
        if instance.are != 0:
            superficie.append("{} are".format(instance.are))
        if instance.centiare != 0:
            superficie.append("{} ca".format(instance.centiare))

        return " ".join(superficie)

    def get_qualita(self, instance):
        return str(instance.qualita)


class DatiAttoSerializer(TipoTitSerilizerMixin, serializers.ModelSerializer):

    descrizione_nota = serializers.SerializerMethodField()
    data_efficacia = CatastoDateField(format="%d/%m/%Y")
    data_registrazione = CatastoDateField(format="%d/%m/%Y")

    def get_data_efficacia(self, instance):
        return None

    def get_descrizione_nota(self, instance):

        try:
            tnota = TipiNota.objects.get(tipo=self.tipoTit, nota=instance.tipo_nota).descrizione
            return tnota
        except ObjectDoesNotExist:
            return None

    class Meta:
        model = DatiAtto
        fields = (
            'tipo_nota',
            'anno_nota',
            'numero_nota',
            'progressivo_nota',
            'codice_casuale',
            'descrizione_casuale',
            'descrizione_nota',
            'data_efficacia',
            'data_registrazione'
        )


class PorzioniParticellaSerializer(TerreniSerializerMixin, serializers.ModelSerializer):

    class Meta:
        model = PorzioniParticella
        fields = (
            'qualita',
            'classe',
            'superficie'
        )


class DeduzioniParticellaSerializer(TerreniSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = DeduzioniParticella
        fields = (
            'simbolo',
        )


class CaratteristicheParticellaSerializer(TerreniSerializerMixin, serializers.ModelSerializer):

    deduzioni = serializers.SerializerMethodField()
    porzioni = serializers.SerializerMethodField()
    reddito_dominicale = serializers.DecimalField(source='reddito_dominicale_euro', max_digits=12, decimal_places=3,
                                                  coerce_to_string=False)
    reddito_agrario = serializers.DecimalField(source='reddito_agrario_euro', max_digits=11, decimal_places=3,
                                                  coerce_to_string=False)

    def get_deduzioni(self, instance):
        return instance.get_flag_deduzioni_display()

    def get_porzioni(self, instance):
        return instance.get_flag_porzione_display()


    class Meta:
        model = CaratteristicheParticella
        fields = (
            'superficie',
            'qualita',
            'classe',
            'deduzioni',
            'porzioni',
            'reddito_dominicale',
            'reddito_agrario',
        )


class PersonaFisicaSerializer(serializers.ModelSerializer):

    data_nascita = serializers.SerializerMethodField()

    def get_data_nascita(self, instance):
        return '{0.day:02d}/{0.month:02d}/{0.year:4d}'.format(instance.data_nascita) if instance.data_nascita else None

    def to_representation(self, instance):
        ret = super(PersonaFisicaSerializer, self).to_representation(instance)

        # todo: da mnodificare una volta carcata tabella comuni
        # add comune
        del(ret['luogo_nascita'])
        comune_data = get_comune_data(instance.luogo_nascita)
        ret['nome_comune'] = comune_data['nome_comune']
        ret['nome_provincia'] = comune_data['nome_provincia']

        ret['tipo_soggetto'] = 'F'
        return ret

    class Meta:
        model = PersonaFisica
        exclude = (
            'task_id',
            'id_soggetto',
            'sesso'
        )


class PersonaGiuridicaSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        ret = super(PersonaGiuridicaSerializer, self).to_representation(instance)

        # todo: da mnodificare una volta carcata tabella comuni
        # add comune
        comune_data = get_comune_data(instance.sede)

        ret['nome_comune'] = comune_data['nome_comune']
        ret['nome_provincia'] = comune_data['nome_provincia']
        del(ret['codice_fiscale_piva'])
        ret['codice_fiscale'] = instance.codice_fiscale_piva

        ret['tipo_soggetto'] = 'G'
        return ret

    class Meta:
        model = PersonaGiuridica
        exclude = (
            'task_id',
            'id_soggetto'
        )


class TitolaritaSerializer(TipoTitSerilizerMixin, serializers.ModelSerializer):

    soggetto = serializers.SerializerMethodField()
    soggetto_riferimento = serializers.SerializerMethodField()
    codice_diritto = serializers.SerializerMethodField()
    regime = serializers.SerializerMethodField()

    def get_regime(self, instance):
        return instance.get_regime_display()

    def get_codice_diritto(self, instance):
        return instance.codice_diritto.descrizione

    def get_soggetto_riferimento(self, instance):

        if instance.regime:
            try:
                if instance.soggetto_riferimento:
                    pfisica = PersonaFisica.objects.get(pk=int(instance.soggetto_riferimento))
                    return PersonaFisicaSerializer(pfisica).data
                else:
                    return None
            except ObjectDoesNotExist:
                return None
        else:
            if instance.soggetto_riferimento == '0':
                return None
            else:
                return instance.soggetto_riferimento

    def get_soggetto(self, instance):

        if instance.tipo_soggetto == 'G':
            try:
                pgiuridica = PersonaGiuridica.objects.get(pk=instance.id_soggetto)
                return PersonaGiuridicaSerializer(pgiuridica).data
            except ObjectDoesNotExist:
                return None
        else:
            try:
                pfisica = PersonaFisica.objects.get(pk=instance.id_soggetto)
                return PersonaFisicaSerializer(pfisica).data
            except ObjectDoesNotExist:
                return None



    class Meta:
        model = Titolarita
        fields = (
            'codice_diritto',
            'soggetto',
            'soggetto_riferimento',
            'regime',
            'quota_numeratore',
            'quota_denominatore',
            'id_mutazionale_iniziale',
            'id_mutazionale_finale'
        )


class ParticellaMiniSerializer(serializers.ModelSerializer):
    """
    Versione ridotta della serializer particella che serve per la prima schermata dei terreni
    """

    def to_representation(self, instance):
        ret = super(ParticellaMiniSerializer, self).to_representation(instance)

        # get partita from caratteristica particella:
        cara_particella = CaratteristicheParticella.objects.get(id_particella=instance.id_particella,
                                                                progressivo=instance.progressivo)

        # get partita if cod exist
        try:
            partita = CodiciPartita.objects.get(partita=cara_particella.partita, tipo='T')

            ret['partita'] = {
                'valore': partita.partita,
                'descrizione': partita.descrizione
            }

        except:
            pass

        return ret

    class Meta:
        model = Particella
        exclude = (
            'id',
            'task_id',
            'codice_comune'
        )


class ParticellaSerializer(CatastoStadiSerializerMixin, serializers.ModelSerializer):

    def _get_cara_particelle(self, data, progressivi):
        cara_particelle = CaratteristicheParticella.objects.filter(progressivo__in=progressivi, **data)

        return {cara_particella.progressivo:cara_particella for cara_particella in cara_particelle}

    def _get_deduzioni(self, data, progressivi):
        deduzioni = DeduzioniParticella.objects.filter(progressivo__in=progressivi, **data)

        toRet = {}
        for deduzione in deduzioni:
            if not toRet.get(deduzione.progressivo):
                toRet[deduzione.progressivo] = [deduzione]
            else:
                toRet[deduzione.progressivo].append(deduzione)
        return toRet

    def _get_porzioni_particelle(self, data, progressivi):
        porzioni_particelle = PorzioniParticella.objects.filter(progressivo__in=progressivi, **data)
        toRet = {}
        for porzione_particella in porzioni_particelle:
            if not toRet.get(porzione_particella.progressivo):
                toRet[porzione_particella.progressivo] = [porzione_particella]
            else:
                toRet[porzione_particella.progressivo].append(porzione_particella)
        return toRet

    def _get_dati_atto(self, cara_particelle):
        id_atti = []
        for cara_particella in cara_particelle.values():
            if not cara_particella.id_mutazionale_iniziale in id_atti:
                id_atti.append(cara_particella.id_mutazionale_iniziale)
            if not cara_particella.id_mutazionale_finale in id_atti:
                id_atti.append(cara_particella.id_mutazionale_finale)
        dati_atto = DatiAtto.objects.filter(id__in=id_atti)
        return {dato_atto.id:dato_atto for dato_atto in dati_atto}

    def _get_progressivi_particelle(self, data):
        particelle = Particella.objects.order_by('-progressivo').filter(**data)

        return OrderedDict({particella.progressivo: particella
                            for particella in particelle})

    def to_representation(self, instance):

        data = instance.as_dict()

        # remove project_id from instance
        del (data['project_id'])

        particelle = self._get_progressivi_particelle(data)
        progressivi = particelle.keys()
        #progressivi = range(1, particella.progressivo)
        cara_particelle = self._get_cara_particelle(data, progressivi)
        deduzioni_particelle = self._get_deduzioni(data, progressivi)
        porzioni_particelle = self._get_porzioni_particelle(data, progressivi)
        dati_atto = self._get_dati_atto(cara_particelle)

        toRes = {
            'stadi': {
                'title': 'Stadi del terreno',
                'items': []
            },
            'titolari': {
                'title': 'Titolari per data',
                'items': []
            }
        }

        # fill stadi:
        for progressivo, particella in particelle.items():
            item = {
                'progressivo': particella.progressivo
            }
            cara_particella = cara_particelle[particella.progressivo]
            cara_particella_data = CaratteristicheParticellaSerializer(cara_particella).data
            item.update(cara_particella_data)

            # add porzioni
            if particella.progressivo in porzioni_particelle.keys():
                porzioni_particelle_data = PorzioniParticellaSerializer(porzioni_particelle[particella.progressivo],
                                                               many=True).data
                item.update({'porzioni': porzioni_particelle_data})
            else:
                item.update({'porzioni': []})

            # add deduzioni
            if particella.progressivo in deduzioni_particelle:
                deduzioni_particelle_data = DeduzioniParticellaSerializer(deduzioni_particelle[particella.progressivo],
                                                                        many=True).data
                item.update({'deduzioni': deduzioni_particelle_data})
            else:
                item.update({'deduzioni': []})

            # add dati atto

            item['atti'] = [DatiAttoSerializer(dati_atto[cara_particella.id_mutazionale_iniziale], tipo_tit='T').data]

            if cara_particella.id_mutazionale_finale in dati_atto:
                item['atti'].append(DatiAttoSerializer(dati_atto[cara_particella.id_mutazionale_finale],
                                                            tipo_tit='T').data)

            toRes['stadi']['items'].append(item)

        # build titolarita
        titolarita = Titolarita.objects.filter(**data).order_by('-id_mutazionale_iniziale')
        toRes['titolari']['items'] = self.get_titolarita_serialized(titolarita, 'T').values()

        return toRes


    class Meta:
        model = Particella


class UnitaImmobiliareMiniSerializer(serializers.ModelSerializer):

    rendita_euro = serializers.DecimalField(max_digits=18, decimal_places=2, coerce_to_string=False)
    consistenza = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)

    def to_representation(self, instance):

        ret = super(UnitaImmobiliareMiniSerializer, self).to_representation(instance)

        # add atti
        if instance.id_mutazionale_iniziale:
            ret['atti'] = [
                DatiAttoSerializer(DatiAtto.objects.get(pk=instance.id_mutazionale_iniziale), tipo_tit='F').data
            ]
        else:
            ret['atti'] = []

        if instance.id_mutazionale_finale:
            ret['atti'].append(DatiAttoSerializer(DatiAtto.objects.get(pk=instance.id_mutazionale_finale),
                                                       tipo_tit='F').data)

        # get partita if cod exist
        try:
            partita = CodiciPartita.objects.get(partita=ret['partita'], tipo='F')

            ret['partita'] = {
                'valore': partita.partita,
                'descrizione': partita.descrizione
            }

        except:
            pass

        return ret

    class Meta:
        model = UnitaImmobiliare
        exclude = (
            'task_id',
            'id',
            'id_immobile',
            'zona',
            'edificio',
            'scala',
            'lotto',
            'interno_1',
            'interno_2',
            'piano_1',
            'piano_2',
            'piano_3',
            'piano_4',
            'protocollo_notifica',
            'data_notifica',
            'annotazione',
            'sezione',
            'codice_comune',
            'rendita_lire'
        )


class IdentificativiImmobiliariSerializer(serializers.ModelSerializer):

    immobile = serializers.SerializerMethodField()

    def get_immobile(self, instance):

        # get unita immobiliare with progrssivo
        unita_immobiliare = UnitaImmobiliare.objects.get(id_immobile=instance.id_immobile,
                                                            progressivo=instance.progressivo)
        return UnitaImmobiliareMiniSerializer(unita_immobiliare).data

    def to_representation(self, instance):
        ret = super(IdentificativiImmobiliariSerializer, self).to_representation(instance)

        return ret

    class Meta:
        model = IdentificativiImmobiliari
        exclude = (
            'id',
            'task_id',
            'codice_comune'
        )


class FabbricatoSerializer(serializers.Serializer):

    foglio = serializers.CharField(max_length=4)
    numero = serializers.CharField(max_length=5)
    codice_comune = serializers.CharField(max_length=4)

    def to_representation(self, instance):

        data = instance.as_dict()
        ret = super(FabbricatoSerializer, self).to_representation(instance)

        # add subalterni
        subalterni = get_subalterni(**data)

        # get id_immobile
        #unita_immobiliari = _get_unitai_mmobiliari(id_immobili)
        ret['subalterni'] = IdentificativiImmobiliariSerializer(subalterni, many=True).data
        return ret


class TerrenoSerializer(serializers.Serializer):
    """
    Analogo di Fabbricato serializer ritorna i dati delle particelle all'interno del terreno
    """

    foglio = serializers.CharField(max_length=4)
    numero = serializers.CharField(max_length=5)
    sezione = serializers.CharField(max_length=1)

    codice_comune = serializers.CharField(max_length=4)

    def to_representation(self, instance):

        data = instance.as_dict()
        ret = super(TerrenoSerializer, self).to_representation(instance)

        # get id_immobiliari

        # add subalterni
        subalterni = get_subalterni(tipo='T', **data)

        # get id_immobile
        #unita_immobiliari = _get_unitai_mmobiliari(id_immobili)
        ret['subalterni'] = ParticellaMiniSerializer(subalterni, many=True).data
        return ret


class DatiMDOCFSSerializer(serializers.ModelSerializer):

    class Meta:
        model = DatiMDOCFA
        exclude = (
            'id',
            'id_uiu',
            'codice_comune_uiu',
            'sezione_uiu',
            'task_id'
        )


class UnitaImmobiliareSerializer(serializers.ModelSerializer):

    rendita_euro = serializers.DecimalField(max_digits=18, decimal_places=2, coerce_to_string=False)
    consistenza = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)

    def to_representation(self, instance):

        ret = super(UnitaImmobiliareSerializer, self).to_representation(instance)

        if instance.categoria:
            ret['descrizione_categoria'] = CategorieCatastali.objects.get(categoria=instance.categoria).descrizione
        else:
            ret['descrizione_categoria'] = None

        # add dati docf
        dati_m_docfa = DatiMDOCFA.objects.filter(id_uiu=instance.id_immobile)
        ret['dati_metrici'] = DatiMDOCFSSerializer(dati_m_docfa, many=True).data

        # add atti
        ret['atti'] = []
        if instance.id_mutazionale_iniziale:
            ret['atti'].append(DatiAttoSerializer(DatiAtto.objects.get(pk=instance.id_mutazionale_iniziale),
                                                  tipo_tit='F').data)

        if instance.id_mutazionale_finale:
            ret['atti'].append(DatiAttoSerializer(DatiAtto.objects.get(pk=instance.id_mutazionale_finale),
                                                  tipo_tit='F').data)
        return ret

    class Meta:
        model = UnitaImmobiliare
        exclude = (
            'task_id',
            'id',
            'id_immobile',
            'protocollo_notifica',
            'data_notifica',
            'annotazione',
            'sezione',
            'codice_comune',
            'rendita_lire'
        )


class ImmobileSerializer(CatastoStadiSerializerMixin, serializers.Serializer):

    id_immobile = serializers.IntegerField()
    codice_comune = serializers.CharField(max_length=4)
    project_id = serializers.IntegerField()

    def _get_unita_immobiliari(self, instance):
        unita_immobiliari = UnitaImmobiliare.objects.order_by('progressivo').filter(**instance)

        return OrderedDict({unita_immobiliare.progressivo: unita_immobiliare
                for unita_immobiliare in unita_immobiliari})

    def to_representation(self, instance):

        data = instance.as_dict()

        # remove project_id from instance
        del(data['project_id'])

        unita_immobiliari = self._get_unita_immobiliari(data)
        identificativo_immobiliare = IdentificativiImmobiliari.objects.filter(**data)[0]

        toRes = {
            'id_immobile': instance.id_immobile,
            'stadi': {
                'title': 'Stadi dell\'immobile',
                'items': []
            },
            'titolari': {
                'title': 'Titolari per data',
                'items': []
            },
            'docfa': {
                'title': 'Docfa e planimetrie',
                'items': []
            },
            'planimetrie_iniziali': {
                'title': 'Planimetrie iniziali',
                'items': []
            }
        }

        # fill stadi:
        for unita_immobiliare in unita_immobiliari.values():
            item = {
                'progressivo': unita_immobiliare.progressivo
            }

            item.update(UnitaImmobiliareSerializer(unita_immobiliare).data)
            toRes['stadi']['items'].append(item)

        # get docfa if present:
        relazioni_docfa = RelazioneUiuDOCFA.objects.filter(id_uiu=instance.id_immobile,
                                                           codice_comune_uiu=instance.codice_comune)
        for relazione_docfa in relazioni_docfa:
            try:
                docfa = DOCFA.objects.filter(~Q(path_pdf=''), protocollo=relazione_docfa.protocollo)[0]
                file = docfa.path_pdf.split('/')
                download_path = reverse('cadastre-docfa-pdf-serve', kwargs={'project_id': instance.project_id,
                                                                            'path': '/'.join(file[-2:])})
                item = {
                    'protocollo': docfa.protocollo,
                    'data_registrazione': docfa.data_registrazione,
                    'dati_m_docfa': [],
                    'planimetrie': [],
                    'download_pdf_path': download_path
                }
                dati_m_docfa = DatiMDOCFA.objects.filter(id_uiu=instance.id_immobile,
                                                         codice_comune_uiu=instance.codice_comune, docfa=docfa.protocollo)
                for dato_m_docfa in dati_m_docfa:
                    dati_m_docfa_item = {
                        'progressivo_poligono': dato_m_docfa.progressivo_poligono,
                        'ambiente': dato_m_docfa.ambiente,
                        'superficie': dato_m_docfa.superficie,
                        'altezza': dato_m_docfa.altezza,
                        'altezza_max': dato_m_docfa.altezza_max,
                    }
                    item['dati_m_docfa'].append(dati_m_docfa_item)

                planimetrie = Planimetrie.objects.filter(id_uiu=instance.id_immobile, docfa=docfa.protocollo)
                for planimetria in planimetrie:
                    file = planimetria.path.split('/')
                    download_path = reverse('cadastre-planimetrie-serve', kwargs={'project_id': instance.project_id,
                                                                                  'path': '/'.join(file[-2:])})
                    planimetria_item = {
                        'numero': planimetria.numero,
                        'is_elaborato': planimetria.is_elaborato,
                        'formato': planimetria.formato,
                        'scala': planimetria.scala,
                        'nome_file': planimetria.nome_file,
                        'download_path': download_path

                    }
                    item['planimetrie'].append(planimetria_item)
                toRes['docfa']['items'].append(item)
            except Exception as e:
                logger.error(f"Error on get DCFA {relazione_docfa.protocollo}")

        # get planimetrie_iniziali if present:

        planimetrie_iniziali = PlanimetrieIniziali.objects.filter(foglio=identificativo_immobiliare.foglio,
                                                                  numero=identificativo_immobiliare.numero,
                                                                  subalterno=identificativo_immobiliare.subalterno,
                                                                  codice_comune=instance.codice_comune)
        for pi in planimetrie_iniziali:
            if pi.nome_file.startswith('['):
                nome_file = eval(pi.nome_file)
            else:
                nome_file = [pi.nome_file]
            for nf in nome_file:
                download_path = reverse('cadastre-planimetrie-iniziali-serve', kwargs={'project_id': instance.project_id,
                                                                                       'path': nf})
                toRes['planimetrie_iniziali']['items'].append({
                    'nome_file': nf,
                    'download_path': download_path
                })


        # build titolarita
        titolarita = Titolarita.objects.filter(**data).order_by('id_mutazionale_iniziale')
        toRes['titolari']['items'] = self.get_titolarita_serialized(titolarita, 'F').values()
        return toRes


