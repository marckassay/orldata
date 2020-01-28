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
$SkipStage2 = $args.Contains('-SkipStage2')
$RollOver = $args.Contains('-RollOver')
$Verbose = $args.Contains('-Verbose')

Import-Module '.\build\deployment\psapp\'

# check the args for validity to ensure no unknowns were passed
$args | ForEach-Object {
  if (($_ -ne '-Rebuild') -and ($_ -ne '-RollOver') -and ($_ -ne '-SkipStage2') -and ($_ -ne '-Verbose')) {
    Write-Warning "Argument '$_' is not a member in the parameter set for New-AppDeployment. This function accepts only 'Rebuild', 'RollOver', 'SkipStage2', and 'Verbose'."
    Write-Warning "This argument will be ignored."
  }
}

$DesktopPrincipalAddress = [Environment]::MachineName.ToLower() + "-deployer@orldata.azurewebsites.net"
$DesktopPrincipalName = $DesktopPrincipalAddress.Split('@')[0]

$IsCertificateNew = $false

# export certificate, if one is not found then: create, import and export
if (-not $RollOver) {
  $X509 = Export-X509Certificate -FindBy Subject -Value "*$DesktopPrincipalName*"
}

if (-not $X509) {

  if ($RollOver) {
    Remove-X509Certificate -FindBy Subject -Value "*$DesktopPrincipalName*" -Force
  }

  $AppDataRoamingFolder = [Environment]::GetFolderPath([Environment+SpecialFolder]::ApplicationData)

  # create
  New-SelfSignedCert -Path $AppDataRoamingFolder `
    -Email $DesktopPrincipalAddress `
    -CommonName 'orldata' `
    -Organization 'orldata' `
    -Location 'Orlando' `
    -Country 'US'

  # import and export
  Import-X509Certificate -Path (Join-Path -Path $AppDataRoamingFolder -ChildPath 'certificate.p12')
  $X509 = Export-X509Certificate -FindBy Subject -Value "*$DesktopPrincipalAddress*"
  $IsCertificateNew = $true
}

$PEMCertificatePath = Get-PEMCertificate -Certificate $X509 | Select-Object -ExpandProperty FullName

# attempting to: reset cert or create SP and set cert
if ($IsCertificateNew) {

  $HostName = Get-XAzTemplateObject -Path '.\build\deployment\templates\app-deployment.parameters.json' | `
    Select-Object -ExpandProperty parameters | `
    Select-Object -ExpandProperty hostName | `
    Select-Object -ExpandProperty Value

  Write-Host "Using 'az CLI', a service principal that has an acceptable role to create another prinicipal and/or reset credentials is needed."
  Confirm-XAzAccount (Get-XAzAccountInfo -OnlyAzCli) -OnlyAzCli -StopOnEmptyCli | Out-Null

  $ADGroup = az ad group list --display-name ($HostName + "ADG") | ConvertFrom-Json -AsHashtable
  if (-not $ADGroup) {
    az ad group create --display-name ($HostName + 'ADG') --mail-nickname 'ods' | Out-Null
  }

  # only az cli can currrently set or reset SP credential that is using PEM certificate
  $AzADSP = az ad sp list --display-name $DesktopPrincipalName | ConvertFrom-Json -AsHashtable
  if (-not $AzADSP) {
    az ad sp create-for-rbac --name $DesktopPrincipalName --cert @$PEMCertificatePath | Out-Null
    $AzADSP = az ad sp list --display-name $DesktopPrincipalName | ConvertFrom-Json -AsHashtable
  }
  else {
    az ad sp credential reset --name $DesktopPrincipalName --cert @$PEMCertificatePath
  }

  $IsADGroupMember = az ad group member check --group ($HostName + "ADG") --member-id ($AzADSP.objectId) | `
    ConvertFrom-Json -AsHashtable | `
    Select-Object -ExpandProperty value
  if (-not $IsADGroupMember) {
    az ad group member add --group ($HostName + "ADG") --member-id ($AzADSP.objectId)
  }
}

# at this point principal (DesktopPrincipalName) is created, having a PEM cert for authenication, and as a member of AD Group.
# now prompt to use this serviceprinical for New-AppDeployment

if ($AzADSP) {
  Write-Host "Sleeping for 10 seconds since service principal has been created or modified"
  Start-Sleep -Seconds 10
}

Write-Host "For 'az CLI' and 'Az module', select the service principal to be used for 'New-AppDeployment'. If it "
Write-Host "has no option for service principal, halt this operation now. Afterwards login and attempt again."

Confirm-XAzAccount (Get-XAzAccountInfo) -StopOnEmptyCli -StopOnEmptyModule | Out-Null

# now we are logged in Azure with 'PowerShell 'Az' module'
New-AppDeployment -DesktopPrincipalName $DesktopPrincipalName -Certificate $X509 -Rebuild:$Rebuild -SkipStage2:$SkipStage2 -Verbose:$Verbose
