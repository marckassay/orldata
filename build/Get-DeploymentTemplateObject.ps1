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
    [Parameter(Mandatory = $true,
      HelpMessage = "The 'ssl.key' file path.",
      Position = 0)]
    [string]$SslKeyPath
  )

  begin {
    $SslKeyPath = Resolve-Path -Path $SslKeyPath;
    [string]$KeyContent = Get-Content -Path $SslKeyPath -ReadCount 0 | ConvertTo-Base64

    $TemplateParameters = Get-Content '.\build\templates\deploy-orldata.parameters.json' | `
        ConvertFrom-Json | `
        Select-Object -ExpandProperty parameters

    [string]$CrtContent = ConvertTo-Base64 `
      -Path $(Resolve-Path -Path $($TemplateParameters.sslCrtPath.value)).Path

    [string]$NginxConfContent = ConvertTo-Base64 `
      -Path $(Resolve-Path -Path $($TemplateParameters.nginxConfPath.value)).Path
  }

  end {
    $ContainerRegistryCredentials = Get-XAzRegistryCredentials ($TemplateParameters.containerRegistryName.value)

    # TODO: waiting for this issue to be resolved. Otherwize login process will start: https://github.com/Azure/azure-cli/issues/10979
    # $CRCredentials.Password | docker login $OrlDataCR.LoginServer -u $CRCredentials.Username --password-stdin

    @{
      resGroupName             = $TemplateParameters.resGroupName.value
      resGroupLocation         = $TemplateParameters.resGroupLocation.value
      deployName               = "deployment-" + $(Get-Date -Format FileDateTimeUniversal)
      containerGroupName       = "containerGroup-" + $(Get-Date -Format FileDateTimeUniversal)
      imageRegistryCredentials = $ContainerRegistryCredentials.Image
      imageUri                 = $ContainerRegistryCredentials.Image.server + "/orldata/prod:" + $(Get-Content -Path '.env' -Delimiter '=' -Tail 1).Trim()
      containerDNSName         = $TemplateParameters.containerDNSName.value
      sslKey                   = $KeyContent
      sslCrt                   = $CrtContent
      nginxConf                = $NginxConfContent
    }
  }
}
