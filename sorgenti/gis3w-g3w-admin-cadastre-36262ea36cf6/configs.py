from .models import *

TP_FORNITURA_CATASTO = 'CATASTO'
TP_FORNITURA_DOCFA = 'DOCFA'
TP_FORNITURA_CXF = 'CXF'

TP_FORNITURE = {
    TP_FORNITURA_CATASTO: {
        'name': 'CATASTO',
        'value': TP_FORNITURA_CATASTO
    },
    TP_FORNITURA_DOCFA: {
        'name': 'DOCFA',
        'value': TP_FORNITURA_DOCFA
    },
    TP_FORNITURA_CXF: {
        'name': 'CXF',
        'value': TP_FORNITURA_CXF
    },
}

FILE_FAB_EXT = '.FAB'
FILE_TER_EXT = '.TER'
FILE_SOG_EXT = '.SOG'
FILE_TIT_EXT = '.TIT'

# layers to edit and work
CADASTRE_LAYERS = {
    'catasto': {
        'model': 'Catasto',
        'geoSerializer': None,
        'geometryType': 'MultiPolygon',
        'clientVar': 'catasto',  # variable name for client
    },
}

'''
    'numeri_civici': {
        'model': None,
        'clientVar': 'numeri_civici',  # variable name for client
        'geoSerializer': None,
        'geometryType': 'Point',
    },
    '''

# layers with data
CADASTRE_DATA_LAYERS = {
    'unita_immodiliari': {
        'model': UnitaImmobiliare
    },
    'particella': {
        'model': Particella
    }
}


CMD_TASK_ID_PREFIX = 'CMD__'

# searchs options
CADASTRE_SEARCHES_OPTIONS = [
    'CF', #Fiscal code
    'NS' #NameSurname
]

