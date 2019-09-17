#! /bin/bash

############################################################################################################################################
# .SYNOPSIS
#   Updates various files with git branch name if its a semver.
#
# .DESCRIPTION
#   Updates package.json, .env, and Angular environment files with the git branch name if its a valid semver format. This file can be
#   benefical if used as a hook, such as before `ng serve` or `ng build` is called.
#
# .PARAMETER WhatIf
#   Dry-run; outputs what it intends to do if executed without `-WhatIf`
#
# .EXAMPLE
#   /mnt/e/marckassay/orldata$ bash -c -i tools/update-semver.sh
#
############################################################################################################################################

# SEMVER_REGEX src: https://stackoverflow.com/a/50529645/648789
SEMVER_REGEX="^(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)(\\-[0-9A-Za-z-]+(\\.[0-9A-Za-z-]+)*)?(\\+[0-9A-Za-z-]+(\\.[0-9A-Za-z-]+)*)?$"

validate-version (){
  local version=$1
  if [[ "$version" =~ $SEMVER_REGEX ]]; then
      echo 0
  else
      echo 1
  fi
}

semver="$(git describe --contains --all)"
semver_result=$(validate-version $semver)

if [ "$semver_result" = 0 ]; then
  echo "Current $semver branch has been determined to be a valid semver value."

  echo "Updating .env with semver"
  sed -i "s/TAG=.*/TAG=$semver/" .env

  echo "Updating src/environments/environment.prod.ts with semver"
  sed -i "s/semver:.*/semver: '$semver'/" src/environments/environment.prod.ts

  echo "Updating src/environments/environment.dev.ts with semver"
  sed -i "s/semver:.*/semver: '$semver'/" src/environments/environment.dev.ts

  echo "Updating package.json with semver"
  sed -i "s/\"version\".*\:.*/\"version\": \"$semver\"\,/" package.json

  exit 0
else
  echo "Current branch was not determined to be a valid semver value."
  exit 0
fi

exit 1
