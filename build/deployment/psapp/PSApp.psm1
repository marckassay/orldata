using module .\Get-InitialDeploymentTemplateObject.ps1
using module .\Get-UpdateDeploymentTemplateObject.ps1
using module .\New-AppDeployment.ps1
using module .\Update-AppDeployment.ps1

Param(
  [Parameter(Mandatory = $False)]
  [bool]$SUT = $False
)

$script:SUT = $SUT
if ($script:SUT -eq $False) {
  # Start-Module
}
