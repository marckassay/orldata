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

  end {
    $Exit = $false

    Write-Verbose "Checking for a subscription"
    $Subscription = Get-AzSubscription -ErrorAction SilentlyContinue
    if ($null -eq $Subscription) {
      Write-Warning "Found no connected sessions in Azure. You can login using: Connect-AzAccount"
      $Exit = $true
    }
    else {
      Write-Verbose "Checked subscription"
      Write-Verbose "  Subscription Id is: /subscriptions/$($Subscription.id)"
    }

    if ($Exit -eq $false) {
      Write-Verbose "Loading $(Resolve-Path $TemplateParameterFile) file"
      $ParameterContent = Get-Content $(Resolve-Path $TemplateParameterFile)

      Write-Verbose "Converting 'parameters.json' into object"
      $TemplateParameters = $ParameterContent | `
        ConvertFrom-Json -Depth 5 -AsHashtable | `
        Select-Object -ExpandProperty parameters

      $ContainerRegistryName = Approve-XAzRegistryName `
        -Name ($TemplateParameters.containerRegistryName.value) `
        -AcceptExisting

      $Exit = $null -eq $ContainerRegistryName
    }

    if ($Exit -eq $false) {
      $HostName = Approve-XAzDomainName `
        -Name $($TemplateParameters.hostName.value)

      $Exit = $null -eq $HostName
    }

    if ($Exit -eq $false) {
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
      if ($PSCmdlet.MyInvocation.BoundParameters['Verbose'] -eq $false) {
        Write-Error "This script has failed. If needed, execute with Verbose switch."
      }
    }
  }
}
