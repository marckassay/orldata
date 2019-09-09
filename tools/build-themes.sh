#!/bin/bash

DEST_PATH=src/assets
INPUT_PATH=$DEST_PATH/custom-themes/


echo Building custom theme scss files.

# Get the files
FILES=$(find src/assets/custom-themes -name "*.scss")

for FILE in $FILES
do
  FILENAME=${FILE#$INPUT_PATH}
  BASENAME=${FILENAME%.scss}
  $(yarn bin)/node-sass $FILE > $DEST_PATH/$BASENAME.css
done

echo Finished building CSS.

if [ -d /usr/src/app/dist ]; then
  echo dist directory exists!
fi

if [ ! -d /usr/src/app/dist ]; then
  echo dist directory does not exists!
fi


