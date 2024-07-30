#!/bin/bash
# Run Celery worker for cadastre module

set -x

# run rabbimq
#docker run -d --hostname my-rabbit -p 5672:5672 --name some-rabbit rabbitmq

# run celery
celery -A cadastre worker -l info -n wrk1@%h
