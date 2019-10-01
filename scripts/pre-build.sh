#!/bin/bash

./scripts/tools/update-semver.sh
./scripts/tools/remove-outpath.sh
./scripts/tools/build-themes.sh

exit 0
