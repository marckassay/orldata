function New-AppDeployment {
  [CmdletBinding()]
  param(
  )

  if (-not $PSBoundParameters.ContainsKey('Verbose')) {
    $VerbosePreference = $PSCmdlet.GetVariableValue('VerbosePreference')
  }

  $Obj = Get-InitialDeploymentTemplateObject
  $Obj | New-AzResourceGroupDeployment -TemplateParameterObject ($Obj.TemplateParameterObject) -Confirm
}
