function Set-DeploymentTemplateParameterFile {

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
  Param(
    [Parameter(
      Mandatory = $true,
      ValueFromPipelineByPropertyName = $true
    )]
    [hashtable]$TemplateParameterObject,

    [Parameter(
      Mandatory = $false,
      Position = 0
    )]
    [string]$Path = (Join-Path $PWD 'build\deployment\templates\app-deployment.parameters.json')
  )

  end {
    $Exit = $false

    $TemplateObject = Get-XAzTemplateObject -Path $Path

    $Exit = $null -eq $TemplateObject

    if ($Exit -eq $false) {
      # TODO: replace all values so that this function lives up to its name
      $TemplateObject.parameters.hostName = @"
{
  "value": "$($TemplateParameterObject.hostName)"
}
"@ | ConvertFrom-Json

      $TemplateObject.parameters.containerRegistryName = @"
{
  "value": "$($TemplateParameterObject.containerRegistryName)"
}
"@ | ConvertFrom-Json

      Write-Verbose "Converting object to json, to be set in file"
      $TemplateObject | ConvertTo-Json | Set-Content -Path $Path
    }
  }
}
