#! /bin/bash

############################################################################################################################################
# .SYNOPSIS
#   Unconditional sets the .env file to value passed in
#
# .DESCRIPTION
#   To be used for building development images. Since we want to have `update-semver` to provision files for development, but want to also
#   have the Docker image tagged with a value of `dev`.
#
# .EXAMPLE
#   /mnt/e/marckassay/orldata$ bash -c -i tools/set-image-tag.sh dev
#
############################################################################################################################################

echo "Executing 'set-image-tag.sh' ..."
if [ "$1" == "dev" ]; then
  if [ -x "$(which git)" ] && [ "$(git branch | grep \* | cut -d ' ' -f2)" == "master" ]; then
    echo "  Not updating TAG (in .env file) since branch is 'master' but the container will be tagged specified in"
    echo "  'docker-compose.dev.yml'. This preserves the semver in case if production build is needed from 'master' branch."

    echo "Finished executing 'set-image-tag.sh'."
    exit 0
  fi
fi

echo "  Updating .env TAG variable with '$1'"
sed -i "s/TAG=.*/TAG=$1/" .env

echo "Finished executing 'set-image-tag.sh'."
exit 0
