$DEST_PATH = './src/assets'
$INPUT_PATH = $DEST_PATH +'/custom-themes/'


Write-Host 'Building custom theme scss files.'

Get-ChildItem -Path $INPUT_PATH -Include '*.scss' -Recurse | ForEach-Object {
    $Expression = "npx node-sass " + $(Resolve-Path $_.FullName -Relative) + " $DEST_PATH/" + $_.BaseName + ".css"
    Invoke-Expression -Command $Expression
}

Write-Host 'Finished building CSS.'
