from datetime import datetime
from cadastre.models import Prm


class Elemento(object):
    '''
    Object to pass no model serializers
    '''
    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)

    def __iter__(self):
        return iter(self.__dict__.items())

    def as_dict(self):
        return dict(self)


class ElementoCatastale(Elemento):
    def __init__(self, foglio=None, numero=None, sezione=None, codice_comune=None):
        self.foglio = foglio
        self.numero = numero
        self.sezione = sezione
        self.codice_comune = codice_comune


def readFilePRM(dataPRM):

    data = {}
    prm = Prm()
    for line in dataPRM:
        line = line.rstrip()
        key, value = line.split(b':')
        key = key.rstrip().replace(b" ", b"_").upper()
        data[key.decode('utf-8')] = value.strip().decode('utf-8')

    prm.codice_comune = data['COMUNE_RICHIESTO']
    prm.n_record = data['NUMERO_RECORD']
    if 'FOGLI___ESTRATTI' in data:
        prm.fogli_estratti = data['FOGLI___ESTRATTI']
    prm.descrizione = data['TIPOLOGIA_DI_ESTRAZIONE']

    # tipologi estrazione
    if prm.descrizione.lower().find('completa') > -1:
        prm.is_aggiornamento = False
    elif prm.descrizione.lower().find('aggiornamento') > -1:
        prm.is_aggiornamento = True
    else:
        raise Exception('File prm errato nessuna dicitura aggiornamento o completa')

    prm.data_elaborazione = datetime.strptime(data['DATA_ELABORAZIONE'], '%d/%m/%Y').date()
    prm.data_richiesta = datetime.strptime(data['DATA_RICHIESTA'], '%d/%m/%Y').date()

    if prm.is_aggiornamento:
        data_registrazione, data_selezione = data['DATE_REGISTRAZIONE'].split('  ')
        prm.data_selezione = datetime.strptime(data_selezione, '%d/%m/%Y').date()
        prm.data_registrazione = datetime.strptime(data_registrazione, '%d/%m/%Y').date()
    else:
        prm.data_selezione = datetime.strptime(data['DATA_SELEZIONE'], '%d/%m/%Y').date()
        prm.data_registrazione = None

    return prm


def ripartizioneArray(raw_row, numTesta, numCoda):
    """
    suddivide l'array $dati di x+ny elementi in una header di lunghezza x,
    e n componenti di lunghezza y ciascuna.
    """
    row = raw_row[:-1]
    repetition = int((len(row) - numTesta) / numCoda)

    # todo: aggiungere controllo di congruita dati
    subRows = []
    testa = row[:numTesta]
    for nr in range(0, repetition):
        subIndex = numTesta + nr * numCoda
        subRows.append(testa + row[subIndex:subIndex + numCoda])

    return subRows


def fromStr2Int(toadd, key, row, pos):
    """
    Get value by key from row and cast as integer
    """
    check_add_row(toadd, key, row, pos)

    if toadd[key] is not None:
        toadd[key] = int(toadd[key])


def fromStr2Decimal(toadd, key, row, pos):
    """
    Get value by key from row and cast as python decimal
    """
    check_add_row(toadd, key, row, pos)
    if key in toadd and toadd[key] is not None:

        # try if is numeric
        if toadd[key].replace(',', '').isdigit:
            toadd[key] = toadd[key].replace(',', '.')
        else:
            toadd[key] = None


def fromStr2Date(toadd, key, row, pos):
    """
    Get value by key from row and cast as python date
    """
    check_add_row(toadd, key, row, pos)
    if key in toadd and toadd[key] is not None:
        toadd[key] = datetime.strptime(toadd[key], "%d%m%Y")


def str_pad_int(toadd, key, row, pos, length):
    """
    Get value by key from row and cast as python date
    """
    check_add_row(toadd, key, row, pos)
    if key in toadd and toadd[key] is not None:
        value = toadd[key].strip().zfill(length)
        toadd[key] = value if value.isnumeric() else None


def check_add_row(toadd, key, row, pos):
    """
    Try to find key in row, if not found set to None
    """
    try:
        toadd[key] = row[pos].strip()
        if toadd[key] == '':
            toadd[key] = None
    except IndexError:
        toadd[key] = None







