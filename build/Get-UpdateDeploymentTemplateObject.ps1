function Get-UpdateDeploymentTemplateObject {

  <#
  .SYNOPSIS
  Parses `parameters.json` file and replaces its token with key vault ResourceId. This will also have an image url, that will replace the value on Azure.

  .DESCRIPTION
  The returned (hashtable) object from this function is intended to be piped into `New-AzResourceGroupDeployment`.

  .PARAMETER TemplateFile
  The update deployment ARM template. This will be added to the hashtable and when piped into `New-AzResourceGroupDeployment`, it will be
  utilized.

  .PARAMETER TemplateParameterFile
  The `parameters.json` file to be parsed.

  .EXAMPLE
  Get-UpdateDeploymentTemplateObject -PipelineVariable UptObj | New-AzResourceGroupDeployment -TemplateParameterObject $UptObj.TemplateParameterObject -Verbose

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
      Position = 1
    )]
    [string]$TemplateFile = '.\build\templates\update-deployment.json',

    [Parameter(
      Mandatory = $false,
      Position = 2
    )]
    [string]$TemplateParameterFile = '.\build\templates\parameters.json'
  )

  begin {
    $TotalSteps = 6
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

      $Exit = Confirm-XAzResourceGroup -Name ($TemplateParameters.resGroupName.value) -Location ($TemplateParameters.resGroupLocation.value) | `
        Measure-Object | `
        ForEach-Object { $($_.Count -eq 0) }
    }

    if ($Exit -eq $false) {
      Write-StepMessage (++$CurrentStep) $TotalSteps

      Write-Verbose "Retrieving key vault resource id"

      $KeyVaultResourceId = Get-AzKeyVault -ResourceGroupName ($TemplateParameters.resGroupName.value) | `
        Select-Object -ExpandProperty ResourceId

      $Exit = $null -eq $KeyVaultResourceId
    }

    if ($Exit -eq $false) {
      Write-StepMessage (++$CurrentStep) $TotalSteps

      Write-Verbose "Replacing tokens with key vault values"

      $ReplaceToken = "<key-vault-resource-id>"

      $TemplateParameters = Get-XAzTemplateParameterObject -Path $TemplateParameterFile | `
        ConvertTo-Json -Depth 5 | `
        ForEach-Object -Begin {
        $hasReplaced = $false
      } -Process {
        $hasReplaced = ($_ -Match $ReplaceToken)
        $_ -Replace $ReplaceToken, $KeyVaultResourceId
      } -End {
        if ($hasReplaced -eq $true) {
          Write-Verbose "Found and replaced token(s)"
        }
        else {
          Write-Verbose "Found no replace tokens in file. Searched for token value of: $ReplaceToken"
        }
      } | `
        ConvertFrom-Json -Depth 5 -AsHashtable

      $Exit = $null -eq $TemplateParameters
    }

    if ($Exit -eq $false) {
      Write-StepMessage (++$CurrentStep) $TotalSteps

      Write-Verbose "Retrieving login server Url for container registry"

      $ContainerRegistryLoginServer = Get-AzContainerRegistry `
        -ResourceGroupName ($TemplateParameters.resGroupName.value) `
        -ContainerRegistryName ($TemplateParameters.containerRegistryName.value) | `
        Select-Object -ExpandProperty LoginServer

      $Exit = $null -eq $ContainerRegistryLoginServer
    }

    if ($Exit -eq $false) {
      Write-StepMessage (++$CurrentStep) $TotalSteps

      [hashtable]$TemplateParameterObject = @{
        hostName                     = $TemplateParameters.hostName.value
        dockerRegistryServerUsername = $TemplateParameters.dockerRegistryServerUsername
        dockerRegistryServerPassword = $TemplateParameters.dockerRegistryServerPassword
        dockerRegistryServerUrl      = $TemplateParameters.dockerRegistryServerUrl
      }

      [pscustomobject]@{
        ResourceGroupName       = $TemplateParameters.resGroupName.value
        ContainerRegistryName   = $TemplateParameters.containerRegistryName.value
        TemplateFile            = $TemplateFile
        TemplateParameterObject = $TemplateParameterObject
      }
    }
    else {
      Write-Error "This script has failed. If needed, execute with Verbose switch."
    }
  }
}
