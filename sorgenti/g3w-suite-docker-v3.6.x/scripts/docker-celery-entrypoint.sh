#!/bin/bash

# Wait for the main suite to start
wait-for-it -h g3w-suite -p 8000 -t 60
rm /tmp/.X99-lock
Xvfb :99 -screen 0 640x480x24 -nolisten tcp &
export DISPLAY=:99
export QGIS_SERVER_PARALLEL_RENDERING=1

# Running celery as root
export C_FORCE_ROOT="true"

cd /code/g3w-admin
export C_FORCE_ROOT="true"
#celery -A base worker -l info &
/bin/bash -c "celery -A base worker -l info &"
/bin/bash -c "python3 manage.py run_huey"