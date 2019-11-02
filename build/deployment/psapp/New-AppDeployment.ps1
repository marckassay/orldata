function New-AppDeployment {
  [CmdletBinding()]
  param(
  )

  if (-not $PSBoundParameters.ContainsKey('Verbose')) {
    $VerbosePreference = $PSCmdlet.GetVariableValue('VerbosePreference')
  }

  Get-InitialDeploymentTemplateObject -PipelineVariable Obj | `
    New-AzResourceGroupDeployment -TemplateParameterObject $Obj.TemplateParameterObject -Confirm
}
