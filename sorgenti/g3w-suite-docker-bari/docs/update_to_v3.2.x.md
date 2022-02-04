# make backup of current db
```
alter database g3wsuite rename to bck_g3wsuite;
```

# create newone
create databse g3wsuite;

\c g3wsuite
create extension postgis;

# copy dump to postgis container
docker cp dumps/g3w_admin_plk_qgis_2_230421.backup g3w-suite-docker-bari_postgis_1:/tmp/

docker exec -it g3w-suite-docker-bari_postgis_1 bash

pg_restore -h localhost -U g3wsuite -d g3wsuite /tmp/g3w_admin_plk_qgis_2_230421.backup

## apply 