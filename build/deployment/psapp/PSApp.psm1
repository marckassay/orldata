using module .\Get-DeploymentTemplateObject.ps1
using module .\Set-DeploymentTemplateParameterFile.ps1
using module .\New-AppDeployment.ps1

Param(
  [Parameter(Mandatory = $False)]
  [bool]$SUT = $False
)

$script:SUT = $SUT
if ($script:SUT -eq $False) {
  # Start-Module
}

Write-Verbose "Checking for 'XAz' PowerShell module" -Verbose
Install-Module -Name 'XAz' -RequiredVersion '2.0.0' -AcceptLicense
Write-Verbose "Checked 'XAz' PowerShell module" -Verbose

Set-StepMessage 6 -ShowElapsedTime
