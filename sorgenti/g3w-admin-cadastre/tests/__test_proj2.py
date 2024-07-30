# https://pyproj4.github.io/pyproj/stable/gotchas.html#upgrading-to-pyproj-2-from-pyproj-1

from pyproj import Transformer
import time

transformer = Transformer.from_crs("+proj=cass +lat_0=43.318293 +lon_0=11.332212 +x_0=0.000000000000000 +y_0=0.000000000000000 +datum=WGS84 +units=m +no_defs", "epsg:3003")
for n in range(20):
    start = time.time()
    x = 61759.831
    y = -41125.585
    ret = transformer.transform(y, x)
    stop = time.time()
    print ("TIME: {}".format(stop - start))
    print (ret)


