function Get-DeploymentTemplateObject {

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
  Get-DeploymentTemplateObject | New-AzResourceGroupDeployment

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
    [string]$TemplateFile = (Join-Path $PWD 'build\deployment\templates\app-deployment.json'),

    [Parameter(
      Mandatory = $false,
      Position = 1
    )]
    [string]$TemplateParameterFile = (Join-Path $PWD 'build\deployment\templates\app-deployment.parameters.json')
  )

  end {
    Write-Verbose ""

    # indicates that the current values in the file has been changed in at least one of the Approve functions below.
    [int32]$Dirty = 0

    $Exit = Connect-XAzAccount -PassThru -OutVariable Subscription | `
      Measure-Object | `
      ForEach-Object { $($_.Count -eq 0) }

    if ($Exit -eq $false) {
      Write-StepMessage

      $TemplateParameters = Get-XAzTemplateObject -Path $TemplateParameterFile | `
        Select-Object -ExpandProperty parameters

      $Exit = $null -eq $TemplateParameters
    }

    if ($Exit -eq $false) {
      Write-StepMessage

      $OutRGCheck = Confirm-XAzResourceGroup -Name ($TemplateParameters.resGroupName.value) `
        -Location ($TemplateParameters.resGroupLocation.value) `
        -Prompt

      $Exit = ($OutRGCheck.Id.Length -eq 0)
    }

    if ($Exit -eq $false) {
      Write-StepMessage

      $OutRegistryNameCheck = Approve-XAzRegistryName `
        -ResourceGroupName ($OutRGCheck.Name) `
        -Name ($TemplateParameters.containerRegistryName.value) `

      $Dirty += $OutRegistryNameCheck.Dirty

      $Exit = ($OutRegistryNameCheck.Approved -eq $false)
    }

    if ($Exit -eq $false) {
      Write-StepMessage

      $OutDomainNameCheck = Approve-XAzDomainName `
        -ResourceGroupName ($OutRGCheck.Name) `
        -SubDomainName $($TemplateParameters.hostName.value)

      $Dirty += $OutRegistryNameCheck.Dirty

      $Exit = ($OutDomainNameCheck.Approved -eq $false)
    }

    if ($Exit -eq $false) {
      Write-StepMessage

      [hashtable]$TemplateParameterObject = @{
        keyVaultName          = $TemplateParameters.keyVaultName.value
        userAssignedIdName    = $TemplateParameters.userAssignedIdName.value
        appServicePlanName    = $TemplateParameters.appServicePlanName.value
        containerRegistryName = $OutRegistryNameCheck.Name
        hostName              = $OutDomainNameCheck.SubDomainName
      }

      [pscustomobject]@{
        ResourceGroupName       = $TemplateParameters.resGroupName.value
        TemplateFile            = $TemplateFile
        TemplateParameterObject = $TemplateParameterObject
        Dirty                   = $Dirty
      }
    }
    else {
      Write-Error "This script has failed. If needed, execute with Verbose switch."
    }
  }
}
