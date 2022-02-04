-- SQL script to run BEFORE python3 manage.py migrate on upgrade of G3W-SUITE from version plk_qgis_2 to 3.2.x
--
-- Author: Walter Lorenzetti (lorenzetti@gis3w.it)
-- Date: 2021-04-26
--------------------------------------------------------------------------------------------------------

-- Into qdjango_layer
ALTER TABLE qdjango_layer RENAME COLUMN "external" TO "__external";
