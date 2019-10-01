#!/bin/bash

echo "Executing 'build-production.sh' ..."

./pre-build.sh
eval "$(ng build --configuration production")

exit 0
