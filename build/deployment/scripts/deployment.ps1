<#
.SYNOPSIS
Imports modules required modules prior to calling New-AppDeployment.

.DESCRIPTION
This file is to be executed in package script object and will take any arguements to be executed in PowerShell (the PSApp module) and pass
it to the underlying function. Since node package managers (npm, yarn) executes commands in the package script object with cmd or bash, the
`pwsh` must be used to initiate PowerShell. And since it creates a new PowerShell session, modules need to be imported.

.EXAMPLE
yarn run deployment

.EXAMPLE
yarn run deployment -Rebuild
#>

$Rebuild = $args.Contains('-Rebuild')
$Verbose = $args.Contains('-Verbose')

$args | ForEach-Object {
  if (($_ -ne '-Rebuild') -and ($_ -ne '-Verbose')) {
    Write-Warning "Argument '$_' is not a member in the parameter set for New-AppDeployment. This function accepts only 'Rebuild', 'Verbose'."
    Write-Warning "This argument will be ignored."
  }
}

# Import-Module XAz -SkipEditionCheck -Verbose:$Verbose
Import-Module 'E:\marckassay\XAz\XAz.psd1' -SkipEditionCheck -Verbose:$Verbose
Import-Module $(Join-Path $PWD 'build\deployment\psapp\PSApp.psd1') -SkipEditionCheck -Force -Verbose:$Verbose

New-AppDeployment -Rebuild:$Rebuild -Verbose:$Verbose
