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

echo "Updating .env TAG variable with '$1'"
sed -i "s/TAG=.*/TAG=$1/" .env
