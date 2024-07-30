from django.conf import settings
from django.http.response import HttpResponse
from core.utils.qgisapi import get_qgis_layer
from qdjango.utils.structure import datasource2dict, get_schema_table
from qdjango.utils.data import makeDatasource
from qdjango.models import Layer as QdjangoLayer
from cdu.signals import \
    before_calculate, \
    before_write_document, \
    after_calculate, \
    after_write_document
from py3o.template import Template
try:
    from cadastre.models import Particella, IstatCodiciUi
except:
    pass

try:
    import ogr
except:
    from osgeo import ogr
import json
import hashlib
import time
import os
import requests
import mimetypes

from qgis.core import QgsJsonUtils, QgsRectangle, QgsCoordinateReferenceSystem, QgsCoordinateTransform, QgsCoordinateTransformContext
from qgis.PyQt.QtCore import QVariant

import logging

logger = logging.getLogger('g3wadmin.cdu')


class QGSLayer(object):
    """ QgsVectorLayer wrapper"""

    def __init__(self, layer):

        self._layer = layer

        # get QgsVectorLayer
        self._qgs_layer = None


class GDALOGRLayer(object):
    """ GDAL/OGR wrapper"""

    def __init__(self, layer):

        self._layer = layer

        self._ogr_layer = None
        self._datasource = self.get_gdalogr_datasource()
        self.instance_gdalogr_layer()

    def get_gdalogr_datasource(self):

        self.layer_type = self._layer.layer.layer_type

        if self.layer_type in (QdjangoLayer.TYPES.ogr, QdjangoLayer.TYPES.gdal):
            return self._layer.layer.datasource, 0
        elif self.layer_type in (
                QdjangoLayer.TYPES.postgres,
                QdjangoLayer.TYPES.spatialite,
                QdjangoLayer.TYPES.wfs
        ):
            dts = datasource2dict(self._layer.layer.datasource)

            if self.layer_type == QdjangoLayer.TYPES.postgres:
                schema, table = get_schema_table(dts['table'])
                return "PG: host={} dbname={} user={} password={} port={}".format(
                    dts['host'],
                    dts['dbname'],
                    dts['user'],
                    dts['password'],
                    dts['port']
                ), '{}.{}'.format(schema, table), dts['sql']
            elif self.layer_type == QdjangoLayer.TYPES.wfs:
                return f"WFS:{dts['url']}", dts['typename'], ''
            else:
                return dts['dbname'], str(dts['table'].strip('\"')), ''


    def instance_gdalogr_layer(self):

        self._ogr_connection = ogr.Open(self._datasource[0], 0)
        self._ogr_layer = self._ogr_connection.GetLayer(self._datasource[1])
        if self._datasource[2]:
            self._ogr_layer.SetAttributeFilter(self._datasource[2])


    def get_ogr_layer(self):
        return self._ogr_layer

    def get_cdu_layer(self):
        return self._layer

    def __iter__(self):
        return self._ogr_layer

    def reset(self):
        self._ogr_layer.ResetReading()

    def destroy(self):
        self._ogr_layer.Destroy()


class CDU(object):
    """Main CDU class for 'calculate' and 'print' actions"""

    def __init__(self, config):

        # CDU Configs model instance
        self.config = config

        # GeoJSON FeatureCollection string from client
        # Initialize with none
        self._geojson_particelle = None

        # Add 'catasto' layer informations
        # g3w-admim qdjango model layer instance
        self._cdu_layer_catasto = self.config.layer_catasto()

        # Initialize layer field  for 'fogli, 'numero', 'sezione'.
        self._field_foglio, self._field_numero, self._field_sezione = self._get_fields_foglio_numero()

        # Get QgsVectorLayer of 'catasto' layer.
        self._qgslayer_catasto = get_qgis_layer(self._cdu_layer_catasto.layer)

        # Initialize against layers
        self._against_qgslayer = []

        # initialize results:
        self.results = {}

    def _get_fields_foglio_numero(self):
        """
        Get and return field name foglio and numero of cadastre layer
        :return: tuple
        """
        return self._cdu_layer_catasto.getFieldFoglio(), self._cdu_layer_catasto.getFieldParticella(), \
               self._cdu_layer_catasto.getFieldSezione()

    def _get_foglio_numero_from_feature(self, qgsfeature_particella):
        """
        Return foglio and numero value from feature
        :param qgsfeature_particella: QgsFeature instance
        :return: tuple
        """

        values = [
            qgsfeature_particella.attribute(self._field_foglio),
            qgsfeature_particella.attribute(self._field_numero)
        ]

        if self._field_sezione:
            value_sezione = qgsfeature_particella.attribute(self._field_sezione)
            if not value_sezione:
                value_sezione = None
            values.append(value_sezione)
        else:
            values.append('')

        return values

    def _make_key_results(self, feature_particella):
        """
        Create unique key results
        :param feature_particella: GeoJSON FeatureCollection
        :return:
        """
        return "F{}N{}S{}".format(*self._get_foglio_numero_from_feature(feature_particella))

    def add_against_layer(self, against_layer):
        """
        Add against layer to CDU instance
        :param against_layer: g3w-admin model layer instance
        :return:
        """
        self._against_qgslayer.append(get_qgis_layer(against_layer.layer))

    def add_particelle(self, particelle):
        """
        Create 'particelle' layer for geo operations
        :param particelle: GeoJson FeatureCollection string
        """

        # Set geojson particelle came from client
        self._geojson_particelle = particelle

        self._particelle_qgsfatures = QgsJsonUtils.stringToFeatureList(
            json.dumps(particelle),
            self._qgslayer_catasto.fields(),
            None  # UTF8 codec
        )

        # TODO: also in 3.16, try with later version
        # There is something wrong in QGIS 3.10 (fixed in later versions)
        # so, better loop through the fields and set attributes individually
        cont_f = 0
        for geojson_feature in particelle['features']:
            for name, value in geojson_feature['properties'].items():
                try:
                    self._particelle_qgsfatures[cont_f].setAttribute(name, value)
                except:
                    pass
            cont_f +=1

    def _get_comune(self, cod_com):
        """
        Get Comune data from geojson of particlelle
        """

        # Get only first parcel (it could be not correct if we have cadastre data from many comuni)
        toret = {
            'cod': cod_com,
        }

        try:
            ic = IstatCodiciUi.objects.get(codice_catastale_del_comune=cod_com)
            toret.update({
                'name': ic.denominazione_in_italiano
            })
        except Exception as e:
            logger.error(f'[CDU] - COMUNE DATA: {e}')

        return toret


    def _init_result_particella(self, key_particella, qgsfeature_particella, qgsgeometry_particella):

        # add data to results cdu calculation
        if not self.results.get(key_particella):
            self.results[key_particella] = dict(zip(
                [self._field_foglio, self._field_numero, self._field_sezione],
                self._get_foglio_numero_from_feature(qgsfeature_particella)
            ))

            # If is set get AREA value from censuario data
            # by default use particella and caratteristica particella fro get area
            # --------------------------------------------------------------------
            # add area:
            try:
                cadastre_area = Particella.area(
                    qgsfeature_particella.attribute('codice_comune'),
                    qgsfeature_particella.attribute(self._field_foglio).zfill(4),
                    qgsfeature_particella.attribute(self._field_numero).zfill(5),
                    qgsfeature_particella.attribute(self._field_sezione),
                )
            except Exception as e:
                logger.error(f"Getting AREA from cadastre: {e}")
                cadastre_area = None

            logger.debug(qgsgeometry_particella.area())

            self.results[key_particella]['area'] = cadastre_area if cadastre_area else int(round(qgsgeometry_particella.area()))
            self.results[key_particella]['censuario_area'] = bool(cadastre_area)

            # add comune
            try:
                self.results[key_particella]['comune'] = self._get_comune(qgsfeature_particella.attribute('codice_comune'))
            except:
                logger.info(f"Cadastre layer doesn't has 'codice_comune' property: {qgsfeature_particella}")


            # add cadastre plus fields results
            plus_fields_catasto = self._cdu_layer_catasto.getPlusFieldsCatasto()
            res_plus_field_catasto = []
            if 'fields' in self.results[key_particella]:
                for field in plus_fields_catasto:
                    self.results[key_particella]['fields'].append(
                        {
                            'name': field['name'],
                            'alias': field['alias'],
                            'value': qgsfeature_particella.attribute(field['name'])
                        })

            self.results[key_particella]['fields'] = res_plus_field_catasto
            self.results[key_particella]['results'] = []

    def _particelle_features_bbox(self):
        """Comulative BoundingBox of 'particelle' features"""

        xmin=None
        ymin=None
        xmax=None
        ymax=None

        for qgsfeature_particella in self._particelle_qgsfatures:

            bbox = qgsfeature_particella.geometry().boundingBox()
            if not xmin or bbox.xMinimum() < xmin:
                xmin = bbox.xMinimum()

            if not ymin or bbox.yMinimum() < ymin:
                ymin = bbox.yMinimum()

            if not xmax or bbox.xMaximum() > xmax:
                xmax = bbox.xMaximum()

            if not ymax or bbox.yMaximum() > ymax:
                ymax = bbox.yMaximum()


        return QgsRectangle(xmin, ymin, xmax, ymax)

    def reproject_particelle(self, from_srid_code, to_srid_code):
        """Reproject particelle feature"""

        reprojected_particelle = []
        for qgsfeature_particella in self._particelle_qgsfatures:
            geometry = qgsfeature_particella.geometry()
            self.reproject_geometry(geometry, from_srid_code, to_srid_code)
            qgsfeature_particella.setGeometry(geometry)
            reprojected_particelle.append(qgsfeature_particella)

        self._particelle_qgsfatures = reprojected_particelle

    def reproject_geometry(self, geometry, from_srid_code, to_srid_code):
        """Reproject geomtry from to srid"""

        to_srid = QgsCoordinateReferenceSystem(f'EPSG:{to_srid_code}')
        from_srid = QgsCoordinateReferenceSystem(f'EPSG:{from_srid_code}')
        ct = QgsCoordinateTransform(
            from_srid, to_srid, QgsCoordinateTransformContext())
        geometry.transform(ct)

    def update_area4reprojected_parcels(self):
        """Update 'area' results value for reprojected parcels"""

        for qgsfeature_particella in self._particelle_qgsfatures:
            key_particella = self._make_key_results(qgsfeature_particella)
            if not self.results[key_particella]['censuario_area']:
                geometry = qgsfeature_particella.geometry()
                self.results[key_particella]['area'] = int(round(geometry.area()))

    def calculate(self):
        """
        Make intersection of particelle in against layer features adn put results in results property
        :return:
        """

        before_calculate.send(self)

        # Start time machine measure
        # --------------------------
        calculate_start_time = time.time()

        # make intersects on againsts layer for every feature in particelle
        # for id results
        id_result = 0

        # BoundindingBox of featurecollections
        working_bbox = self._particelle_features_bbox()


        # for every against_layer for every feature in against_layer
        #for against_layer in self._against_layers:
        for alay in self.config.layers_against():

            against_qgslayer = get_qgis_layer(alay.layer)
            against_qgslayer.reload()

            # Fields to use into against layer
            cdu_against_layer_fields = alay.getLayerFieldsData()

            # Check if feature particelle has to be reprojected.
            particelle_to_reproject = alay.layer.srid != self.config.layer_catasto().layer.srid

            if particelle_to_reproject:
                self.reproject_particelle(self.config.layer_catasto().layer.srid, alay.layer.srid)
                working_bbox = self._particelle_features_bbox()

            # pre select by rect against_layer
            against_qgslayer.selectByRect(working_bbox)

            for qgsfeature_particella in self._particelle_qgsfatures:

                qgsgeometry_particella = qgsfeature_particella.geometry()

                # Build unique 'key result'
                key_particella = self._make_key_results(qgsfeature_particella)

                # Initialize results by particella feature
                self._init_result_particella(key_particella, qgsfeature_particella, qgsgeometry_particella)

                for qgsfeature_against in against_qgslayer.selectedFeatures():

                    # get against geometry
                    qgsgeometry_against = qgsfeature_against.geometry()

                    # check intersections
                    if qgsgeometry_against and qgsgeometry_against.intersects(qgsgeometry_particella):

                        # get intersection geomentry and area data:
                        geometry_against_intersection = qgsgeometry_particella.intersection(qgsgeometry_against)

                        try:
                            geometry_against_intersection_area = geometry_against_intersection.area()
                            geometry_against_intersection_area_perc = geometry_against_intersection_area / \
                                                                       qgsgeometry_particella.area() * 100 \
                                if geometry_against_intersection_area else None



                            # Again calcolous for are for original srid measure system
                            if self.results[key_particella]['censuario_area']:
                                geometry_against_intersection_area = self.results[key_particella]['area'] * \
                                                                     geometry_against_intersection_area / \
                                                                     qgsgeometry_particella.area()
                            else:
                                # return to original srid for geometry_against_insersection
                                if particelle_to_reproject:
                                    self.reproject_geometry(geometry_against_intersection,
                                                            alay.layer.srid,
                                                            self.config.layer_catasto().layer.srid)

                                    geometry_against_intersection_area = geometry_against_intersection.area()

                        except Exception as e:
                            geometry_against_intersection_area = 0.0
                            geometry_against_intersection_area_perc = 0.0


                        # make sub results dict
                        res = {
                            'id': id_result,
                            'layer_id': against_qgslayer.id(),
                            'name': against_qgslayer.name(),
                            'alias': alay.alias,
                            'geometry': json.loads(geometry_against_intersection.asJson())
                                if geometry_against_intersection else None,
                            'area': round(geometry_against_intersection_area, 2)
                            if geometry_against_intersection_area else None,
                            'perc': round(geometry_against_intersection_area_perc, 2)
                            if geometry_against_intersection_area_perc else None,
                            'fields': list()
                        }

                        # add fields data
                        for field in cdu_against_layer_fields:
                            value = qgsfeature_against.attribute(field['name'])
                            res['fields'].append(
                                {
                                'name': field['name'],
                                'alias': field['alias'],
                                'value': value if value != QVariant() else str(value)
                            })

                        self.results[key_particella]['results'].append(res)

                        # ne id_result
                        id_result += 1

            if particelle_to_reproject:
                self.reproject_particelle(alay.layer.srid, self.config.layer_catasto().layer.srid)
                working_bbox = self._particelle_features_bbox()
                self.update_area4reprojected_parcels()

        # End time machine measure
        # --------------------------
        calculate_end_time = time.time()

        after_calculate.send(self)

        # Logging
        logger.debug("--- {} seconds ---".format(calculate_end_time - calculate_start_time))

    def _get_session_key(self):
        """
        Create ande return key session to store and retrive results data.
        :return:
        """
        return "CDU_".format(self.config.pk)

    def save_in_session(self, request):
        """
        Get results and punt into request sessions
        :param request:
        :return:
        """
        request.session[self._get_session_key()] = self.results

    def get_from_session(self, request):
        """
        Retrive results data from session
        :param request:
        :return:
        """
        return request.session[self._get_session_key()]

    def destroy(self):
        """
        Destroy ogr object
        :return:
        """
        self._layer_catasto.destroy()
        for against_layer in self._against_layers:
            against_layer.destroy()

        self._ogr_layer_particelle.Destroy()


class ODTTplItem(object):
    """
    py3o template object
    """
    def __init__(self, data=None):

        if data:
            for k, v in data.items():
                if k not in ('geometry',):
                    if isinstance(v, dict):
                        setattr(self, k, ODTTplItem(v))
                    elif isinstance(v, list):
                        litem = list()
                        for i in v:
                            litem.append(ODTTplItem(i))
                        setattr(self, k, litem)
                    else:
                        setattr(self, k, v)


class ODT(object):
    """
    ODT Base class
    """

    out_filename = "cdu_{}.{}"
    output_format = "odt"

    def __init__(self, config=None, results=None, result_ids_to_show=None, **kwargs):
        self.config = config
        self.results = results
        self.result_ids_to_show = result_ids_to_show

        if 'output_format' in kwargs:
            self.output_format = kwargs['output_format']

        # get map_image if is set
        if 'map_image' in kwargs:
            self.map_image = kwargs['map_image']

        if 'request' in kwargs:
            self.request = kwargs['request']

        self.first_level_groups = self.get_first_level_groups()

        self._create_odt_outfile()

    def _create_odt_outfile(self):
        """
        Create ODT file_name
        """
        self.out_filename_built = self.out_filename.format(time.time(), self.output_format)

    def insert_map_image(self):
        """
        Insert map image from client
        """
        pass

    def write_document(self):
        """
        Write and create odt document
        """
        pass

    def response(self):
        """
        Return response for client
        :return:
        """
        pass

    def get_first_level_groups(self):
        """
        Get groups level 1 by config
        :return:
        """

        layers = [l.layer.qgs_layer_id for l in self.config.layers_against()]

        def readLeaf(layer):
            if 'nodes' in layer:
                children = []
                for node in layer['nodes']:
                    to_append = readLeaf(node)
                    if to_append:
                        children.append(to_append)

                if children:
                    return children
            else:
                if layer['id'] in layers:
                    return layer['id']

        config_groups = []
        for l in eval(self.config.project.layers_tree):
            to_collect = readLeaf(l)
            if to_collect:
                config_groups.append(l['name'])

        return config_groups

    def build_tree(self, results, deep=2):
        """
        Build tree results by project layers tree
        """

        # rebuild results by layer_id

        comulated_results = {}
        # for r in results:
        #     '''
        #     if r['layer_id'] in comulated_results:
        #         if r['area']:
        #             comulated_results[r['layer_id']]['area'] += r['area']
        #         if r['perc']:
        #             comulated_results[r['layer_id']]['perc'] += r['perc']
        #     else:
        #     '''
        #     if r['area']:
        #         comulated_results[r['layer_id']] = r
        # results = comulated_results

        level = {}

        # oggetto ti appoggio per piu layer id nei risultati
        class scatola(object):

            def __init__(self):
                self.children = []

        def readLeaf(layer, level):
            current_level = level
            if 'nodes' in layer:
                level += 1
                children = []
                for node in layer['nodes']:
                    to_append = readLeaf(node, level)
                    if to_append:
                        if isinstance(to_append, list):
                            for i in to_append:
                                children.append(i)
                        else:
                            if isinstance(to_append, scatola):
                                children = children + to_append.children
                            else:
                                children.append(to_append)

                if children:
                    if current_level <= 1:
                        return {'group_name': layer['name'], 'subject': '1', 'groups': children}
                    else:
                        return children
            else:

                # aggiungo tutti i layer non cumulati
                s = scatola()
                for r in results:
                    if layer['id'] == r['layer_id']:
                        s.children.append(r)
                return s

        layers_tree = []
        for l in eval(self.config.project.layers_tree):
            if 'nodes' in l:
                level[l['name']] = 0
                to_collect = readLeaf(l, level[l['name']])

                # pull no group into group empty
                to_append = []
                no_group = []
                if to_collect:

                    for l in to_collect['groups']:

                        if 'group_name' in l:
                            to_append.append(l)
                        else:
                            no_group.append(l)

                    # build empty group
                    if no_group:
                        to_append.append({'group_name': '', 'subject': '1', 'groups': no_group})
                    to_collect['groups'] = to_append
                    layers_tree.append(to_collect)
                else:

                    # case no result for level o group
                    if l['name'] in self.first_level_groups:
                        layers_tree.append({'group_name': l['name'], 'subject': '0', 'groups': []})

        return layers_tree



    @staticmethod
    def factory(config=None, results=None, result_ids_to_show=None, **kwargs):

        # chose class by settings
        classes = {
            'template': ODTTemplate,
            'fusion': ODTFusion
        }

        driver = getattr(settings, 'CDU_PLUGIN_ODT_DRIVER', 'template')
        return classes[driver](config=config, results=results, result_ids_to_show=result_ids_to_show, **kwargs)


class ODTTemplate(ODT):
    """
    Use py3o.template module
    """

    out_filename = "cdu_{}.odt"

    def __init__(self, config=None, results=None, result_ids_to_show=None, **kwargs):

        super(ODTTemplate, self).__init__(config=config, results=results, result_ids_to_show=result_ids_to_show,
                                           **kwargs)

        self.o_template = self._init_o_template()

    def _init_o_template(self):

        return Template(self.config.odtfile.path, self.out_file)

    def _create_odt_outfile(self):

        super(ODTTemplate, self)._create_odt_outfile()
        self.out_file = settings.MEDIA_ROOT + self.out_filename_built

    def write_document(self):
        """
        Create Tpl object item and write it into o_template
        :return:
        """

        before_write_document.send(self)

        tpl_res_items = list()
        for keyres, res in self.results.items():
            if self.result_ids_to_show:
                to_show = list()
                for rdata in res['results']:
                    if str(rdata['id']) in self.result_ids_to_show:
                        to_show.append(rdata)
                res['results'] = to_show

            tpl_res_items.append(ODTTplItem(res))

        # add image map
        if hasattr(self, 'map_image'):
            self.insert_map_image()

        self.o_template.render({'items': tpl_res_items, 'lawItems': []})

        after_write_document.send(self)

    def insert_map_image(self):
        """
        Insert map image arrived from client
        """

        path_to_file_tmp = '{}{}'.format(settings.MEDIA_ROOT,
                                         self.map_image.replace(settings.MEDIA_URL, ''))

        self.o_template.set_image_path('staticimage.map_image', path_to_file_tmp)

    def response(self):

        f = open(self.out_file)
        response = HttpResponse(f.read(), content_type=mimetypes.types_map['.{}'.format(self.output_format)])
        f.close()
        os.remove(self.out_file)
        response['Content-Disposition'] = 'attachment; filename="{}"'.format(self.out_filename_built)
        response.set_cookie('fileDownload', 'true')
        return response


class ODTFusion(ODT):

    def write_document(self):
        """
        Create Tpl object item and write it into o_template
        :return:
        """

        request = self.request if hasattr(self, 'request') else None
        before_write_document.send(self, request=request)

        logger.debug(f'[CDU BEFORE DOC] - {self.results}')

        tpl_res_items = list()
        for keyres, res in self.results.items():
            if self.result_ids_to_show:
                to_show = list()
                for rdata in res['results']:
                    if str(rdata['id']) in self.result_ids_to_show:
                        to_show.append(rdata)
                res['results'] = self.build_tree(to_show)

                # for censuario_area
                res['censuarioarea'] = '1' if res['censuario_area'] else '0'

            tpl_res_items.append(res)

        # ---- test py3o.fusion for pdf print ---
        url = getattr(settings, 'CDU_PLUGIN_FUSION_URL', 'http://localhost:8765/form')

        fields = {
            "targetformat": self.output_format,
            "datadict": json.dumps({'items': tpl_res_items, 'lawItems': []}),
             "image_mapping": "{}",
            "ignore_undefined_variables": 1
        }

        files = {
            'tmpl_file': open(self.config.odtfile.path, 'rb')
        }

        # add map image if is present
        if hasattr(self, 'map_image'):
            fields['image_mapping'] = json.dumps({'map_image': 'staticimage.map_image'})
            files['map_image'] = open('{}{}'.format(settings.MEDIA_ROOT,
                                            self.map_image.replace(settings.MEDIA_URL, '')), 'rb')

        logger.debug(fields)

        # finally POST our request on the endpoint
        r = requests.post(url, data=fields, files=files)

        files['tmpl_file'].close()
        if hasattr(self, 'map_image'):
            files['map_image'].close()

        if r.status_code == 400:
            raise Exception(r.json())
        else:
            self.to_res = r

        after_write_document.send(self, request=request)

    def response(self):

        response = HttpResponse(self.to_res, content_type=mimetypes.types_map['.{}'.format(self.output_format)])
        response['Content-Disposition'] = 'attachment; filename="{}"'.format(self.out_filename_built)
        response.set_cookie('fileDownload', 'true')
        return response
