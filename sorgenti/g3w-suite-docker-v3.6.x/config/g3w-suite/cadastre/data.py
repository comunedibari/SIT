from django.db import Error as DbError
from django.db import transaction, IntegrityError, connections
from django.core.exceptions import ObjectDoesNotExist
from django.conf import settings
from celery import states
from zipfile import ZipFile
import csv
import os
from cadastre.utils.structure import *
from cadastre.utils.cxfprovider import CXFDBProvider
from cadastre.models import *
import re
import time

from io import BytesIO


def get_name_planimetria(id_planimentria, numero):
    """
    Funzione per ricostruire il filename della planimetria
    """

    str_planimetria = ''
    if numero < 100:
        str_planimetria += '0'
    if numero < 10:
        str_planimetria += '0'
    return '{}.{}{}'.format(id_planimentria, str_planimetria, str(numero))


def comune_name_from_code(code):
    """
    From code comune get cleare nome and sezione name.
    :param code: 4/5 characters code
    :return: String with comumen name (and sezione name)
    """

    if len(code) == 5:
        comune_code = code[:-1]
        sezione_code = code[-1:]
    else:
        comune_code = code
        sezione_code = None

    # get comune name:
    comune_code = comune_code.upper()
    comune_name = IstatCodiciUi.objects.get(codice_catastale_del_comune=comune_code).denominazione_in_italiano

    if sezione_code:
        sezione = SezioniCensuarie.objects.get(codice_comune=comune_code, sezione=sezione_code)
        comune_name += ' ({})'.format(sezione.descrizione)

    return comune_name

class DatiDOCFA(object):
    """
        Object for dati DOCFA
    """

    def __init__(self):
        self.docfa = {}
        self.planimetrie = {}
        self.periodo = None
        self.comune = None
        self.data_elaborazione = None
        self.n_record = None
        self.nome_fornitura = None


def get_archivi_docfa(zfile, dati, archiviDocfa):
    """
    Read unique zip with DOCFA zip files.
    Ex content zip file:
     - B648_200910_DC.zip
     - B648_200910_DM_PL_1.zip
     - B648_200910_DOC_1.zip
    :param zfileInfo: Zip info file
    :param dati: DatiDCFA instance
    :param archiviDocfa: Summary dict fo DOCFA zip files
    :return: None
    """

    zfileInfoList = zfile.infolist()

    # Check il first file is a directory and raise excption
    if zfileInfoList[0].is_dir():
        raise Exception('Controlla il file zip che stai caricando il primo livello non deve contenere directory')

    for zfileInfo in zfileInfoList:
        output = re.search(r'(([a-zA-Z0-9]*_([0-9]+))_((dc)|(dm_pl)|(doc)))(_([0-9])+)?',
                           zfileInfo.filename, flags=re.IGNORECASE)
        if not output:
            raise Exception('Il file {} non ha un formato \'DOCFA\' corretto'.format(zfileInfo.filename))
        else:
            elements = output.groups()

            # get comune code from file name
            dati.codice_comune = zfileInfo.filename.split('.')[0][0:4]

            # other fornitura data
            dati.periodo = elements[2]

        if not dati.nome_fornitura:
            dati.nome_fornitura = elements[1]
        elif dati.nome_fornitura != elements[1]:
            raise Exception(
                'Forniture con date e comuni differenti: trovati {} e {}'.format(dati.nome_fornitura, elements[1]))


        index = elements[8] if elements[7] else 0
        if not archiviDocfa.get(elements[3]):
            archiviDocfa[elements[3]] = {}
        if not archiviDocfa[elements[3]].get(int(index)):
            archiviDocfa[elements[3]][int(index)] = {}
        archiviDocfa[elements[3]][int(index)]['info'] = zfileInfo
        archiviDocfa[elements[3]][int(index)]['zipfile'] = BytesIO(zfile.read(zfileInfo.filename))

    # check numerazione per fi fiel docfa
    for tipo, forniture in archiviDocfa.items():
        if len(forniture.keys()) == 1 and 0 in forniture.keys():
            continue
        for index in range(1, len(forniture.keys()) + 1):
            if index not in forniture.keys():
                raise Exception('Numerazione non coerente degli archivi {}'.format(tipo))

    # check archivi numbers
    if len(archiviDocfa.keys()) != 3:
        raise Exception('Forniture incomplete: attesi archivi DOC, DM_PL e DC')


class Fornitura(object):
    """
    Classe base per gestione dati DOCFA
    """

    task_id = 3

    def __init__(self, zfiles, dati, **kwargs):
        self.zfiles = []
        for zn, zf in zfiles.items():

            class ZipFile(object):
                pass
            zipfile = ZipFile()
            zipfile.zfilename = zf['info'].filename
            zipfile.zipfile = zf['zipfile']
            self.zfiles.append(zipfile)
        self.dati = dati

        if 'task_id' in kwargs.keys():
            self.dati.task_id = self.task_id = kwargs['task_id']

    def _readCSVFile(self, zipfile, csvFile):
        f = zipfile.open(csvFile, 'r')
        reader = csv.reader((l.decode("ISO-8859-1").replace('\0', '') for l in f), delimiter='|', quotechar=None)

        return f, reader

    def loadData(self):
        for zf in self.zfiles:

            zfile = ZipFile(zf.zipfile, 'r')
            zfileInfoList = zfile.infolist()

            for zfileInfo in zfileInfoList:

                # get extension and name
                name, ext = os.path.splitext(zfileInfo.filename)
                ext = ext[1:].upper()
                method = "_load{}Data".format(ext)
                if hasattr(self, method):
                    getattr(self, method)(zfile, zfileInfo)

            zfile.close()


class FornituraDOC(Fornitura):

    def _loadLISData(self, zipfile, zipInfoFile):

        with zipfile.open(zipInfoFile, 'r') as f:
            line_count = 0
            for line in f:
                if line_count == 0:
                    self.dati.comune = line[39:43].decode()
                elif line_count == 1:
                    self.dati.data_elaborazione = line[20:28].decode()
                    self.dati.n_record = int(line[57:])
                line_count += 1

    def _loadPDFData(self, zipfile, zipInfoFile):
        path_to_save = settings.MEDIA_ROOT + settings.CADASTRE_DOCFA_DAT + "/" + self.dati.nome_fornitura + "/"
        zipfile.extract(zipInfoFile, path_to_save)
        filename = os.path.splitext(zipInfoFile.filename)[0]
        if not self.dati.docfa.get(filename):
            self.dati.docfa[filename] = {}
        self.dati.docfa[filename]['path_pdf'] = path_to_save + zipInfoFile.filename

    def _loadDATData(self, zipfile, zipInfoFile):

        # extract file dat to dat path subdir media
        path_to_save = settings.MEDIA_ROOT + settings.CADASTRE_DOCFA_DAT + "/" + self.dati.nome_fornitura +"/"
        zipfile.extract(zipInfoFile, path_to_save)
        filename = os.path.splitext(zipInfoFile.filename)[0]
        if not self.dati.docfa.get(filename):
            self.dati.docfa[filename] = {}
        self.dati.docfa[filename]['path'] = path_to_save + zipInfoFile.filename

        # insert file data into db
        # get data from self.dati and zipInfoFile
        f = open(self.dati.docfa[filename]['path'], 'r', encoding='ISO-8859-1')
        lines = f.readlines()

        for data in lines:
            denominatore = data[54:58]
            if denominatore == "0000":
                denominatore = None;

            if len(data) > 60 and data[16] == 'B':

                relazione, created = RelazioneFabbricatiDOCFA.objects.update_or_create(
                    protocollo=filename,
                    codice_comune=self.dati.comune,
                    sezione=None,
                    sezione_urbana=data[42:45],
                    foglio=data[45:49],
                    numero=data[49:54],
                    denominatore=denominatore
                )

                relazione.task_id = self.task_id
                relazione.save()
        f.close()


class FornituraDC(Fornitura):

    def _loadDATData(self, zipfile, zipInfoFile):

        f, reader = self._readCSVFile(zipfile, zipInfoFile)

        for row in reader:
            self._loadDC_DATData(row)
        f.close()

    def _loadDC_DATData(self, row):

        # create record data to insert
        dati_relazione = {

            'protocollo': row[3],
            'id_uiu': int(row[2]),
            'codice_comune_uiu': row[0],
        }

        check_add_row(dati_relazione, 'sezione_uiu_id', row, 1)

        relazioneUiuDOCFA, created = RelazioneUiuDOCFA.objects.update_or_create(**dati_relazione)
        relazioneUiuDOCFA.task_id = self.task_id
        relazioneUiuDOCFA.save()

        # Aggiornamento eventuale dell'unita immobiliare

        record_UIU = {

            'id_immobile': int(row[2]),
            'codice_comune': row[0],
            'progressivo': 0
        }

        check_add_row(record_UIU, 'sezione', row, 1)
        check_add_row(record_UIU, 'zona', row, 5)
        check_add_row(record_UIU, 'categoria', row, 6)
        check_add_row(record_UIU, 'classe', row, 7)
        fromStr2Decimal(record_UIU, 'consistenza', row, 8)
        fromStr2Int(record_UIU, 'superficie', row, 9)
        fromStr2Decimal(record_UIU, 'rendita_euro', row, 10)
        check_add_row(record_UIU, 'partita', row, 11)
        check_add_row(record_UIU, 'lotto', row, 12)
        check_add_row(record_UIU, 'edificio', row, 13)
        check_add_row(record_UIU, 'scala', row, 14)
        check_add_row(record_UIU, 'interno_1', row, 15)
        check_add_row(record_UIU, 'interno_2', row, 16)
        check_add_row(record_UIU, 'piano_1', row, 17)
        check_add_row(record_UIU, 'piano_2', row, 18)
        check_add_row(record_UIU, 'piano_3', row, 19)
        check_add_row(record_UIU, 'piano_4', row, 20)

        unitaImmobiliare, created = UnitaImmobiliare.objects.get_or_create(**record_UIU)
        unitaImmobiliare.task_id = self.task_id
        unitaImmobiliare.save()

        if created:

            record_indirizzi = {
                'id_immobile': int(row[2]),
                'codice_comune': row[0],
                'progressivo': 0,
                'indirizzo': row[29],
                'civico_1': row[30],
                'civico_2': row[31],
                'civico_3': row[32]
            }

            check_add_row(record_indirizzi, 'sezione', row, 1)
            record_indirizzi['task_id'] = self.task_id
            Indirizzi.objects.create(**record_indirizzi)

            record_identificativi_immobiliari = {
                'id_immobile': int(row[2]),
                'codice_comune': row[0],
                'progressivo': 0,
                'sezione_urbana': row[21],
                'foglio': row[22],
                'numero': row[23],
                'denominatore': int(row[24]),
                'subalterno': row[25],
                'edificialita': row[26]
            }

            check_add_row(record_identificativi_immobiliari, 'sezione', row, 1)

            IdentificativiImmobiliari.objects.update_or_create(defaults={
                'task_id': self.task_id
            }, **record_identificativi_immobiliari)

        # aggiornamento self.dati
        if row[3] not in self.dati.docfa:
            self.dati.docfa[row[3]] = {}
        self.dati.docfa[row[3]]['data_registrazione'] = datetime.strptime(row[4], "%d%m%Y")
        self.dati.docfa[row[3]]['protocollo'] = row[3]


class FornituraDM_PL(Fornitura):

    def loadData(self):
        for zf in self.zfiles:

            zfile = ZipFile(zf.zipfile, 'r')
            zfileInfoList = zfile.infolist()

            for zfileInfo in zfileInfoList:

                # get extension and name
                name, ext = os.path.splitext(zfileInfo.filename)
                ext = ext[1:].upper()


                match_dm_sc = re.match(r'^[a-zA-Z0-9_]*_(dm|sc).dat$', zfileInfo.filename, flags=re.IGNORECASE)
                match_numerico = re.match(r'^[0-9]*.[0-9]*$', zfileInfo.filename, flags=re.IGNORECASE)
                match_zip = ext=='ZIP'

                if match_dm_sc:
                    ftype = zfileInfo.filename[match_dm_sc.regs[1][0]:match_dm_sc.regs[1][1]]
                    method = "_load{}Data".format(ftype)
                elif match_numerico:
                    method = "_loadPLANData"
                elif match_zip:
                    method = "_loadZIPData"
                else:
                    method = None

                if method and hasattr(self, method):
                    getattr(self, method)(zfile, zfileInfo)

            zfile.close()

    def _loadDMData(self, zipfile, zipInfoFile):

        f, reader = self._readCSVFile(zipfile, zipInfoFile)

        for row in reader:
            self._loadDM_PL_DMData(row)
        f.close()

    def _loadSCData(self, zipfile, zipInfoFile):

        f, reader = self._readCSVFile(zipfile, zipInfoFile)

        for row in reader:
            self._loadDM_PL_SCData(row)
        f.close()

    def _loadZIPData(self, zipfile, zipInfoFile):

        zf = BytesIO(zipfile.read(zipInfoFile))
        zfile = ZipFile(zf)
        zfileInfoList = zfile.infolist()

        for zfileInfo in zfileInfoList:

            method = "_loadPLANData"
            if hasattr(self, method):
                getattr(self, method)(zfile, zfileInfo)

    def _loadPLANData(self, zipfile, zipInfoFile):

        # extract file dat to dat path subdir media
        path_to_save = settings.MEDIA_ROOT + settings.CADASTRE_DOCFA_PLAN + "/" + self.dati.nome_fornitura + "/"
        zipfile.extract(zipInfoFile, path_to_save)
        if not self.dati.planimetrie.get(zipInfoFile.filename):
            self.dati.planimetrie[zipInfoFile.filename] = {}
        self.dati.planimetrie[zipInfoFile.filename]['path'] = path_to_save + zipInfoFile.filename

    def _loadDM_PL_DMData(self, row):

        # create record data to insert
        dati_metrici = {

            'docfa': row[3],
            'id_uiu': int(row[2]),
            'codice_comune_uiu': row[0],
            'progressivo_poligono': int(row[5]),
            'superficie': row[6],
            'ambiente': row[7],
            'altezza': row[8]

        }

        check_add_row(dati_metrici, 'sezione_uiu_id', row, 1)
        check_add_row(dati_metrici, 'altezza_max', row, 9)

        datiMDOCFA, created = DatiMDOCFA.objects.update_or_create(**dati_metrici)
        datiMDOCFA.task_id = self.task_id
        datiMDOCFA.save()

    def _loadDM_PL_SCData(self, row):

        if row[2]== '0':
            id_uiu = None
            is_elaborato = 1
        else:
            id_uiu = row[2]
            is_elaborato = 0

        name_planimetria = get_name_planimetria(row[5], int(row[6]))
        if not self.dati.planimetrie.get(name_planimetria):
            self.dati.planimetrie[name_planimetria] = {}

        self.dati.planimetrie[name_planimetria].update({
            'nome_file': row[5],
            'docfa': row[3],
            'numero': int(row[5]),
            'formato': row[7],
            'scala': row[8],
            'id_uiu': id_uiu,
            'is_elaborato': is_elaborato
        })


class Catasto(object):

    task_id = None

    def __init__(self, zfilename, tipoTit='FAB', is_aggiornamento=False, **kwargs):
        self.tipoTit = tipoTit
        self.zfilename = zfilename.name
        self.is_aggiornamento = is_aggiornamento
        if  'task_id' in kwargs.keys():
            self.task_id = kwargs['task_id']
        self.current_state = kwargs['current_task']
        print ('INSTANCE: ' + self.tipoTit)

    def _readCSVFile(self, csvFile):
        """ Method to read censuario line variable."""

        f = self.zfile.open(csvFile, 'r')
        reader = csv.reader((l.decode('utf-8', 'ignore').replace('\0', '') for l in f), delimiter='|', quotechar=None)

        return f, reader

    def loadData(self):

        self.zfile = ZipFile(self.zfilename, 'r')
        self.zfileInfoList = self.zfile.infolist()
        self.dati_atto_id_to_save = []

        # count files for pending_percent work
        n_catasto_file = 0
        catasto_file_count = 0

        for zfileInfo in self.zfileInfoList:

            # get extension and name
            name, ext = os.path.splitext(zfileInfo.filename)
            ext = ext[1:].upper()
            if self.is_aggiornamento:
                method = "_del{}Data".format(ext)
                if hasattr(self, method):
                    n_catasto_file += 1
            method = "_load{}Data".format(ext)
            if hasattr(self, method):
                    n_catasto_file += 1


        if self.is_aggiornamento:
            for zfileInfo in self.zfileInfoList:

                # get extension and name
                name, ext = os.path.splitext(zfileInfo.filename)
                ext = ext[1:].upper()
                method = "_del{}Data".format(ext)
                if hasattr(self, method):

                    # update pending_percent value
                    catasto_file_count += 1
                    pending_percent = int(float(catasto_file_count) / float(n_catasto_file) * 100)

                    print ("DEL {} {}".format(ext, zfileInfo.filename))
                    getattr(self, method)(zfileInfo)

                    # set pending_percent value
                    self.current_state.update_state(state=states.PENDING, meta={'pending_percent': pending_percent})

        for zfileInfo in self.zfileInfoList:

            # get extension and name
            name, ext = os.path.splitext(zfileInfo.filename)
            ext = ext[1:].upper()
            method = "_load{}Data".format(ext)
            if hasattr(self, method):

                # update pending_percent value
                catasto_file_count += 1
                pending_percent = int(float(catasto_file_count) / float(n_catasto_file) * 100)

                print ("LOAD {} {}".format(ext, zfileInfo.filename))
                getattr(self, method)(zfileInfo)

                # set pending_percent value
                self.current_state.update_state(state=states.PENDING, meta={'pending_percent': pending_percent})

        self.zfile.close()


    def _saveDatiAtto(self, model, row, keys, init=True):
        """
        Save dati atto
        """
        datiAtto = {
            'id': getattr(model, 'id_mutazionale_iniziale') if init else getattr(model, 'id_mutazionale_finale')
        }

        fromStr2Date(datiAtto, 'data_efficacia', row, keys[0])
        fromStr2Date(datiAtto, 'data_registrazione', row, keys[1])
        check_add_row(datiAtto, 'tipo_nota', row, keys[2])
        check_add_row(datiAtto, 'numero_nota', row, keys[3])
        check_add_row(datiAtto, 'progressivo_nota', row, keys[4])
        fromStr2Int(datiAtto, 'anno_nota', row, keys[5])

        check_add_row(datiAtto, 'codice_casuale', row, keys[6])
        check_add_row(datiAtto, 'descrizione_casuale', row, keys[7])

        if self.task_id:
            datiAtto['task_id'] = self.task_id

        if datiAtto['id'] not in self.dati_atto_id_to_save and int(datiAtto['id']) not in self.dati_atto_id_in_db:
            datoAtto = DatiAtto(**datiAtto)
            self.dati_atto_bulk_data.append(datoAtto)
            self.dati_atto_id_to_save.append(datoAtto.id)

    def _loadSOGData(self, zipInfoFile):

        self.persona_fisica_bulk_data = []
        self.persona_fisica_id_soggetto_to_save = []
        self.persona_giuridica_bulk_data = []
        self.persona_giuridica_id_soggetto_to_save = []

        #self.dati_sog_pf_in_db = [da.id_soggetto for da in PersonaFisica.objects.all()]
        #print "PERSONA FISICA IN DB: {}".format(str(len(self.dati_sog_pf_in_db)))

        #self.dati_sog_pg_in_db = [da.id_soggetto for da in PersonaGiuridica.objects.all()]
        #print "PERSONA GIURIDICA IN DB: {}".format(str(len(self.dati_sog_pg_in_db)))

        f, reader = self._readCSVFile(zipInfoFile)

        # perform delete query
        for row in reader:
            datiSoggetto = {
                'id_soggetto': row[2],

            }

            check_add_row(datiSoggetto, 'codice_comune', row, 0)
            # check_add_row(datiSoggetto, 'sezione', row, 1)

            if self.task_id:
                datiSoggetto['task_id'] = self.task_id

            tipoPersona = row[3]
            if tipoPersona == 'P':

                check_add_row(datiSoggetto, 'cognome', row, 4)
                check_add_row(datiSoggetto, 'nome', row, 5)
                check_add_row(datiSoggetto, 'sesso', row, 6)

                fromStr2Date(datiSoggetto, 'data_nascita', row, 7)
                check_add_row(datiSoggetto, 'luogo_nascita', row, 8)
                check_add_row(datiSoggetto, 'codice_fiscale', row, 9)
                check_add_row(datiSoggetto, 'indicazioni_supplementari', row, 10)

                #if datiSoggetto['id_soggetto'] not in self.persona_fisica_id_soggetto_to_save and \
                                #int(datiSoggetto['id_soggetto']) not in self.dati_sog_pf_in_db:
                personaFisica = PersonaFisica(**datiSoggetto)
                self.persona_fisica_bulk_data.append(personaFisica)
                self.persona_fisica_id_soggetto_to_save.append(datiSoggetto['id_soggetto'])

            elif tipoPersona == 'G':

                check_add_row(datiSoggetto, 'denominazione', row, 4)
                check_add_row(datiSoggetto, 'sede', row, 5)
                check_add_row(datiSoggetto, 'codice_fiscale_piva', row, 6)

                #if datiSoggetto['id_soggetto'] not in self.persona_giuridica_id_soggetto_to_save and \
                                #int(datiSoggetto['id_soggetto']) not in self.dati_sog_pg_in_db:
                personaGiuridica = PersonaGiuridica(**datiSoggetto)
                self.persona_giuridica_bulk_data.append(personaGiuridica)
                self.persona_giuridica_id_soggetto_to_save.append(datiSoggetto['id_soggetto'])

        f.close()
        print ("SAVE Persona Fisica")
        PersonaFisica.objects.bulk_create(self.persona_fisica_bulk_data, ignore_conflicts=True)
        #PersonaFisica.cadastre_objects.bulk_create(self.persona_fisica_bulk_data)

        print ("SAVE Persona Giuridica")
        PersonaGiuridica.objects.bulk_create(self.persona_giuridica_bulk_data, ignore_conflicts=True)
        #PersonaGiuridica.cadastre_objects.bulk_create(self.persona_giuridica_bulk_data)


        #del self.dati_sog_pg_in_db
        #del self.dati_sog_pf_in_db

    '''
    def _delTITData(self, zipInfoFile):

        codice_comume_vals = []
        id_immobile_vals = []
        id_soggetto_vals = []
        tipo_soggetto_vals = []
        id_particella_vals = []
        sezione_vals = []
        sezione_null = False

        dati_atto_i_vals = []
        dati_atto_f_vals = []

        f, reader = self._readCSVFile(zipInfoFile)

        for row in reader:
            if self.tipoTit == "FAB":
                if row[4] not in id_immobile_vals:
                    id_immobile_vals.append(row[4])
            else:
                if row[4] not in id_particella_vals:
                    id_particella_vals.append(row[4])

            sezione = row[1].strip()

            # collect values:
            if row[0] not in codice_comume_vals:
                codice_comume_vals.append(row[0])
            if row[2] not in id_soggetto_vals:
                id_soggetto_vals.append(row[2])
            if row[3] not in tipo_soggetto_vals:
                tipo_soggetto_vals.append(row[3])
            if row[25] != '' and row[25] not in dati_atto_i_vals:
                dati_atto_i_vals.append(row[25])
            if row[26] != '' and row[26] not in dati_atto_f_vals:
                dati_atto_f_vals.append(row[26])
            if sezione != '':
                if sezione not in sezione_vals:
                    sezione_vals.append(sezione)
            else:
                sezione_null = True

        with connections[settings.CADASTRE_DATABASE].cursor() as cursor:
            in_sezione_vals = []
            in_codice_comune_vals = ', '.join(["'{}'".format(cc) for cc in codice_comume_vals])
            in_id_immobile_vals = ', '.join(["{}".format(ii) for ii in id_immobile_vals])
            in_id_particella_vals = ', '.join(["{}".format(ii) for ii in id_particella_vals])
            in_id_soggetto_vals = ', '.join(["{}".format(ii) for ii in id_soggetto_vals])
            in_tipo_soggetto_vals = ', '.join(["'{}'".format(p) for p in tipo_soggetto_vals])
            in_dati_atto_i_vals = ', '.join(["{}".format(p) for p in dati_atto_i_vals])
            in_dati_atto_f_vals = ', '.join(["{}".format(p) for p in dati_atto_f_vals])
            if len(sezione_vals) > 0:
                in_sezione_vals = ', '.join(["{}".format(s) for s in sezione_vals])

            if self.tipoTit == 'FAB':
                in_immobili_particelle = "id_immobile in ({}) and id_particella is null".format(in_id_immobile_vals)
            else:
                in_immobili_particelle = "id_particella in ({}) and id_immobile is null".format(in_id_particella_vals)

            if sezione_null:
                dq = "delete from {} where codice_comune in ({}) and {} and id_soggetto in ({}) and tipo_soggetto in ({}) and {}".format(
                    Titolarita._meta.db_table,
                    in_codice_comune_vals,
                    in_immobili_particelle,
                    in_id_soggetto_vals,
                    in_tipo_soggetto_vals,
                    'sezione is null'
                )
                cursor.execute(dq)

            if len(in_sezione_vals) >0:
                dq = "delete from {} where codice_comune in ({}) and {} and id_soggetto in ({}) and tipo_soggetto in ({}) and sezione in ({})".format(
                    Titolarita._meta.db_table,
                    in_codice_comune_vals,
                    in_immobili_particelle,
                    in_id_soggetto_vals,
                    in_tipo_soggetto_vals,
                    in_sezione_vals
                )
                cursor.execute(dq)

            dq = "delete from {} where id in ({})".format(
                DatiAtto._meta.db_table,
                in_dati_atto_i_vals
            )
            cursor.execute(dq)

            dq = "delete from {} where id in ({})".format(
                DatiAtto._meta.db_table,
                in_dati_atto_f_vals
            )
            cursor.execute(dq)

    '''
    def _delTITData(self, zipInfoFile):




        dati_atto_i_vals = []
        dati_atto_f_vals = []

        f, reader = self._readCSVFile(zipInfoFile)

        with connections[settings.CADASTRE_DATABASE].cursor() as cursor:

            for row in reader:

                if row[25] != '' and row[25] not in dati_atto_i_vals:
                    dati_atto_i_vals.append(row[25])
                if row[26] != '' and row[26] not in dati_atto_f_vals:
                    dati_atto_f_vals.append(row[26])

                # don't erase tit by id_soggetto and id_immobile becaosu on AE Sfotware it is a bug doesn't work
                '''
                if self.tipoTit == "FAB":
                    id_immobile = row[4]
                    id_particella = None
                else:
                    id_immobile = None
                    id_particella = row[4]

                sezione = row[1].strip()
                sezione_null = True
                if sezione != '':
                    sezione_null = False

                dq = "delete from {} where codice_comune = '{}' and id_soggetto = {} and tipo_soggetto ='{}' and {} and {} and {}".format(
                    Titolarita._meta.db_table,
                    row[0],
                    row[2],
                    row[3],
                    'id_immobile = {}'.format(id_immobile) if id_immobile else 'id_immobile is null',
                    'id_particella = {}'.format(id_particella) if id_particella else 'id_particella is null',
                    'sezione = {}'.format(sezione) if not sezione_null else 'sezione is null',
                )
                cursor.execute(dq)
                row_deleted = cursor.rowcount
                #if row_deleted > 0:
                    #print dq
                '''

            in_dati_atto_i_vals = ', '.join(["{}".format(p) for p in dati_atto_i_vals])
            in_dati_atto_f_vals = ', '.join(["{}".format(p) for p in dati_atto_f_vals])

            if in_dati_atto_i_vals:
                dq = "delete from {} where id in ({})".format(
                    DatiAtto._meta.db_table,
                    in_dati_atto_i_vals
                )
                cursor.execute(dq)

            if in_dati_atto_f_vals:
                dq = "delete from {} where id in ({})".format(
                    DatiAtto._meta.db_table,
                    in_dati_atto_f_vals
                )
                cursor.execute(dq)


    def _loadTITData(self, zipInfoFile):

         # azeriamo il bulk_data di dati atto
        self.dati_atto_bulk_data = []
        titolarita_bulk_data = []

        # get dati atto in database
        self.dati_atto_id_in_db = [da.id for da in DatiAtto.objects.all()]
        #print "DATI ATTO IN DB: {}".format(str(len(self.dati_atto_id_in_db)))

        f, reader = self._readCSVFile(zipInfoFile)

        for row in reader:
            if self.tipoTit == "FAB":
                id_immobile = row[4]
                id_particella = None
            else:
                id_immobile = None
                id_particella = row[4]

            datiTitolarita = {
                'id_immobile': id_immobile,
                'id_particella': id_particella,
                'tipo_fornitura': 'E'
            }

            check_add_row(datiTitolarita, 'codice_comune', row, 0)
            check_add_row(datiTitolarita, 'sezione', row, 1)
            fromStr2Int(datiTitolarita, 'id_soggetto', row, 2)
            check_add_row(datiTitolarita, 'tipo_soggetto', row, 3)
            check_add_row(datiTitolarita, 'codice_diritto_id', row, 6)
            check_add_row(datiTitolarita, 'titolo_non_codificato', row, 7)
            fromStr2Int(datiTitolarita, 'quota_numeratore', row, 8)
            fromStr2Int(datiTitolarita, 'quota_denominatore', row, 9)
            check_add_row(datiTitolarita, 'regime', row, 10)
            check_add_row(datiTitolarita, 'soggetto_riferimento', row, 11)

            check_add_row(datiTitolarita, 'id_mutazionale_iniziale', row, 25)
            check_add_row(datiTitolarita, 'id_mutazionale_finale', row, 26)

            if self.task_id:
                datiTitolarita['task_id'] = self.task_id

            #print(datiTitolarita)
            titolarita = Titolarita(**datiTitolarita)
            titolarita_bulk_data.append(titolarita)

            if titolarita.id_mutazionale_iniziale:

                self._saveDatiAtto(titolarita, row, [
                    12, 17, 13, 14, 15, 16, 28, 29
                ])

            if titolarita.id_mutazionale_finale:

                self._saveDatiAtto(titolarita, row, [
                    19, 24, 20, 21, 22, 23, 30, 31
                ], init=False)

        f.close()

        # proviamo con il bulk
        print ("SAVE Titolarita")
        Titolarita.objects.bulk_create(titolarita_bulk_data)
        del(titolarita_bulk_data)

        #print "DATI ATTO TO SAVE TIT: {}".format(str(len(self.dati_atto_bulk_data)))
        print ("SAVE Dati Atto TIT")
        DatiAtto.objects.bulk_create(self.dati_atto_bulk_data)


class CatastoFAB(Catasto):
    """
    Caricamento dati catastali FABBRICATI Iniziale e Aggiornamenti
    """
    def _delFABData(self, zipInfoFile):

        f, reader = self._readCSVFile(zipInfoFile)

        # perform delete query
        with connections[settings.CADASTRE_DATABASE].cursor() as cursor:
            count_row = 0
            for row in reader:
                tipo_record = row[5]
                if tipo_record == '1':
                    sezione_null = False
                    sezione = row[1].strip()
                    if sezione == '':
                        sezione_null = True

                    dq = "delete from {} where codice_comune = '{}' and id_immobile = {} and {} and progressivo = {}".format(
                        UnitaImmobiliare._meta.db_table,
                        row[0],
                        row[2],
                        'sezione = {}'.format(sezione) if not sezione_null else 'sezione is null',
                        row[4]
                    )

                    cursor.execute(dq)

                    if cursor.rowcount:
                        for model in [
                            IdentificativiImmobiliari,
                            Indirizzi,
                            UtilitaComuniUI,
                            RiserveUI
                        ]:

                            dq = "delete from {} where codice_comune = '{}' and id_immobile = {} and {} and progressivo = {}".format(
                                model._meta.db_table,
                                row[0],
                                row[2],
                                'sezione = {}'.format(sezione) if not sezione_null else 'sezione is null',
                                row[4]
                            )
                            cursor.execute(dq)

                        dq = "delete from {} where codice_comune = '{}' and id_immobile = {} and {}".format(
                            Titolarita._meta.db_table,
                            row[0],
                            row[2],
                            'sezione = {}'.format(sezione) if not sezione_null else 'sezione is null'
                        )
                        cursor.execute(dq)

    def _loadFABData(self, zipInfoFile):

        self.unita_immobiliare_bulk_data = []
        self.identificativi_immobiliari_bulk_data = []
        self.indirizzi_bulk_data = []
        self.utilita_comuni_ui_bulk_data = []
        self.riserve_ui_bulk_data = []
        self.dati_atto_bulk_data = []

        # get dati atto in database
        self.dati_atto_id_in_db = [da.id for da in DatiAtto.objects.all()]
        #print "DATI ATTO IN DB FAB: {}".format(str(len(self.dati_atto_id_in_db)))


        f, reader = self._readCSVFile(zipInfoFile)

        for row in reader:
            tipo_record = row[5]
            method = "_loadFAB{}Data".format(tipo_record)
            if hasattr(self, method):
                getattr(self, method)(row)

        f.close()

        print ("SAVE Unita Immbiliari")
        UnitaImmobiliare.objects.bulk_create(self.unita_immobiliare_bulk_data)
        del self.unita_immobiliare_bulk_data[:]

        print ("SAVE Idetificativi Immbiliari")
        IdentificativiImmobiliari.cadastre_objects.bulk_create(self.identificativi_immobiliari_bulk_data)
        del self.identificativi_immobiliari_bulk_data[:]

        print ("SAVE Indirizzi")
        Indirizzi.objects.bulk_create(self.indirizzi_bulk_data)
        del self.indirizzi_bulk_data[:]

        print ("SAVE Utilita Comuni UI")
        UtilitaComuniUI.objects.bulk_create(self.utilita_comuni_ui_bulk_data)
        del self.utilita_comuni_ui_bulk_data[:]

        print ("SAVE Riserve UI")
        RiserveUI.objects.bulk_create(self.riserve_ui_bulk_data)
        del self.riserve_ui_bulk_data[:]

        print ("SAVE Dati Atto FAB")
        DatiAtto.objects.bulk_create(self.dati_atto_bulk_data)
        del self.dati_atto_bulk_data[:]

    def _loadFAB1Data(self, row):
        # create record data to insert
        recordFAB1 = {

            'id_immobile': row[2],
            'codice_comune': row[0],
            'progressivo': row[4],

        }
        check_add_row(recordFAB1, 'sezione', row, 1)
        check_add_row(recordFAB1, 'zona', row, 6)
        check_add_row(recordFAB1, 'categoria', row, 7)
        check_add_row(recordFAB1, 'classe', row, 8)
        fromStr2Decimal(recordFAB1, 'consistenza', row, 9)
        fromStr2Int(recordFAB1, 'superficie', row, 10)
        check_add_row(recordFAB1, 'rendita_lire', row, 11)
        fromStr2Decimal(recordFAB1, 'rendita_euro', row, 12)
        check_add_row(recordFAB1, 'lotto', row, 13)
        check_add_row(recordFAB1, 'edificio', row, 14)
        check_add_row(recordFAB1, 'scala', row, 15)
        check_add_row(recordFAB1, 'interno_1', row, 16)
        check_add_row(recordFAB1, 'interno_2', row, 17)
        check_add_row(recordFAB1, 'piano_1', row, 18)
        check_add_row(recordFAB1, 'piano_2', row, 19)
        check_add_row(recordFAB1, 'piano_3', row, 20)
        check_add_row(recordFAB1, 'piano_4', row, 21)

        check_add_row(recordFAB1, 'partita', row, 34)
        check_add_row(recordFAB1, 'flag_classamento', row, 44)

        check_add_row(recordFAB1, 'protocollo_notifica', row, 38)
        fromStr2Date(recordFAB1, 'data_notifica', row, 39)

        check_add_row(recordFAB1, 'id_mutazionale_iniziale', row, 36)
        check_add_row(recordFAB1, 'id_mutazionale_finale', row, 37)

        check_add_row(recordFAB1, 'annotazione', row, 35)

        if self.task_id:
            recordFAB1['task_id'] = self.task_id

        unitaImmobiliare = UnitaImmobiliare(**recordFAB1)
        self.unita_immobiliare_bulk_data.append(unitaImmobiliare)

        # caso situazione iniziale
        if unitaImmobiliare.id_mutazionale_iniziale:

            self._saveDatiAtto(unitaImmobiliare, row, [
                22, 23, 24, 25, 26, 27, 40, 41
            ])

            #update unita immobiliare id mutazionale
            try:
                unitaImmobiliareToUpdate = UnitaImmobiliare.objects.get(id_immobiliare=unitaImmobiliare.pk,
                                                                        progressivo=unitaImmobiliare.progressivo-1)
                unitaImmobiliareToUpdate.id_mutazionale_finale = row[36]
                unitaImmobiliareToUpdate.save()
            except:
                pass


        if unitaImmobiliare.id_mutazionale_finale:

            self._saveDatiAtto(unitaImmobiliare, row, [
                28, 29, 30, 31, 32, 33, 42, 43
            ], init=False)

    def _loadFAB2Data(self, row):

        subRows = ripartizioneArray(row, 6, 6)
        # print subRows

        for subRow in subRows:
            datiIdentificativo = {
                'id_immobile': subRow[2],
            }
            fromStr2Int(datiIdentificativo, 'progressivo', subRow, 4)
            check_add_row(datiIdentificativo, 'codice_comune', subRow, 0)
            check_add_row(datiIdentificativo, 'sezione', subRow, 1)

            check_add_row(datiIdentificativo, 'sezione_urbana', subRow, 6)
            str_pad_int(datiIdentificativo, 'foglio', subRow, 7, 4)
            str_pad_int(datiIdentificativo, 'numero', subRow, 8, 5)
            fromStr2Int(datiIdentificativo, 'denominatore', subRow, 9)

            check_add_row(datiIdentificativo, 'subalterno', subRow, 10)
            check_add_row(datiIdentificativo, 'edificialita', subRow, 11)

            if self.task_id:
                datiIdentificativo['task_id'] = self.task_id

            identificativoImmobiliare = IdentificativiImmobiliari(**datiIdentificativo)
            self.identificativi_immobiliari_bulk_data.append(identificativoImmobiliare)


    def _loadFAB3Data(self, row):

        subRows = ripartizioneArray(row, 6, 6)
        # print subRows

        for subRow in subRows:
            datiIndirizzo = {
                'id_immobile': subRow[2],
            }
            fromStr2Int(datiIndirizzo, 'progressivo', subRow, 4)
            check_add_row(datiIndirizzo, 'codice_comune', subRow, 0)
            check_add_row(datiIndirizzo, 'sezione', subRow, 1)

            fromStr2Int(datiIndirizzo, 'toponimo', subRow, 6)
            check_add_row(datiIndirizzo, 'indirizzo', subRow, 7)
            check_add_row(datiIndirizzo, 'civico_1', subRow, 8)
            check_add_row(datiIndirizzo, 'civico_2', subRow, 9)
            check_add_row(datiIndirizzo, 'civico_3', subRow, 10)
            fromStr2Int(datiIndirizzo, 'codice_strada', subRow, 11)

            if self.task_id:
                datiIndirizzo['task_id'] = self.task_id

            indirizzo = Indirizzi(**datiIndirizzo)
            self.indirizzi_bulk_data.append(indirizzo)

    def _loadFAB4Data(self, row):

        subRows = ripartizioneArray(row, 6, 5)
        # print subRows

        for subRow in subRows:
            datiUtilita = {
                'id_immobile': subRow[2],
            }
            fromStr2Int(datiUtilita, 'progressivo', subRow, 4)
            check_add_row(datiUtilita, 'codice_comune', subRow, 0)
            check_add_row(datiUtilita, 'sezione', subRow, 1)

            check_add_row(datiUtilita, 'sezione_urbana', subRow, 6)
            str_pad_int(datiUtilita, 'foglio', subRow, 7, 4)
            str_pad_int(datiUtilita, 'numero', subRow, 8, 5)
            fromStr2Int(datiUtilita, 'denominatore', subRow, 9)
            check_add_row(datiUtilita, 'subalterno', subRow, 10)

            if self.task_id:
                datiUtilita['task_id'] = self.task_id

            utilita = UtilitaComuniUI(**datiUtilita)
            self.utilita_comuni_ui_bulk_data.append(utilita)

    def _loadFAB5Data(self, row):

        subRows = ripartizioneArray(row, 6, 2)
        # print subRows

        for subRow in subRows:
            datiRiserve = {
                'id_immobile': subRow[2],
            }
            fromStr2Int(datiRiserve, 'progressivo', subRow, 4)
            check_add_row(datiRiserve, 'codice_comune', subRow, 0)
            check_add_row(datiRiserve, 'sezione', subRow, 1)

            check_add_row(datiRiserve, 'codice_riserva', subRow, 6)
            check_add_row(datiRiserve, 'partita_iscrizione_riserva', subRow, 7)

            if self.task_id:
                datiRiserve['task_id'] = self.task_id

            riserva = RiserveUI(**datiRiserve)
            self.riserve_ui_bulk_data.append(riserva)


class CatastoTER(Catasto):
    """
    Caricamento dati catastali TERRENI Iniziale e Aggiornamenti
    """
    def _delTERData(self, zipInfoFile):

        f, reader = self._readCSVFile(zipInfoFile)

        with connections[settings.CADASTRE_DATABASE].cursor() as cursor:
            for row in reader:
                tipo_record = row[5]
                if tipo_record == '1':
                    sezione_null = False
                    sezione = row[1].strip()
                    if sezione == '':
                        sezione_null = True

                    dq = "delete from {} where codice_comune = '{}' and id_particella = {} and {} and progressivo = {}".format(
                        Particella._meta.db_table,
                        row[0],
                        row[2],
                        "sezione = '{}'".format(sezione) if not sezione_null else 'sezione is null',
                        row[4]
                    )

                    cursor.execute(dq)

                    if cursor.rowcount:

                        for model in [
                            CaratteristicheParticella,
                            DeduzioniParticella,
                            RiserveParticella,
                            PorzioniParticella
                        ]:
                            dq = "delete from {} where codice_comune = '{}' and id_particella = {} and {} and progressivo = {}".format(
                                model._meta.db_table,
                                row[0],
                                row[2],
                                "sezione = '{}'".format(sezione) if not sezione_null else 'sezione is null',
                                row[4]
                            )
                            cursor.execute(dq)

                        dq = "delete from {} where codice_comune = '{}' and id_particella = {} and {}".format(
                            Titolarita._meta.db_table,
                            row[0],
                            row[2],
                            "sezione = '{}'".format(sezione) if not sezione_null else 'sezione is null'
                        )
                        cursor.execute(dq)

    def _loadTERData(self, zipInfoFile):

        self.particella_bulk_data = []
        self.caratteristica_particella_bulk_data = []
        self.dati_atto_bulk_data = []
        self.deduzione_particella_bulk_data = []
        self.riserve_particella_bulk_data = []
        self.porzioni_particella_bulk_data = []

        # get dati atto in database
        self.dati_atto_id_in_db = [da.id for da in DatiAtto.objects.all()]
        #print "DATI ATTO IN DB: {}".format(str(len(self.dati_atto_id_in_db)))

        f, reader = self._readCSVFile(zipInfoFile)
        for row in reader:
            tipo_record = row[5]
            method = "_loadTER{}Data".format(tipo_record)
            if hasattr(self, method):
                getattr(self, method)(row)
        f.close()

        print ("SAVE Particella")
        Particella.cadastre_objects.bulk_create(self.particella_bulk_data)
        del self.particella_bulk_data[:]

        print ("SAVE Caratteristiche Particella")
        CaratteristicheParticella.objects.bulk_create(self.caratteristica_particella_bulk_data)
        del self.caratteristica_particella_bulk_data[:]

        print ("SAVE Dati Atto TER")
        DatiAtto.objects.bulk_create(self.dati_atto_bulk_data)
        del self.dati_atto_bulk_data[:]

        print ("SAVE Deduzioni Particella")
        DeduzioniParticella.objects.bulk_create(self.deduzione_particella_bulk_data)
        del self.deduzione_particella_bulk_data[:]

        print ("SAVE Riserve Particella")
        RiserveParticella.objects.bulk_create(self.riserve_particella_bulk_data)
        del self.riserve_particella_bulk_data[:]

        print ("SAVE Porzioni Particella")
        PorzioniParticella.objects.bulk_create(self.porzioni_particella_bulk_data)
        del self.porzioni_particella_bulk_data[:]

    def _loadTER1Data(self, row):
        """
        Carica le caratteristiche dell particelle
        """

        # create record data to insert
        recordTER = {

            'id_particella': row[2],
            'codice_comune': row[0],
            'progressivo': row[4],

        }
        check_add_row(recordTER, 'sezione', row, 1)
        check_add_row(recordTER, 'edificialita', row, 10)
        check_add_row(recordTER, 'qualita_id', row, 11)
        check_add_row(recordTER, 'classe', row, 12)

        fromStr2Int(recordTER, 'ettari', row, 13)
        fromStr2Int(recordTER, 'are', row, 14)
        fromStr2Int(recordTER, 'centiare', row, 15)
        check_add_row(recordTER, 'flag_reddito', row, 16)
        check_add_row(recordTER, 'flag_porzione', row, 17)
        check_add_row(recordTER, 'flag_deduzioni', row, 18)

        fromStr2Int(recordTER, 'reddito_dominicale', row, 19)
        fromStr2Int(recordTER, 'reddito_agrario', row, 20)
        fromStr2Decimal(recordTER, 'reddito_dominicale_euro', row, 21)
        fromStr2Decimal(recordTER, 'reddito_agrario_euro', row, 22)

        check_add_row(recordTER, 'partita', row, 35)
        check_add_row(recordTER, 'annotazione', row, 36)
        fromStr2Int(recordTER, 'id_mutazionale_iniziale', row, 37)
        fromStr2Int(recordTER, 'id_mutazionale_finale', row, 38)

        if self.task_id:
            recordTER['task_id'] = self.task_id

        #caratteristicaParticella = CaratteristicheParticella.objects.create(**recordTER)
        caratteristicaParticella = CaratteristicheParticella(**recordTER)
        self.caratteristica_particella_bulk_data.append(caratteristicaParticella)

        # add particella data

        datiParticella = {
            'id_particella': caratteristicaParticella.id_particella,
            'codice_comune': row[0],
            'progressivo': row[4],
            'sezione': caratteristicaParticella.sezione
        }

        str_pad_int(datiParticella, 'foglio', row, 6, 4)
        str_pad_int(datiParticella, 'numero', row, 7, 5)

        fromStr2Int(datiParticella, 'denominatore', row, 8)
        check_add_row(datiParticella, 'subalterno', row, 9)

        if self.task_id:
            datiParticella['task_id'] = self.task_id

        #particella = Particella.objects.create(**datiParticella)
        self.particella_bulk_data.append(Particella(**datiParticella))

        # caso situazione iniziale
        if caratteristicaParticella.id_mutazionale_iniziale:

            self._saveDatiAtto(caratteristicaParticella, row, [
                23, 24, 25, 26, 27, 28, 39, 40
            ])

        if caratteristicaParticella.id_mutazionale_finale:

            self._saveDatiAtto(caratteristicaParticella, row, [
                29, 30, 31, 32, 33, 34, 41, 42
            ], init=False)


    def _loadTER2Data(self, row):
        """
        Carica le deduzioni
        """

        subRows = ripartizioneArray(row, 6, 1)

        for subRow in subRows:
            datiDeduzioni = {
                'id_particella': subRow[2],
            }
            fromStr2Int(datiDeduzioni, 'progressivo', subRow, 4)
            check_add_row(datiDeduzioni, 'codice_comune', subRow, 0)
            check_add_row(datiDeduzioni, 'sezione', subRow, 1)

            check_add_row(datiDeduzioni, 'simbolo', subRow, 6)

            if self.task_id:
                datiDeduzioni['task_id'] = self.task_id

            self.deduzione_particella_bulk_data.append(DeduzioniParticella(**datiDeduzioni))

    def _loadTER3Data(self, row):
        """
        Carica le riserve
        """

        subRows = ripartizioneArray(row, 6, 2)

        for subRow in subRows:
            datiRiserva = {
                'id_particella': subRow[2],
            }
            fromStr2Int(datiRiserva, 'progressivo', subRow, 4)
            check_add_row(datiRiserva, 'codice_comune', subRow, 0)
            check_add_row(datiRiserva, 'sezione', subRow, 1)

            check_add_row(datiRiserva, 'codice', subRow, 6)
            check_add_row(datiRiserva, 'partita', subRow, 7)

            if self.task_id:
                datiRiserva['task_id'] = self.task_id

            self.riserve_particella_bulk_data.append(RiserveParticella(**datiRiserva))

    def _loadTER4Data(self, row):
        """
        Carica le porzioni
        """

        subRows = ripartizioneArray(row, 6, 6)

        for subRow in subRows:
            datiPorzioni = {
                'id_particella': row[2],
            }
            fromStr2Int(datiPorzioni, 'progressivo', subRow, 4)
            check_add_row(datiPorzioni, 'codice_comune', subRow, 0)
            check_add_row(datiPorzioni, 'sezione', subRow, 1)

            check_add_row(datiPorzioni, 'id_porzione', subRow, 6)
            check_add_row(datiPorzioni, 'qualita_id', row, 7)
            check_add_row(datiPorzioni, 'classe', subRow, 8)
            fromStr2Int(datiPorzioni, 'ettari', subRow, 9)
            fromStr2Int(datiPorzioni, 'are', subRow, 10)
            fromStr2Int(datiPorzioni, 'centiare', subRow, 11)

            if self.task_id:
                datiPorzioni['task_id'] = self.task_id

            self.porzioni_particella_bulk_data.append(PorzioniParticella(**datiPorzioni))

from cadastre.vendors.cxf_in.cfx_to_postgis import load_cxf_catasto


class CatastoCXF(object):
    """
    Class for rerad ancd save into DB cxf file
    """
    task_id = None

    def __init__(self, zfilename, **kwargs):
        self.zfilename = zfilename.name
        if 'task_id' in kwargs.keys():
            self.task_id = kwargs['task_id']
        if 'data_sup' in kwargs.keys():
            self.data_sup = kwargs['data_sup']

        self.current_state = kwargs['current_task']
        print ('INSTANCE: CXF')

    def loadData(self):

        self.zfile = ZipFile(self.zfilename, 'r')
        self.zfileInfoList = self.zfile.infolist()

        kwargs = {}
        # get connection by codice_comune
        codice_comune = list(self.data_sup.keys())[0][0:4]


        conf_inport_catasto = ConfigImportCxf.objects.get(codice_comune=codice_comune).conn()


        kwargs.update({
            'schema': conf_inport_catasto['db_schema'],
            'table': conf_inport_catasto['db_table'],
            'srid': conf_inport_catasto['srid']
        })

        # Clear table
        with CXFDBProvider(**conf_inport_catasto) as provider:
            provider.clear_table_data_by_cod_com()

        # only cxf file
        n_cxf_file = len(self.zfileInfoList) / 2

        cxf_file_count = 0
        for zfileInfo in self.zfileInfoList:

            # get extension and name
            name, ext = os.path.splitext(zfileInfo.filename)
            ext = ext[1:].upper()

            method = "_load{}Data".format(ext)
            if hasattr(self, method):
                print ("LOAD {} {}".format(ext, zfileInfo.filename))
                cxf_file_count += 1
                pending_percent = int(float(cxf_file_count) / float(n_cxf_file) * 100)
                self.current_state.update_state(state=states.PENDING, meta={'pending_percent': pending_percent})

                getattr(self, method)(zfileInfo, self.data_sup, conn=conf_inport_catasto, **kwargs)

        self.zfile.close()

    def _loadCXFData(self, zipInfoFile, data_sup, conn, **kwargs):

        fcxf = self.zfile.open(zipInfoFile, 'r')

        kwargs.update({
            'data_sup': data_sup,
            'task_id': self.task_id
        })

        load_cxf_catasto(fcxf, zipInfoFile.filename, conn, **kwargs)

        fcxf.close()

    def delete_old_data(self, conn, conf_inport_catasto, codice_comune):
        """
        Delete old data by codice_comune
        """

        cursor = conn.cursor()

        sql = "DELETE FROM {db_schema}.{db_table} WHERE codice_comune='{codice_comune}'".format(
            db_schema=conf_inport_catasto['SCHEMA'],
            db_table=conf_inport_catasto['TABLE'],
            codice_comune=codice_comune,
        )
        cursor.execute(sql)
        cursor.close()

def loadSUPdata(zfile, zipInfoFile, data_SUP):

    with zfile.open(zipInfoFile, 'r') as fsup:
        l = fsup.readline().strip().decode('utf-8')
        fname = l[0:11]
        if fname not in data_SUP:
            data_SUP[fname] = {}

        # read data
        data_SUP[fname]['data'] = l[-8:]

        # read fabbric anbd other
        for type in (
            'fabbricati',
            'terreni',
            'strade',
            'acque',
            'svil'
        ):
            l = fsup.readline().strip()
            data_SUP[fname][type] = int(l.split(b' ')[-1])




def get_subalterni(foglio, numero, sezione, codice_comune ,tipo='F'):
    """
    Get subarlterni from identificativi immobiliari
    """

    subalterni = []

    with connections[settings.CADASTRE_DATABASE].cursor() as cursor:

        if tipo == 'F':
            q = "select * from (select id_immobile, subalterno, progressivo, max(progressivo) " \
                "over (partition by id_immobile) as max_progressivo from identificativi_immobiliari " \
                "where foglio='{}' and numero='{}' and codice_comune='{}' and progressivo not in (901)) " \
                "as sub where sub.progressivo=sub.max_progressivo " \
                "group by id_immobile, subalterno, progressivo, max_progressivo " \
                "order by subalterno;".format(foglio, numero, codice_comune)
        else:

            if sezione:

                q = "select * from (select id_particella, subalterno, progressivo, max(progressivo) " \
                    "over (partition by id_particella) as max_progressivo from particella " \
                    "where foglio='{}' and numero='{}' and sezione='{}' and codice_comune='{}' and progressivo not in (901)) " \
                    "as sub where sub.progressivo=sub.max_progressivo " \
                    "group by id_particella, subalterno, progressivo, max_progressivo " \
                    "order by subalterno;".format(foglio, numero, sezione, codice_comune)
            else:

                q = "select * from (select id_particella, subalterno, progressivo, max(progressivo) " \
                    "over (partition by id_particella) as max_progressivo from particella " \
                    "where foglio='{}' and numero='{}' and sezione is null and codice_comune='{}' and progressivo not in (901)) " \
                    "as sub where sub.progressivo=sub.max_progressivo " \
                    "group by id_particella, subalterno, progressivo, max_progressivo " \
                    "order by subalterno;".format(foglio, numero, codice_comune)

        cursor.execute(q)
        subalterni_raw = cursor.fetchall()

    if len(subalterni_raw) > 0:


            for sub in subalterni_raw:
                if tipo == 'F':
                    subalterni.append(IdentificativiImmobiliari.objects.get(foglio=foglio, numero=numero,
                                                                  progressivo=sub[2],
                                                                  subalterno=sub[1],
                                                                  id_immobile=sub[0]))
                else:
                    subalterni.append(Particella.objects.get(foglio=foglio, numero=numero,
                                                                        progressivo=sub[2],
                                                                        subalterno=sub[1],
                                                                        id_particella=sub[0]))
    return subalterni



def get_comune_data(codice_comune):
    """
    Get data from dtabella istat
    """
    try:
        istat_data = IstatCodiciUi.objects.get(codice_catastale_del_comune=codice_comune)
        return {
            'nome_comune': istat_data.denominazione_in_italiano,
            'nome_provincia': istat_data.sigla_automobilistica
        }
    except ObjectDoesNotExist:
        return {
            'nome_comune': None,
            'nome_provincia': None
        }

