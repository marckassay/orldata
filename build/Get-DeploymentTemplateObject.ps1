<#
.SYNOPSIS
A project specific function for OrlData to be piped into `New-XAzResourceGroupDeployment`

.DESCRIPTION
Encodes SSL and nginx files into a hashtable that is intended to be used in `New-ResourceGroupDeployment`

.PARAMETER SslKeyPath
THe private key on filesystem.

.EXAMPLE
 Get-DeploymentTemplateObject -SslKeyPath 'D:\Google Drive\Documents\Programming\orldata\ssl.key' | New-XAzResourceGroupDeployment -ContainerRegistryName orldataContainerRegistry -Image orldata/prod:0.0.1 -Name orldata-deploygroup -TemplateName deploy-orldata-ssl.json

.NOTES
General notes
#>
function Get-DeploymentTemplateObject {
    [CmdletBinding()]
    [OutputType([hashtable])]
    Param(
        [Parameter(Mandatory = $true,
            HelpMessage = "The 'ssl.key' file path.",
            Position = 0)]
        [string]$SslKeyPath
    )

    begin {
        [string]$KeyContent = ConvertTo-Base64 -Path $(Resolve-Path -Path $SslKeyPath)
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
