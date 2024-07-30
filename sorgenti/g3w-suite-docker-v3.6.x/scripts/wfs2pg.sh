#! /bin/bash

source ".env_wfs2pg"

ogrinfo -ro wfs:https://gestione-autorizzazioni.comune.bari.it/cnt/geoserver/stretor_ext/wfs


echo -e "\e[41mGET stretor_ext:db_grafo_edificio\e[0m"
ogr2ogr -lco GEOMETRY_NAME=geom  -overwrite -f "PostgreSQL" -a_srs EPSG:32633  PG:"dbname=$DB_DATABASE user=$DB_USER password=$DB_PASS host=$DB_HOST" -nln fw.db_grafo_edificio \
"WFS:https://gestione-autorizzazioni.comune.bari.it/cnt/geoserver/stretor_ext/wfs?service=WFS&request=GetFeature&version=1.1.0&typeName=stretor_ext:db_grafo_edificio&srsName=EPSG:32633" -nlt PROMOTE_TO_MULTI
echo -e "\e[42m END\e[0m"

echo -e "\e[41mGET tretor_ext:db_grafo_civico\e[0m"
ogr2ogr -lco GEOMETRY_NAME=geom  -overwrite -f "PostgreSQL" -a_srs EPSG:32633  PG:"dbname=$DB_DATABASE user=$DB_USER password=$DB_PASS host=$DB_HOST" -nln fw.db_grafo_civico \
"WFS:https://gestione-autorizzazioni.comune.bari.it/cnt/geoserver/stretor_ext/wfs?service=WFS&request=GetFeature&version=1.1.0&typeName=stretor_ext:db_grafo_civico&srsName=EPSG:32633" -nlt PROMOTE_TO_MULTI
echo -e "\e[42m END\e[0m"

echo -e "\e[41mGET tretor_ext:db_grafo_arco\e[0m"
ogr2ogr -lco GEOMETRY_NAME=geom  -overwrite -f "PostgreSQL" -a_srs EPSG:32633  PG:"dbname=$DB_DATABASE user=$DB_USER password=$DB_PASS host=$DB_HOST" -nln fw.db_grafo_arco \
"WFS:https://gestione-autorizzazioni.comune.bari.it/cnt/geoserver/stretor_ext/wfs?service=WFS&request=GetFeature&version=1.1.0&typeName=stretor_ext:db_grafo_arco&srsName=EPSG:32633" -nlt PROMOTE_TO_MULTI
echo -e "\e[42m END\e[0m"



