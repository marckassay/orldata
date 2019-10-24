function Get-DeploymentTemplateObject {

  <#
    .SYNOPSIS
    A project specific PowerShell function for OrlData project that will process `deploy-orladata.parameters.json` along with other data as
    parameters that will be passed into the `deploy-orladata.json` template.

    .DESCRIPTION
    Encodes SSL and nginx files into a hashtable that is intended to be used in `New-ResourceGroupDeployment`. This hashtable is used in the `build/templates/*.json` file.

    .PARAMETER SslKeyPath
    The SSL private key on filesystem.

    .EXAMPLE
    Get-DeploymentTemplateObject -SslKeyPath 'D:\Google Drive\Documents\Programming\orldata\ssl.key' | New-XAzResourceGroupDeployment -ContainerRegistryName orldataContainerRegistry -Image orldata/prod:0.0.1 -Name orldata-deploygroup -TemplateName deploy-orldata-ssl.json

    .NOTES
    This requires [XAz](https://github.com/marckassay/XAz) and [PSDocker](https://github.com/abbgrade/PSDocker) to be imported into session.
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
    [string]$TemplateFile = '.\build\templates\deploy-orladata.json',

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

      $ResGroupId = "/subscriptions/$($Subscription.id)/resourceGroups/$($TemplateParameters.resGroupName.value)"
      Write-Verbose "Checking for $($TemplateParameters.resGroupName.value)"
      Write-Verbose "  that has an Id of: $ResGroupId"
      $ResourceGroup = Get-AzResourceGroup `
        -Id $ResGroupId `
        -ErrorAction SilentlyContinue

      if ($null -eq $ResourceGroup) {
        Write-Warning "The subscription with Id of: $($Subscription.id)"
        Write-Warning "  has no resource group named: $($TemplateParameters.resGroupName.value)"
        Write-Warning "  Has the 'pre-setup-orldata.json' template been deployed?"
        $Exit = $true
      }
      else {
        Write-Verbose "Checked resource group"
      }
    }

    if ($Exit -eq $false) {
      Write-Verbose "Checking for $($TemplateParameters.keyVaultName.value)"
      $KeyVaultResourceId = Get-AzKeyVault -VaultName ($TemplateParameters.keyVaultName.value) | `
          Select-Object -ExpandProperty ResourceId

      if ($null -eq $KeyVaultResourceId) {
        Write-Host "The subscription with Id of: $($Subscription.id)"
        Write-Host "  has no key vault named: $($TemplateParameters.keyVaultName.value)"
        Write-Host "  Has the 'pre-setup-orldata.json' template been deployed?"
        $Exit = $true
      }
      else {
        Write-Verbose "Checked key vault"
        Write-Verbose "  key vault Id is: $KeyVaultResourceId"
      }
    }

    if ($Exit -eq $false) {
      $ReplaceToken = "<key-vault-resource-id>"
      $TemplateParameters = $ParameterContent | `
          ForEach-Object { $_ -Replace $ReplaceToken, $KeyVaultResourceId } | `
          ConvertFrom-Json -Depth 5 -AsHashtable | `
          Select-Object -ExpandProperty parameters

      Write-Verbose "Retrieving Container Registry credentials"
      $ContainerRegistryCredentials = Get-XAzRegistryCredentials ($TemplateParameters.containerRegistryName.value)

      # TODO: waiting for this issue to be resolved. Otherwize login process will start: https://github.com/Azure/azure-cli/issues/10979
      # $CRCredentials.Password | docker login $OrlDataCR.LoginServer -u $CRCredentials.Username --password-stdin

      # Since:
      # "You can't use the reference function or any of the list functions in the parameters section. These functions get the runtime state of a resource, and can't be executed before deployment when parameters are resolved."
      # Adding docker credentials here.

      @{
        resGroupName                 = $TemplateParameters.resGroupName.value
        resGroupLocation             = $TemplateParameters.resGroupLocation.value
        deployName                   = "deployment-" + $(Get-Date -Format FileDateTimeUniversal)
        hostName                     = $TemplateParameters.hostName.value
        appServicePlanName           = $TemplateParameters.appServicePlanName.value
        imageUri                     = $ContainerRegistryCredentials.Image.server + "/orldata/prod:" + $(Get-Content -Path '.env' -Delimiter '=' -Tail 1).Trim()
        dockerRegistryServerUsername = $TemplateParameters.dockerRegistryServerUsername
        dockerRegistryServerPassword = $TemplateParameters.dockerRegistryServerPassword
        dockerRegistryServerUrl      = $TemplateParameters.dockerRegistryServerUrl
      }
    }
    else {
      if ($PSCmdlet.MyInvocation.BoundParameters['Verbose'] -eq $false) {
        Write-Error "This script has failed. If needed, execute with Verbose switch."
      }
      else {

      }
    }
  }
}
