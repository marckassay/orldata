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
