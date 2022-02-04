from django.conf import settings
from .trasfcoord import converti, tras_param, foglio
import psycopg2
from .settings import DB
from cadastre.utils.cxfprovider import CXFDBProvider
import ogr
import logging

# Get an instance of a logger
logger = logging.getLogger(__name__)

# cadastre censuario database
try:
    DB = settings.DATABASES[settings.CADASTRE_DATABASE]
    DB['schema'] = 'public'
    DB['table'] = 'catasto'
except:
    pass


def load_cxf_catasto(in_file, nomefile, conn, **kwargs):

    # celery task_id process
    task_id = kwargs.get('task_id')

    # data relative SUP file
    data_sup = kwargs.get('data_sup')

    # get db connection data if is not set get default
    CRS = str(kwargs.get('srid', settings.CADASTRE_DATA_SRID))

    def decodeline():
        """ Read a in_file line and decode it """
        return in_file.readline().strip().decode('utf-8', errors='ignore')

    def insert_feature(tipo, nomefile, codice, crs=None):
        """
        Build geometry from CXF reading file create sql INSERT and exec on DB
        Reading line by line CXF file
        """

        # geometry list object
        geometria = []
        area = []

        # label text
        lt_testo = decodeline()

        # angle geometry
        angolo = decodeline()

        # origin coordinates
        x = float(decodeline())
        y = float(decodeline())
        gauss = converti(foglio.metodo, y, x)
        x = gauss[0]
        y = gauss[1]
        orig1 = [x, y]
        x = float(decodeline())
        y = float(decodeline())
        gauss = converti(foglio.metodo, y, x)
        x = gauss[0]
        y = gauss[1]
        orig2 = [x, y]

        # get islands number
        nrisole = int(decodeline())

        # total vertices number
        nrverttot = int(decodeline())

        nrvertisola = []
        for x in range(1, nrisole + 1):
            to_append = int(decodeline())
            nrvertisola.append(to_append)
        nrvertisola.insert(0, nrverttot - sum(nrvertisola))
        nrvertisola.insert(0, nrverttot - sum(nrvertisola))

        # building WKT geomentry
        sgeometria = "POLYGON"
        for isola, vert in enumerate(nrvertisola):
            sgeometria = sgeometria + "("
            for n in range(0, vert):
                x = float(decodeline())
                y = float(decodeline())
                gauss = converti(foglio.metodo, y, x)
                x = gauss[0]
                y = gauss[1]
                geom = coord = [x, y]
                if n == vert - 1:
                    if isola == nrisole + 1:
                        sgeom = str(x) + " " + str(y) + ")"
                    else:
                        sgeom = str(x) + " " + str(y) + "),"
                else:
                    sgeom = str(x) + " " + str(y) + ","
                sgeometria = sgeometria + sgeom
                geometria.append(coord)
            area.append(geometria)
        sgeometria = sgeometria + ")"

        # get municipality code
        codice_comune = nomefile[0:4]

        # we get sezione from nomme file as AdE specifics
        # set to none if == '_'
        sezione = nomefile[4:5]
        if sezione == '_':
            sezione = ''

        nomefile = nomefile[0:11]

        # sigla foglio che ri recupera dal nome del file
        # rimoviamo gli '0' davanti
        _foglio= nomefile[5:9].lstrip('0')

        # numero
        numero = codice[0:5]

        # allegato
        allegato = nomefile[10:11]

        # check if geometry is correct
        ogr_geom = ogr.CreateGeometryFromWkt(sgeometria)
        if not ogr_geom.IsValid():
            ogr_geom.CloseRings()
            sgeometria = ogr_geom.ExportToWkt()

        # check if geometriy is valid else log it
        if ogr_geom.IsValid():
            return {
                'nomefile': nomefile,
                'codice_comune': codice_comune,
                'tipo': tipo,
                'sezione': sezione,
                'allegato': allegato,
                'foglio': _foglio,
                'numero': numero,
                'task_id': task_id,
                'sgeometria': sgeometria,
                'CRS': CRS

            }
        else:
            logger.debug(sgeometria)
            return None


    #Foglio e una classe (oggetto vuoto)
    #definisco il crs di output CRS
    setattr(foglio, "outcrs", CRS)

    #VADO A SETTARE GLI ATTRIBUTI (METODO, TRASF (FUNXZIONE PER LA TRASFORMAZIONE)
    tras_param(nomefile)

    in_line = None
    rows_to_insert = []
    while in_line != 'EOF':
        in_line = decodeline()
        if in_line == 'BORDO':
            in_line = decodeline()
            #FABBRICATI
            if in_line[len(in_line)-1] == '+':
                rows_to_insert.append(insert_feature('F', nomefile, in_line))
            #STRADE
            elif in_line == 'STRADA':
                rows_to_insert.append(insert_feature('S', nomefile, in_line))
            #ACQUA
            elif in_line == 'ACQUA':
                rows_to_insert.append(insert_feature('A', nomefile, in_line))
            #TERRENO
            elif len(in_line) != 11:
                rows_to_insert.append(insert_feature('T', nomefile, in_line))

    with CXFDBProvider(**conn) as provider:
        provider.insert_table_data(rows_to_insert)
