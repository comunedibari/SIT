import requests
import json

CDU_TD_BASE_URL = 'http://10.10.1.12:8080/'
CDU_TD_TOKEN_API_URI = 'authsvr/oauth/token'
CDU_TD_AUDIT_API_URI = 'ressvr/rest/dwhaudit'
CDU_TD_BASIC_AUTH = 'Basic '
TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsidGltYnJvX2RpZ2l0YWxlX3Jlc291cmNlX3NlcnZlciJdLCJzY29wZSI6WyJyZWFkIl0sIm9yZ2FuaXphdGlvbiI6IkJBUklfVElNQlJPbU5ZVSIsImV4cCI6MTY3MDgyMDM0NCwiYXV0aG9yaXRpZXMiOlsiUk9MRV9URF9DTElFTlQiXSwianRpIjoiYWFlZTRiZmUtNTgzNS00MTc5LTk1ZjQtOWViZTI3ZDEyNjMwIiwiY2xpZW50X2lkIjoiQkFSSV9USU1CUk8ifQ.izamXtzKqOz8awOE4Pq3WQiNbHOqSbdd-3cmgnJO8LI'


body = '''
{
    "datamining": {
        "eta_richiedente": 25,
        "sesso": "M",
        "cod_servizio": "C162",
        "cod_cittadino": "255547",
        "uuid_operazione":"ABCDE-ABCD-ABC"
    },
    "tempiMedi": {
        "data_inizio": "2021-06-15T10:34:39+02:00",
        "data_fine": "2021-06-15T10:34:39+02:00",
        "tempo_esecuzione": 613,
        "cod_servizio": "C126",
        "nome_servizio": "ABCDEFGHIJKLMNOPQRSTUVWXY",
        "cod_user": "255547",
        "uuid_operazione":"ABCDE-ABCD-ABC"
    },
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

print(body)

headers = {}
headers["Authorization"] = f"Bearer {TOKEN}"
headers["Content-Type"] = "application/json"

url = CDU_TD_BASE_URL + CDU_TD_AUDIT_API_URI

resp = requests.post(url, data=body, headers=headers)

print (resp.status_code)
print (resp.text)