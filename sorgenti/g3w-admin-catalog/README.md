# Catalog module for G3W Suite

This module uses PyCSW and it is based on django-pycsw module.


## Requirements

+ PyCSW


## Cron

A cron job must periodically call the management command `regenerate_catalogs` in order
to update the catalogs.

Typically you will run the cron every 5-10 minutes, depending on how long the process will
take to complete.

The management command can be invoked with `python manage.py regenerate_catalogs`


## Install

```
git clone git@bitbucket.org:gis3w/g3w-admin-catalog.git
mv g3w-admin-catalog catalog
pip install -r catalog/requirements.txt
```


## Configuration

Switch off time zone support or validation of ISO 8601 for inspire metadata will fail.

```
USE_TZ = False
```

Django settings must contain and additional section for PyCSW:

 ```
 PYCSW_SETTINGS = {
    "server": {
        "home": "/",
        "loglevel": "DEBUG",
        "logfile": "/tmp/pycsw.log",
    },
    "manager": {
        "transactions": "false",
        "allowed_ips": "*",
    }
}
```

For wms services:
```
CATALOG_URL_SCHEME = <catalog_url_scheme> ('http', default)
CATALOG_HOST = <catalog_host> ('localhost', default)
CATALOG_PORT = <catalog_port> ('80', default)
```

## Properties data
Load fixtures data for catalog and record model properties
```
loaddata eulicense.json
loaddata inspirelimitationsonpublicaccess.json
```

## Testing


```
python manage.py test catalog
```

To disable slow XSD-bsed XML schema validation, set the environment variable `SKIP_SCHEMA_VALIDATION`.


### Example calls


All records CSW 2.0.2
```
http://localhost:8000/it/catalog/csw/a-test-catalog/?SERVICE=CSW&REQUEST=GetRecords&ELEMENTSETNAME=full&VERSION=2.0.2&TYPENAMES=csw%3ARecord&resulttype=results
```


All records CSW 2.0.2 - API ISO 19139 INSPIRE
```
http://localhost:8000/it/catalog/csw/a-test-catalog/?SERVICE=CSW&REQUEST=GetRecords&ELEMENTSETNAME=full&VERSION=2.0.2&TYPENAMES=csw%3ARecord&resulttype=results&OUTPUTSCHEMA=http://www.isotc211.org/2005/gmd
```

## TODO


### Records
- allow specify GEMET kw for records (now inherited from Catalog)
- allow controlled dict for additional kw (RNDT makes at least one GEMET manadatory)
- data metadata: distributionFormat - get from record (or make it fixed: WFS? Shapefile/GTiff?)

### Missing QGIS3 metadata

#### Record

- MD_DataIdentification/CI_Citation/date creation+publication+revision
- MD_DataIdentification/spatialResolution
- MD_Distribution/distributionFormat
- MD_Distribution/distributorContact
- DQ_AbsoluteExternalPositionalAccuracy
- LI_Lineage


