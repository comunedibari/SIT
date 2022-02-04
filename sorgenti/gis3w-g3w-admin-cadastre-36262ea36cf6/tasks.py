from __future__ import absolute_import
from django.conf import settings
from django.db import transaction
from celery import shared_task, current_task
from celery.utils.log import get_task_logger
import json
from .utils.data import \
    CatastoFAB, \
    CatastoTER, \
    FornituraDM_PL, \
    FornituraDOC, \
    FornituraDC, \
    DatiDOCFA, \
    CatastoCXF, \
    get_archivi_docfa
from .models import Planimetrie, DOCFA, ImportDOCFA
from zipfile import ZipFile
import re
from datetime import datetime

logger = get_task_logger(__name__)


@shared_task(name="load_catasto_data", bind=True)
def load_catasto_data(self, filename, type, is_aggiornamento=False):
    logger.info("Start Execution CATASTO")
    task_id = self.request.id
    file = open(filename, 'r')
    if type == 'FAB':
        cFAB = CatastoFAB(file, task_id=task_id, is_aggiornamento=is_aggiornamento, current_task=current_task)
        cFAB.loadData()
    else:
        cTER = CatastoTER(file, tipoTit=type, task_id=task_id, is_aggiornamento=is_aggiornamento,
                          current_task=current_task)
        cTER.loadData()

    file.close()
    logger.info("Stop Execution CATASTO")
    return json.dumps({'imported': True})


@shared_task(name="load_cxf_data", bind=True)
def load_cxf_data(self, filename, data_sup):
    logger.info("Start Execution CXF")
    task_id = self.request.id
    file = open(filename, 'r')

    cCXF = CatastoCXF(file, data_sup=data_sup, task_id=task_id, current_task=current_task)
    cCXF.loadData()

    file.close()
    logger.info("Stop Execution CXF")
    return json.dumps({'imported': True})


def _load_docfa_data(task_id, filename):
    """
    Private method to load docfa zip file for  riuse it.
    :param task_id: celery task_id
    :param filename: path file to import
    :return: None
    """

    zfile = ZipFile(filename, 'r')
    zfileInfoList = zfile.infolist()

    archiviDocfa = {}
    dati = DatiDOCFA()

    # read unique DOCFA fornitura zip file
    get_archivi_docfa(zfile, dati, archiviDocfa)

    with transaction.atomic(using=settings.CADASTRE_DATABASE):
        DOC = FornituraDOC(archiviDocfa['DOC'], dati, task_id=task_id)
        DOC.loadData()

        DC = FornituraDC(archiviDocfa['DC'], dati, task_id=task_id)
        DC.loadData()

        DM_PL = FornituraDM_PL(archiviDocfa['DM_PL'], dati, task_id=task_id)
        DM_PL.loadData()

        # insert data into DOCFA and Planimetrie
        for protocollo_docfa, docfa_data in dati.docfa.items():
            docfa_data['periodo'] = "{}-{}".format(dati.periodo[0:4], dati.periodo[4:6])
            docfa_data['protocollo'] = protocollo_docfa
            docfa_data['fornitura'] = dati.nome_fornitura
            docfa_model, created = DOCFA.objects.update_or_create(**docfa_data)
            docfa_model.task_id = task_id
            docfa_model.save()

        for nome_file_planimetria, planimetria_data in dati.planimetrie.items():
            planimetria_data['nome_file'] = nome_file_planimetria
            planimetria_model, created = Planimetrie.objects.update_or_create(**planimetria_data)
            planimetria_model.task_id = task_id
            planimetria_model.save()

    zfile.close()

    importDOCFA = ImportDOCFA.objects.get(task_id=task_id)
    importDOCFA.data_elaborazione = datetime.strptime(dati.data_elaborazione, '%d%m%Y').date()
    importDOCFA.codice_comune = dati.comune
    importDOCFA.n_record = dati.n_record
    importDOCFA.n_docfa = len(dati.docfa.items())
    importDOCFA.n_planimetrie = len(dati.planimetrie.items())
    importDOCFA.save()



@shared_task(name="load_docfa_data", bind=True)
def load_docfa_data(self, filename):
    logger.info("Start Execution DOCFA")
    logger.info("Importing DOCFA file: {}".format(filename))

    task_id = self.request.id

    _load_docfa_data(task_id, filename)

    logger.info("Stop Execution DOCFA")
    return json.dumps({'imported': True})