#!/bin/bash
# Run Celery worker for cadastre module

set -x

# run rabbimq
 #sudo systemctl restart rabbitmq-server

# run celery
celery -A cadastre worker -l info -n wrk1@%h
