#!/bin/bash

docker build -f Dockerfile.g3wsuite.dockerfile --build-arg G3W_SUITE_BRANCH=v.3.6.x -t g3wsuite/g3w-suite:v3.6.x --no-cache .
docker compose down
docker compose up -d