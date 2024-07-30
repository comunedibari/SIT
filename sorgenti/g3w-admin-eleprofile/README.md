# G3W-ADMIN-ELEVATION-PROFILE

Gived a DTM raster layer calculate for every feature of a LineString layer the elevation profile and show on client.

![Admin GUI](docs/images/admin.png)

![Client GUI](docs/images/client.png)


Installation
------------

Add like git submodule from main g3w-admin directory

```bash
gti clone https://github.com/g3w-suite/g3w-admin-elevation-profile.git
mv g3w-admin-elevation-profile <path_to_g3w_location>/g3w-admin/eleprofile
```

Add *eleprofile* module to G3W_LOCAL_MORE_APPS config value inside local_settings.py:

```python
G3WADMIN_LOCAL_MORE_APPS = [
    ...
    'eleprofile',
    ...
]
```


Apply migrations:

```bash
    ./manage.py migrate eleprofile
```

**Compatibile with:**
[![g3w-admin version](https://img.shields.io/badge/g3w--admin-3.5-1EB300.svg?style=flat)](https://github.com/g3w-suite/g3w-admin/tree/v.3.7.x)
[![g3w-suite-docker version](https://img.shields.io/badge/g3w--suite--docker-3.5-1EB300.svg?style=flat)](https://github.com/g3w-suite/g3w-suite-docker/tree/v3.6.x)
[![g3w-admin version](https://img.shields.io/badge/g3w--admin-3.6-1EB300.svg?style=flat)](https://github.com/g3w-suite/g3w-admin/tree/v.3.7.x)
[![g3w-suite-docker version](https://img.shields.io/badge/g3w--suite--docker-3.6-1EB300.svg?style=flat)](https://github.com/g3w-suite/g3w-suite-docker/tree/v3.6.x)
[![g3w-admin version](https://img.shields.io/badge/g3w--admin-3.7-1EB300.svg?style=flat)](https://github.com/g3w-suite/g3w-admin/tree/v.3.7.x)
[![g3w-suite-docker version](https://img.shields.io/badge/g3w--suite--docker-3.7-1EB300.svg?style=flat)](https://github.com/g3w-suite/g3w-suite-docker/tree/v3.6.x)