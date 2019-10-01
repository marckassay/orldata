#!/bin/bash

echo "Executing 'up-production.sh' ..."

./scripts/tools/update-semver.sh
eval "$(docker-compose -f ./docker-compose.yml -f ./docker-compose.production.yml up --build)"

exit 0
