#!/bin/bash

DEST_PATH=src/assets
INPUT_PATH=$DEST_PATH/custom-themes/

echo "Executing 'build-themes.sh' ..."

# Get the files
FILES=$(find src/assets/custom-themes -name "*.scss")

for FILE in $FILES
do
  FILENAME=${FILE#$INPUT_PATH}
  BASENAME=${FILENAME%.scss}
  echo "  Building '${FILENAME%.scss}'"
  $(yarn bin)/node-sass $FILE > $DEST_PATH/$BASENAME.css
done

echo "Finished executing 'build-themes.sh'."
exit 0
