function Update-OrldataDeployment {
  [CmdletBinding()]
  param(

  )

  if (-not $PSBoundParameters.ContainsKey('Verbose')) {
    $VerbosePreference = $PSCmdlet.GetVariableValue('VerbosePreference')
  }

  $Obj = Get-UpdateDeploymentTemplateObject
  $Images = Get-XAzContainerRegistryTags -ContainerRegistryName $Obj.ContainerRegistryName

  if ($Images.Count -gt 0) {
    $Images | ForEach-Object -Begin {
      $Index = 0; $Selection = -1
    } -Process {
      $Image = $Images.Get($Index)
      $NuIndex = ++$Index

      Write-Host "Press '$NuIndex' for: $Image"

    } -End {

      Write-Host "Press 'ENTER' to halt deployment."
      $Selection = Read-Host "Select image for deployment and press 'ENTER'"

      if (($Selection -ge $Images.Count) -and ($Selection -le $Images.Count)) {

        $Image = $Images.Get($Selection - 1)
        $ImageUri = ($Obj.ContainerRegistryName).ToLower() + ".azurecr.io/" + $Image
        $Obj.TemplateParameterObject.Add('imageUri', $ImageUri)

        New-AzResourceGroupDeployment `
          -ResourceGroupName $Obj.ResourceGroupName `
          -TemplateFile $Obj.TemplateFile `
          -TemplateParameterObject $Obj.TemplateParameterObject `
          -WhatIf
      }
    }
  }
  else {
    Write-Error "No repository has been found in container registry with the name of: $($Obj.ContainerRegistryName)" `
      -RecommendedAction "Check parameter file for correct container registry name" `
      -Category InvalidResult
  }
}
