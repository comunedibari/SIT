# coding=utf-8
""""
Test CDU utils methods and functions.
.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2020-10-29'
__copyright__ = 'Copyright 2015 - 2020, Gis3w'

from django.test import override_settings
from cdu.utils.cdu import CDU, GDALOGRLayer
from .test_api import \
    DATASOURCE_PATH, \
    CURRENT_PATH, \
    ODT_CDU_TEMPLATE, \
    TEST_BASE_PATH, \
    QGS_FILE

from .test_api import \
    G3WSpatialRefSys, \
    CoreGroup, \
    File, \
    QdjangoTestBase, \
    APIClient, \
    QgisProject, \
    add_cdu_config

import json


@override_settings(DATASOURCE_PATH=DATASOURCE_PATH)
class CDUTestUtils(QdjangoTestBase):

    @classmethod
    def setUpClass(cls):
        super(CDUTestUtils, cls).setUpClass()

        cls.client = APIClient()

    @classmethod
    def setUpTestData(cls):

        # main project group
        cls.project_group = CoreGroup(name='Group1', title='Group1', header_logo_img='',
                                      srid=G3WSpatialRefSys.objects.get(auth_srid=4326))

        cls.project_group.save()

        qgis_project_file = File(open('{}{}{}'.format(CURRENT_PATH, TEST_BASE_PATH, QGS_FILE), 'r', encoding='utf-8'))

        # Replace name property with only file name without path to simulate UploadedFileWithId instance.
        qgis_project_file.name = qgis_project_file.name.split('/')[-1]
        cls.project = QgisProject(qgis_project_file)
        cls.project.group = cls.project_group
        cls.project.save()
        qgis_project_file.close()

        # Create a CDU profile.
        cls.cdu_config = add_cdu_config(cls.project.instance, open('{}{}{}'.format(CURRENT_PATH, TEST_BASE_PATH, ODT_CDU_TEMPLATE), 'rb'))

    @classmethod
    def tearDownClass(cls):
        cls.project.instance.delete()
        cls.cdu_config.delete()
        super().tearDownClass()


    def test_CDU_class_utils(self):
        """ Test for main CDU class for cdu calculation """

        # features to use per calculation
        features = "{\"type\":\"FeatureCollection\",\"features\":[{\"type\":\"Feature\",\"geometry\":{\"type\":\"Polygon\",\"coordinates\":[[[1659101.33605825,4857232.86158511,0],[1659094.06563376,4857216.47935786,0],[1659101.86150044,4857212.92206266,0],[1659102.38490422,4857214.01316902,0],[1659103.82201949,4857217.00464536,0],[1659104.57195959,4857218.61130376,0],[1659109.59726924,4857229.36843303,0],[1659103.02373519,4857232.14794917,0],[1659101.33605825,4857232.86158511,0]]]},\"properties\":{\"boundedBy\":[1659094.06563376,4857212.92206266,1659109.59726924,4857232.86158511],\"ogc_fid\":\"399\",\"gid\":\"44571\",\"tipo\":\"T\",\"foglio\":\"33\",\"numero\":\"920\",\"sezione\":null,\"allegato\":\"0\",\"codice_comune\":\"H109\",\"nomefile\":\"H109_003300\",\"task_id\":\"c0ae11c6-e65a-4657-9764-37ce20a66195\",\"g3w_fid\":\"399\"}}]}"

        cdu = CDU(config=self.cdu_config)
        cdu.add_particelle(json.loads(features))

        cdu.calculate()

        a_layers = self.cdu_config.layers_against()
        a_layer = a_layers[0]

        # check calc results
        r = cdu.results
        results = {
            "F33N920SNone": {
                "foglio": "33",
                "numero": "920",
                "sezione": None,
                "area": 159,
                "fields": [],
                "results": [
                    {
                        "id": 0,
                        "layer_id": "tessuti_definitivo4_oss_8640c764_fb9d_4cf4_bdde_c5ff459d35e7",
                        "name": "tessuti_definitivo4_oss",
                        "alias": "Tessuti definitivo4 oss",
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": [
                                [
                                    [
                                        1659109.0494931196,
                                        4857228.19586876,
                                        0.0
                                    ],
                                    [
                                        1659104.57195959,
                                        4857218.61130376,
                                        0.0
                                    ],
                                    [
                                        1659103.82201949,
                                        4857217.00464536,
                                        0.0
                                    ],
                                    [
                                        1659102.38490422,
                                        4857214.01316902,
                                        0.0
                                    ],
                                    [
                                        1659101.86150044,
                                        4857212.92206266,
                                        0.0
                                    ],
                                    [
                                        1659094.06563376,
                                        4857216.47935786,
                                        0.0
                                    ],
                                    [
                                        1659100.8388826728,
                                        4857231.741314445,
                                        0.0
                                    ],
                                    [
                                        1659109.0494931196,
                                        4857228.19586876,
                                        0.0
                                    ]
                                ]
                            ]
                        },
                        "area": 147.28,
                        "perc": 92.89,
                        "fields": [
                            {
                                "name": "link_norme",
                                "alias": "Link norme",
                                "value": "nta,132"
                            }
                        ]
                    },
                    {
                        "id": 1,
                        "layer_id": "tessuti_definitivo4_oss_8640c764_fb9d_4cf4_bdde_c5ff459d35e7",
                        "name": "tessuti_definitivo4_oss",
                        "alias": "Tessuti definitivo4 oss",
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": [
                                [
                                    [
                                        1659100.8388826728,
                                        4857231.741314445,
                                        0.0
                                    ],
                                    [
                                        1659101.33605825,
                                        4857232.86158511,
                                        0.0
                                    ],
                                    [
                                        1659103.02373519,
                                        4857232.14794917,
                                        0.0
                                    ],
                                    [
                                        1659109.59726924,
                                        4857229.36843303,
                                        0.0
                                    ],
                                    [
                                        1659109.0494931196,
                                        4857228.19586876,
                                        0.0
                                    ],
                                    [
                                        1659100.8388826728,
                                        4857231.741314445,
                                        0.0
                                    ]
                                ]
                            ]
                        },
                        "area": 11.28,
                        "perc": 7.11,
                        "fields": [
                            {
                                "name": "link_norme",
                                "alias": "Link norme",
                                "value": "nta,214-nta,215"
                            }
                        ]
                    }
                ]
            }
        }
        self.assertEqual(r, results)




