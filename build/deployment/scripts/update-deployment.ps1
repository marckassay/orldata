<#
.SYNOPSIS
Imports modules required modules prior to calling Update-AppDeployment.

.DESCRIPTION
This file is to be executed in package script object and will take any arguements to be executed in PowerShell (the PSApp module) and pass
it to the underlying function. Since node package managers (npm, yarn) executes commands in the package script object with cmd or bash, the
`pwsh` must be used to initiate PowerShell. And since it creates a new PowerShell session, modules need to be imported.

.EXAMPLE
yarn run update:deployment

.EXAMPLE
yarn run update:deployment -Force

.EXAMPLE
yarn run update:deployment -Force -RollOut
#>


$Verbose = $Verbose.Contains('Verbose')

$VerifedArgs = ''

$args | ForEach-Object {
  if (($_ -ne '-Force') -and ($_ -ne '-RollOut') -and ($_ -ne '-Verbose')) {
    Write-Warning "Argument '$_' is not a member in the parameter set for Update-AppDeployment. This function accepts only 'Force' 'RollOut' and/or 'Verbose'  switch."
    Write-Warning "This argument will be ignored."
  }
  else {
    if ($_ -ne '-Verbose') {
      $VerifedArgs += "$_,"
    }
  }
}

Import-Module XAz -SkipEditionCheck -Verbose:$Verbose
Import-Module $(Join-Path $PWD 'build\deployment\psapp\PSApp.psd1') -SkipEditionCheck -Force -Verbose:$Verbose

Update-AppDeployment @($VerifedArgs.TrimEnd(',')) -Verbose:$Verbose
