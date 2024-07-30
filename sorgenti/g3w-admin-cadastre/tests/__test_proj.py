from pyproj import Proj, transform
import time

start = time.time()
outProj = Proj(init='epsg:3003')
inProj = Proj("+proj=cass +lat_0=43.318293 +lon_0=11.332212 +x_0=0.000000000000000 +y_0=0.000000000000000 +datum=WGS84 +units=m +no_defs")
x = 61759.831
y = -41125.585
ret = transform(inProj, outProj, y, x)
stop = time.time()
print ("TIME: {}".format(stop - start))
print (ret)


