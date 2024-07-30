# coding=utf-8
""""
    Test calls to TimbroDigitale WS
.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2021-10-21'
__copyright__ = 'Copyright 2015 - 2021, Gis3w'


from django.conf import settings
from django.test import TestCase

import json
import requests

class TDWSTest(TestCase):

    def test_recuperatoken(self):
        """Test RecuperoToken API"""

        headers = {}
        headers["Authorization"] = settings.CDU_TD_BASIC_AUTH

        url = settings.CDU_TD_BASE_URL + settings.CDU_TD_TOKEN_API_URI
        payload = {
            'grant_type': 'client_credentials',
            'scope': 'read'
        }
        resp = requests.post(url, data=payload, headers=headers)

        self.assertEqual(resp.status_code, 200)


        '''
        Response example
        ---------------------
        {
            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsidGltYnJvX2RpZ2l0YWxlX3Jlc291cmNlX3NlcnZlciJdLCJzY29wZSI6WyJyZWFkIl0sIm9yZ2FuaXphdGlvbiI6IkJBUklfVElNQlJPSUh2QSIsImV4cCI6MTY3MDgxMDYxNCwiYXV0aG9yaXRpZXMiOlsiUk9MRV9URF9DTElFTlQiXSwianRpIjoiOGJjMDYwNDEtYjQyZS00NjMwLTk4ZTctYjIwYmIwM2NiYTEyIiwiY2xpZW50X2lkIjoiQkFSSV9USU1CUk8ifQ.folyaakVZzg0LpNftytvsG7WqGGy5RrUXhbqYQU8AKQ",
            "token_type": "bearer",
            "expires_in": 35999999,
            "scope": "read",
            "organization": "BARI_TIMBROIHvA",
            "jti": "8bc06041-b42e-4630-98e7-b20bb03cba12"
        }
        '''

        jres = resp.json()

        self.assertTrue('access_token' in jres)
        self.assertEqual('token_type', 'bearer')
        self.assertEqual('scop', 'read')
        self.assertEqual('organization', 'BARI_TIMBROIHvA')
        self.assertTrue('jti' in jres)

        print(jres)

    def test_dwhaudit(self):
        """Test Dwh Audit API"""

        headers = {}
        headers["Authorization"] = settings.CDU_TD_BASIC_AUTH

        url = settings.CDU_TD_BASE_URL + settings.CDU_TD_TOKEN_API_URI
        payload = {
            'grant_type': 'client_credentials',
            'scope': 'read'
        }
        resp = requests.post(url, data=payload, headers=headers)

        self.assertEqual(resp.status_code, 200)

        token = resp.json()['access_token']


        headers = {}
        headers["Authorization"] = f"Bearer {resp.json()['access_token']}"
        headers["Content-Type"] = "application/json"

        body = '''{
            "servizioAttribute": {
                "data_evento": "2021-06-15T10:34:39+02:00",
                "comune": "ABCDEFGHIJKLMNOPQRSTUV",
                "host_app": "ABCDEFGHIJKLMNOPQRST",
                "servizio_code": "A653",
                "servizio_nome": "ABCDEFGHIJKLM",
                "cittadino_userid": "556412",
                "cittadino_eta": "25",
                "cittadino_sesso": "M",
                "cittadino_comune": "ABCDEFGHIJKLMNOPQRS",
                "cittadino_provincia": "AGDS",
                "cittadino_regione": "ABCDE",
                "cittadino_autenticazione_forte": true,
                "cittadino_livello_autenticazione": 273,
                "cittadino_canale_autenticazione": "ABCDEFGHIJKLMNOPQ",
                "ente_tipo": "ABCDEFGHIJKLMNOPQR",
                "ente_partita_iva": "ABCDEFGHIJKLMNOPQRSTUVW",
                "ente_userid": "ABCDEFG",
                "ente_comune": "ABCDEFGHIJKLMNOPQRSTUV",
                "ente_provincia": "BA",
                "ente_regione": "PUGLIA",
                "servizio_parametro1": "ABCDE",
                "servizio_parametro2": "ABCDE",
                "servizio_parametro3": "ABCDE",
                "servizio_uri": "ABCDESFFAGGG",
                "servizio_protocollo": "ABCDEFG",
                "servizio_data_richiesta": "2021-06-15T10:34:39+02:00",
                "servizio_autenticazone": false,
                "servizio_inizio": "2021-06-15T10:34:39+02:00",
                "servizio_fine": "2021-06-15T10:34:39+02:00",
                "uuid":"ABCDE-ABCD-ABC"
            }
        }
        '''

        headers = {}
        headers["Authorization"] = f"Bearer {token}"
        headers["Content-Type"] = "application/json"

        url = settings.CDU_TD_BASE_URL + settings.CDU_TD_AUDIT_API_URI
        resp = requests.post(url, json=json.dumps(body), headers=headers)

        print (resp.status_code)
        print (resp.text)

        self.assertEqual(resp.status_code, 200)


