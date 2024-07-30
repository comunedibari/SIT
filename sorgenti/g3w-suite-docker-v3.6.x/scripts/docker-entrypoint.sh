#!/bin/bash
# Entrypoint script

CADASTRE_DATA_IMPORT_DONE_FILE='/shared-volume/cadastre_data_imported'

# Start XVfb
if [[  -f /tmp/.X99-lock ]]; then
  rm /tmp/.X99-lock
fi
Xvfb :99 -screen 0 640x480x24 -nolisten tcp &
export DISPLAY=:99
export QGIS_SERVER_PARALLEL_RENDERING=1
# Start
cd /code/g3w-admin

# When building in dev env you might want a clean build each time.
if [[ -z "${DEV}" ]]; then
  rm -rf /shared-volume/build_done
fi

# Build the suite
/code/ci_scripts/build_suite.sh
# Setup once
/code/ci_scripts/setup_suite.sh

# Cadastre
python3 manage.py migrate --database=cadastre --noinput

if [ ! -e ${CADASTRE_DATA_IMPORT_DONE_FILE} ]; then
  python3 manage.py import_cadastre_data
  touch ${CADASTRE_DATA_IMPORT_DONE_FILE}
fi

gunicorn base.wsgi:application --limit-request-fields 0 --error-logfile - \
    --max-requests 300 --max-requests-jitter 50 \
    --log-level=debug --timeout 360 --workers=${G3WSUITE_GUNICORN_NUM_WORKERS:-8} -b 0.0.0.0:8000