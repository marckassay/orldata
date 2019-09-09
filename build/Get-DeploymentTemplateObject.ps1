function Get-DeploymentTemplateObject {

    <#
    .SYNOPSIS
    A project specific PS function for OrlData to be piped into `New-XAzResourceGroupDeployment`

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
      [string]$CrtContent = ConvertTo-Base64 -Path $(Resolve-Path -Path 'build/ssl.crt')
      [string]$NginxConfContent = ConvertTo-Base64 -Path $(Resolve-Path -Path 'build/nginx.conf')
    }

    end {
        @{
            sslKey    = $KeyContent
            sslCrt    = $CrtContent
            nginxConf = $NginxConfContent
        }
    }
}
