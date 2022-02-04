from django.conf import settings
from cadastre.models import TransformCatasto
import os
import sys
import ntpath
import xml.etree.ElementTree as etree
import contextlib
import urllib
from .settings import USER
from pyproj import Proj, transform, __version__

pyproj_version = __version__.split('.')[0]
if pyproj_version == '2':
    from pyproj import Transformer


class foglio(object):
    pass

def converti(trasf, x, y):
    if trasf == "proj4":
        return trasf_proj4(x=x, y=y)
    else:
        return(y, x)

def trasf_proj4(x,y):
    if pyproj_version == '2':
        return foglio.trasf["transform"](y, x)
    else:
        inProj = foglio.trasf["inProj"]
        outProj = foglio.trasf["outProj"]
        return foglio.trasf["transform"](inProj, outProj, y, x)

class matrix(object):
    pass

def tras_param(file):

    # try to get from table:
    try:
        trans_cadastre = TransformCatasto.objects.get(foglio=file.split(".")[0])
        html = trans_cadastre.transform
    except:
        print('TRY GET CRS FROM ONLINE SERVICE')
        (username, password) = getattr(settings, 'CADASTRE_PRGCLOUD_USER', USER['username']), \
                               getattr(settings, 'CADASTRE_PRGCLOUD_PASSWORD', USER['password'])
        req = 'http://www.prgcloud.com/auth/gettransform.php?username='+username+'&password='+password+'&foglio='+file.split(".")[0]
        print(req)
        html = ""
        try:
            with contextlib.closing(urllib.request.urlopen(req)) as x:
                for line in x:
                    html=line.decode()
                    break
        except urllib.error.URLError as err:
                    print(None, "Avviso :", "Errore "+str(err)+file.split(".")[0])
                    return

        # save into db
        if html:
            TransformCatasto(foglio=file.split(".")[0], transform=html).save()

    if html.strip() == "":
        return

    while html.find("\n\n") > 0:
        html = html.replace("\n\n", "\n")
    docxml = (html.replace("&lt;", "<").replace("&gt;", ">").replace("<br />", "").replace("\r", "").replace("\t", ""))
    while docxml.find("\n\n") > 0:
        docxml = docxml.replace("\n\n", "\n")
    doc = etree.fromstring(docxml.encode())
    ric_fg = file.split(os.extsep, 1)[0]
    for root in doc.findall("."):
        setattr(foglio, "foglio", ric_fg)
        for imp in root.find("./trasformazioneF"):
            if imp.tag != "Origine":
                setattr(foglio, imp.tag, imp.text)
    doc = etree.fromstring(docxml)
    for imp in doc.findall("./trasformazioneF/Origine/"):
        if imp.tag in ("codice", "ValidoDa", "ValidoA"):
            setattr(matrix, imp.tag, imp.text)
        else:
            setattr(matrix, imp.tag, float(imp.text))

    if foglio.metodo=="proj4":
        if pyproj_version == '2':
            transformer = Transformer.from_crs(foglio.SRID, 'epsg:' + foglio.outcrs)
            trasf = {
                "transform": transformer.transform,
            }
        else:
            crsDest = Proj(init='epsg:' + foglio.outcrs)
            incrs = Proj(foglio.SRID)
            setattr(foglio, "incrs", incrs)
            trasf = {
                "transform": transform,
                "inProj": incrs,
                "outProj": crsDest
            }
        setattr(foglio, "trasf", trasf)