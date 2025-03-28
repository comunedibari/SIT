# Sistema Informativo Territoriale Città metropolitana di Bari (E-GOV 2 Servizi interattivi)
## INTRODUZIONE
Il progetto prevede la realizzazione di un Sistema Informativo Territoriale (SIT) rappresentato da un insieme di strumenti informatici concepiti per descrivere ed analizzare elementi, eventi e fenomeni inerenti la superficie terrestre. La tecnologia SIT integra in un unico ambiente le più comuni operazioni legate all’uso di database (interrogazioni – query – analisi statistiche, etc.) con i benefici dell’analisi geografica consentita dall’uso di mappe cartografiche. Questa particolarità distingue il SIT dagli altri sistemi di informazione e fa di esso un potente strumento utilizzabile da molteplici operatori privati e pubblici, per pianificare gli eventi, predire i risultati e definire strategie. Il SIT consente di creare mappe (tematismi), integrare informazioni, visualizzare scenari e sviluppare effettive soluzioni esprimibili sia in forma cartografica che in forma quali-quantitativa.

## Licenza
Il software è rilasciato con licenza aperta ai sensi dell'art. 69 comma 1 del <a href="https://cad.readthedocs.io/" rel="nofollow">Codice dell’Amministrazione Digitale</a> con una licenza <a href="https://spdx.org/licenses/AGPL-3.0-or-later.html" rel="nofollow">AGPL-3.0-or-later</a>
 
## INFORMAZIONI GENERALI
Il SIT per la Città metropolitana di Bari si compone di un modulo di Front Office e di un modulo di Back Office aventi le finalità di seguito riportate:

### Finalità del modulo di FRONT OFFICE
Il modulo di front office è una web application che permette ai cittadini ed agli operatori dei comuni di:
- **consultare gli strati cartografici attraverso la sovrapposizione e l’interrogazione dei diversi layer informativi;**
- **aggiornare i dati cartografici ed alfanumerici che compongono gli strati carto-grafici;**
- **stampare stralci di mappe con relativa legenda e cartiglio;**
- **consultare i dati catastali e le relative normative;**
- **generare il Certificato di Destinazione Urbanistica (CDU) pro-forma.**

### Finalità del modulo di BACK OFFICE
Il back office permette la gestione simultanea, di più enti e ne consente una propria personalizzazione. 

Il modulo di back office è una web application, ad uso esclusivo dell'Ente e permette di gestire:
- **La banca dati cartografica;**
- **La pubblicazione dei progetti cartografici;**
- **Gestione degli utenti e dei gruppi con i relativi accessi ai progetti ed alle funzio-nalità;**
- **Personalizzazione dei contenuti del sistema di Front-Office;**
- **Aggiornamento dei dati catastali e delle normative;**
- **Predisposizione dei template per la stampa e produzione del CDU;**
- **Gestione del catalogo e dei metadati.**
- **Pubblicazione di layer WFS 3.0 su PDND

 Di seguito i sotto moduli di cui si compone il Sistema:
- **GeoDatabase;** 
- **Modulo Map Server;**
- **Portale di accesso;**
- **Modulo client WebGIS;**
- **Modulo di gestione utenti e gruppi;**
- **Modulo di gestione dei progetti cartografici;**
- **Modulo dei widget di ricerca;**
- **Modulo di gestione delle normative;**
- **Modulo per la gestione del censuario catastale;**
- **Modulo gestione Metadati.**

### Dipendenza piattaforme esterne
Il sistema è stato realizzato utilizzando la piattaforma open source G3W-Suite: https://github.com/g3w-suite  
