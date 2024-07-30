# coding=utf-8
"""" General View fo simple reporting
.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2023-06-22'
__copyright__ = 'Copyright 2015 - 2023, Gis3w'
__license__ = 'MPL 2.0'


from django.views.generic import View
from django.http.response import FileResponse
from django.core.exceptions import ValidationError
import qrcode
import io

class QrcodeGeneratorView(View):

    def get(self, request, **kwargs):

        # Get msg parameter
        if not 'msg' in request.GET:
            raise ValidationError('`msg` get params is not provided')



        qr = qrcode.QRCode(
            version=3,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=1,
        )
        qr.add_data(request.GET['msg'])
        qrc = qr.make_image()
        stream = io.BytesIO()
        qrc.save(stream, format='png')
        stream.seek(0)

        return FileResponse(stream, filename='qrcode.png')


