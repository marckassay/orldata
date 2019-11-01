function Get-InitialDeploymentTemplateObject {

  <#
  .SYNOPSIS
  Parses `parameters.json` file and ensures that resources that will get a Url, are indeed available. If not, prompt will appear.

  .DESCRIPTION
  The returned (hashtable) object from this function is intended to be piped into `New-AzResourceGroupDeployment`.

  .PARAMETER TemplateFile
  The initial deployment ARM template. This will be added to the hashtable and when piped into `New-AzResourceGroupDeployment`, it will be
  utilized.

  .PARAMETER TemplateParameterFile
  The `parameters.json` file to be parsed.

  .EXAMPLE
  Get-InitialDeploymentTemplateObject | New-AzResourceGroupDeployment

  .NOTES
  This requires [XAz](https://github.com/marckassay/XAz).
  #>

  [CmdletBinding(
    PositionalBinding = $true
  )]
  [OutputType(
    [hashtable]
  )]
  Param(
    [Parameter(
      Mandatory = $false,
      Position = 0
    )]
    [string]$TemplateFile = '.\build\templates\initial-deployment.json',

    [Parameter(
      Mandatory = $false,
      Position = 1
    )]
    [string]$TemplateParameterFile = '.\build\templates\parameters.json'
  )

  begin {
    $TotalSteps = 5
    $CurrentStep = 0
  }

  end {
    $Exit = Connect-XAzAccount -PassThru -OutVariable Subscription | `
      Measure-Object | `
      ForEach-Object { $($_.Count -eq 0) }

    if ($Exit -eq $false) {
      Write-StepMessage (++$CurrentStep) $TotalSteps

      $TemplateParameters = Get-XAzTemplateParameterObject -Path $TemplateParameterFile

      $Exit = $null -eq $TemplateParameters
    }

    if ($Exit -eq $false) {
      Write-StepMessage (++$CurrentStep) $TotalSteps

      $Exit = Confirm-XAzResourceGroup -Name ($TemplateParameters.resGroupName.value) -Location ($TemplateParameters.resGroupLocation.value) -Prompt | `
        Measure-Object | `
        ForEach-Object { $($_.Count -eq 0) }
    }

    if ($Exit -eq $false) {
      Write-StepMessage (++$CurrentStep) $TotalSteps

      $ContainerRegistryName = Approve-XAzRegistryName `
        -Name ($TemplateParameters.containerRegistryName.value) `
        -AcceptExisting

      $Exit = $null -eq $ContainerRegistryName
    }

    if ($Exit -eq $false) {
      Write-StepMessage (++$CurrentStep) $TotalSteps

      $HostName = Approve-XAzDomainName `
        -Name $($TemplateParameters.hostName.value)

      $Exit = $null -eq $HostName
    }

    if ($Exit -eq $false) {
      Write-StepMessage (++$CurrentStep) $TotalSteps

      [hashtable]$TemplateParameterObject = @{
        keyVaultName          = $TemplateParameters.keyVaultName.value
        userAssignedIdName    = $TemplateParameters.userAssignedId.value
        appServicePlanName    = $TemplateParameters.appServicePlanName.value
        containerRegistryName = $ContainerRegistryName
        hostName              = $HostName
      }

      [pscustomobject]@{
        ResourceGroupName       = $TemplateParameters.resGroupName.value
        TemplateFile            = $TemplateFile
        TemplateParameterObject = $TemplateParameterObject
      }
    }
    else {
      Write-Error "This script has failed. If needed, execute with Verbose switch."
    }
  }
}
