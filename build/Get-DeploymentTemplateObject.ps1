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

  [CmdletBinding()]
  [OutputType([hashtable])]
  Param(
    [Parameter(Mandatory = $false,
      HelpMessage = "The 'ssl.key' file path.",
      Position = 0)]
    [string]$SslKeyPath
  )

  begin {
    $ReplaceToken = "<key-vault-resource-id>"
    $KeyVaultResourceId = Get-AzKeyVault -VaultName orldataKeyVault | Select-Object -ExpandProperty ResourceId
    $TemplateParameters = Get-Content '.\build\templates\deploy-orldata.parameters.json' | `
        ForEach-Object { $_ -Replace $ReplaceToken, $KeyVaultResourceId } | `
        ConvertFrom-Json -Depth 5 -AsHashtable | `
        Select-Object -ExpandProperty parameters
    <#     $SslKeyPath = Resolve-Path -Path $SslKeyPath;
    [string]$KeyContent = Get-Content -Path $SslKeyPath -ReadCount 0 | ConvertTo-Base64

    [string]$CrtContent = ConvertTo-Base64 `
      -Path $(Resolve-Path -Path $($TemplateParameters.sslCrtPath.value)).Path

    [string]$NginxConfContent = ConvertTo-Base64 `
      -Path $(Resolve-Path -Path $($TemplateParameters.nginxConfPath.value)).Path #>
  }

  end {
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
      appServicePlan               = $TemplateParameters.appServicePlan.value
      imageUri                     = $ContainerRegistryCredentials.Image.server + "/orldata/prod:" + $(Get-Content -Path '.env' -Delimiter '=' -Tail 1).Trim()
      dockerRegistryServerUsername = $TemplateParameters.dockerRegistryServerUsername
      dockerRegistryServerPassword = $TemplateParameters.dockerRegistryServerPassword
      dockerRegistryServerUrl      = $TemplateParameters.dockerRegistryServerUrl
    }
  }
}
