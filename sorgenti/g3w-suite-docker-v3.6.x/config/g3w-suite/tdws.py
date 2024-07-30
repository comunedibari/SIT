# coding=utf-8
""""Main module for TimbroDigitale WS API

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2021-10-11'
__copyright__ = 'Copyright 2015 - 2021, Gis3w'

import json
import time

from django.conf import settings
from cdu.utils.cdu import ODT

import requests
from requests.structures import CaseInsensitiveDict
from requests.exceptions import Timeout

import datetime
import pytz
import base64
import copy

import logging
logger = logging.getLogger('g3wadmin.cdu')


def date_from_fc(fc):
    """
    Calculate Date of Birth from Fiscal Code
    :param fc: Str fo Fiscal code
    :return: Iso birth date
    """

    fc = fc.upper()

    month_maps = {
        'A': '01',
        'E': '05',
        'P': '09',
        'B': '02',
        'H': '06',
        'R': '10',
        'C': '03',
        'L': '07',
        'S': '11',
        'D': '04',
        'M': '08',
        'T': '12'
    }

    raw_bdate = fc[6:12]
    y = int(fc[6:8])

    date = datetime.date.today()
    current_year = date.strftime("%Y")

    if y < int(str(current_year)[2:4]):
        year = int(f"{str(current_year)[0:2]}{y}")
    else:
        year = int(f"{int(str(current_year)[0:2])-1}{y}")

    m = int(month_maps[fc[8]])
    d = int(fc[9:11])

    return datetime.datetime(year=year, month=m, day=d)


class TDWSAPI(object):
    """Main class for WS API TimbroDigitale"""

    def __init__(self, odt_obj: ODT, request):
        """
        :param request: Django reqquest object
        :paraM odt_obj: ODT instance
        """

        self.odt = odt_obj
        self.request = request

    def _get_token(self):
        """
        Execute RecuperoToken API

        Response example:
        {
            "access_token": "eyJhbGci ...",
            "token_type": "bearer",
            "expires_in": 35999999,
            "scope": "read",
            "organization": "BARI_TIMBROUDDP",
            "jti": "c5c47515-906c-46d8-9d0a-f739822b12ca"
        }
        """

        try:
            headers = {}
            headers["Authorization"] = settings.CDU_TD_BASIC_AUTH

            url = settings.CDU_TD_BASE_URL + settings.CDU_TD_TOKEN_API_URI
            payload = {
                'grant_type': 'client_credentials',
                'scope': 'read'
            }
            resp = requests.post(url, data=payload,headers=headers, timeout=10)

            if resp.status_code != 200:
                logger.error(f"[CDU-TIMBRODIGITALE] RecuperoToken status code {resp.status_code} {resp.text}")
                return None

            return resp.json()['access_token']

        except Timeout:
            logger.error(f"[CDU-TIMBRODIGITALE] Richiesta RecuperoToken timeout")
            return None

        except Exception as e:
            logger.error(f"[CDU-TIMBRODIGITALE] {e}")
            return None

    def _build_nome_comune(self):
        """
        Build nome comune with pipe
        """

        return "|".join(list(set([p['comune']['name'] for p in self.odt.results.values()])))

    def _host_app(self):
        """
        Return HTTP_HOST from request instance.
        """

        if self.request:
            return self.request.META['HTTP_HOST']
        else:
            return ""

    def _servizio_uri(self):
        """
        Return HTTP_REFERER from request instance.
        """

        if self.request:
            return self.request.META['HTTP_REFERER']
        else:
            return ""

    def _get_cittadino_data(self):
        """
        Get data about external user logged
        """

        default_toret = self.request.user.pk, False, 2, 'Anonymous'

        try:
            user = self.request.user
            backend = user.userbackend.backend.lower()

            # Check if SPID user
            return (user.username, True, 1, 'SPID') if backend == 'oidc' else default_toret
        except Exception as e:
            logger.error(f"[CDU-TIMBRODIGITALE][_get_cittadino_data] {e}")
            return default_toret

        return toret

    def _get_ente_user_data(self):
        """
        Return ente user id by user login type.
        """

        default_toret = "", ""

        try:
            backend = self.request.user.userbackend.backend.lower()
            return (self.request.user.username, 'BARI') if backend == 'LDAP' else default_toret
        except Exception as e:
            logger.error(f"[CDU-TIMBRODIGITALE][_get_ente_user_data] {e}")
            return default_toret

    def audit(self):
        """Execute a POST request to Dwh Audit API"""

        # Get token for POST
        #token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsidGltYnJvX2RpZ2l0YWxlX3Jlc291cmNlX3NlcnZlciJdLCJzY29wZSI6WyJyZWFkIl0sIm9yZ2FuaXphdGlvbiI6InRlc3RfZGdzSUF4bSIsImV4cCI6MTkyMzY2NjAyNywiYXV0aG9yaXRpZXMiOlsiUk9MRV9URF9DTElFTlQiXSwianRpIjoiNzM5YzVkNmItZjg0Ny00Nzc3LTgxZmMtZGIyMmUwNTQ4NWJmIiwiY2xpZW50X2lkIjoidGVzdF9kZ3MifQ.Y7Yh-J71bd_uYI7gGACaDWP2WXOYWF6HTkPK8dpO5yM'
        token = self._get_token()
        if not token:
            return

        dt = datetime.datetime.now(tz=pytz.timezone('Europe/Rome')).isoformat()
        comune = self._build_nome_comune()

        uuid = f"{str(time.time()).replace('.', '-')}-{self.request.user.pk}"

        ente_user_id, ente_comune = self._get_ente_user_data()

        cittadino_userid, \
        cittadino_autenticazione_forte, \
        cittadino_livello_autenticazione, \
        cittadino_canale_autenticazione = self._get_cittadino_data()

        dnascita = ""
        try:
            if cittadino_autenticazione_forte:
                dnascita = date_from_fc(cittadino_userid).isoformat()
        except Exception as e:
            logger.error(f"[CDU-TIMBRODIGITALE] Data di nascita errore {e}")

        data = {

            "datamining": {
                "eta_richiedente": "",
                "sesso": "",
                "cod_servizio": "CDU",
                "cod_cittadino": cittadino_userid,
                "uuid_operazione": uuid,
                "data_richiesta": dt,
                "data_nascita": dnascita
            },

            "servizioAttribute": {
                "data_evento": dt,
                "comune": comune,
                "host_app": self._host_app(),
                "servizio_code": "CDU",
                "servizio_nome": self.odt.config.title,
                "cittadino_userid": cittadino_userid,
                "cittadino_eta": "",
                "cittadino_sesso": "",
                "cittadino_comune": "",
                "cittadino_provincia": "",
                "cittadino_regione": "",
                "cittadino_autenticazione_forte": cittadino_autenticazione_forte,
                "cittadino_livello_autenticazione": cittadino_livello_autenticazione,
                "cittadino_canale_autenticazione": cittadino_canale_autenticazione,
                "ente_tipo": "Comune",
                "ente_partita_iva": "",
                "ente_userid": ente_user_id,
                "ente_comune": ente_comune,
                "ente_provincia": "BA",
                "ente_regione": "PUGLIA",
                "servizio_parametro1": comune,
                "servizio_parametro2": len(self.odt.results.values()),
                "servizio_parametro3": base64.b64encode(self.odt.to_res.content).decode('utf-8'),
                "servizio_uri": self._servizio_uri(),
                "servizio_protocollo": "",
                "servizio_data_richiesta": dt,
                "servizio_autenticazone": True if cittadino_livello_autenticazione == 1 else False,
                "servizio_inizio": dt,
                "servizio_fine": dt,
                "uuid": uuid
            }

        }

        # EXECUTE REQUEST
        # ---------------
        try:

            headers = {}
            headers["Authorization"] = f"Bearer {token}"
            headers["Content-Type"] = "application/json"

            # for debugging remove from data servizio_parametro3
            data_to_log = copy.deepcopy(data)
            data_to_log['servizioAttribute']['servizio_parametro3'] = data['servizioAttribute']['servizio_parametro3'][0:40] +'[...]'

            logger.debug(f"[CDU-TIMBRODIGITALE] Dwh Audit ACCESS TOKEN: {token}")
            logger.debug(f"[CDU-TIMBRODIGITALE] Dwh Audit BODY: {json.dumps(data_to_log)}")

            url = settings.CDU_TD_BASE_URL + settings.CDU_TD_AUDIT_API_URI
            resp = requests.post(url, data=json.dumps(data), headers=headers, timeout=10)

            logger.debug(f"[CDU-TIMBRODIGITALE] Dwh Audit response STATUS: {resp.status_code}")

            if resp.status_code != 200:
                logger.error(f"[CDU-TIMBRODIGITALE] Dwh Audit status code {resp.status_code} {resp.text}")
            else:
                logger.info(f"[CDU-TIMBRODIGITALE] Dwh Audit record saved {resp.status_code} {resp.text}")

        except Timeout:
            logger.error(f"[CDU-TIMBRODIGITALE] Richiesta post data timeout")
            return None

        except Exception as e:
            logger.error(f"[CDU-TIMBRODIGITALE] Dwh Audit {e}")






