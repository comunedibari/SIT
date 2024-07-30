# coding=utf-8
""""
Utility python module for CDU testing.
.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2020-10-28'
__copyright__ = 'Copyright 2015 - 2020, Gis3w'


from django.core.files import File
from cdu.models import Configs as CduConfig, Layers as CduLayer


def add_cdu_config(cdu_project, odt_template_file):
    """
    Create a CDU config into DB
    :param cdu_project: Qdjango Project instance.
    :param odt_template_file: File object of odt template file.
    """

    cduconfig = CduConfig(
        title='CDU TEST',
        project=cdu_project,
        output_format='pdf',
        map_image='map',
        odtfile=File(odt_template_file, name=odt_template_file.name.split('/')[-1])
    )

    cduconfig.save()

    layers = {l.name:l for l in cdu_project.layer_set.all()}

    # add relative layers
    layer_cadastre = CduLayer(
        config=cduconfig,
        layer=layers['catasto'],
        fields="{'foglio': 'foglio', 'particella': 'numero', 'sezione': 'sezione', 'plusFieldsCatasto': [], 'aliasFieldsCatasto': {'foglio': 'Foglio', 'particella': 'Particella', 'sezione': 'Sezione'}}",
        catasto=True
    )

    layer_cadastre.save()

    layer_overlayer_polygon = CduLayer(
        config=cduconfig,
        alias='Tessuti definitivo4 oss',
        layer=layers['tessuti_definitivo4_oss'],
        fields="[{'name': 'link_norme', 'alias': 'Link norme'}]",
        catasto=False
    )

    layer_overlayer_polygon.save()

    return cduconfig


