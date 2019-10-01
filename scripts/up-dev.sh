#!/bin/bash

echo "Executing 'up-dev.sh' ..."

./scripts/tools/update-semver.sh
./scripts/tools/set-image-tag.sh dev
# eval "$(docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build)"
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
exit 0
