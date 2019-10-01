#!/bin/bash

echo "Executing 'serve-dev.sh' ..."

./scripts/tools/build-themes.sh
eval "$(ng serve --configuration dev")

exit 0
