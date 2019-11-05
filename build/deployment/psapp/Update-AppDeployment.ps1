<#
.SYNOPSIS
Imports modules required modules prior to calling Update-AppDeployment.

.DESCRIPTION
This file is to be executed in package script object and will take any arguements to be executed in PowerShell (the PSApp module) and pass
it to the underlying function. Since node package managers (npm, yarn) executes commands in the package script object with cmd or bash, the
`pwsh` must be used to initiate PowerShell. And since it creates a new PowerShell session, modules need to be imported.

.EXAMPLE
Update-AppDeployment

.EXAMPLE
Update-AppDeployment -Build

#>
function Update-AppDeployment {
  [CmdletBinding()]
  param(
    [switch]$Build,
    [switch]$Push
  )

  if (-not $PSBoundParameters.ContainsKey('Verbose')) {
    $VerbosePreference = $PSCmdlet.GetVariableValue('VerbosePreference')
  }

  $Obj = Get-UpdateDeploymentTemplateObject -Verbose

  # if the image is already in the Azure container registry
  if (($Build.IsPresent -eq $false) -and ($Push.IsPresent -eq $false)) {

    Write-Verbose "Attempting to retrieve ContainerRegistry tags. This typically takes around 30 seconds." -Verbose

    # cast as an array, if just one tag image is returned it will fail later
    [array]$Images = Get-XAzContainerRegistryTags -ContainerRegistryName $Obj.ContainerRegistryName

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
            -Verbose `
            -Debug
        }
      }
    }
    else {
      # Write-Warning "No container repository has been found with the name of: $($Obj.ContainerRegistryName)"
      Write-Verbose "A build and push will now be performed."
      $Build = $true;
    }
  }

  if ($Build.IsPresent -eq $true) {
    yarn run up:production
  }
  # since Build is a superset of Push, need to check for both at this point
  if (($Build.IsPresent -eq $true) -or ($Push.IsPresent -eq $true)) {
    # if `-Build` has been switched, then first find a local image of value in `.env` file.
    # if that is not available, build image. Afterwards tag it and push to ContainerRegistry and update app with it.
    $CR = Get-AzContainerRegistry -ResourceGroupName $($Obj.ResourceGroupName) -Name $($Obj.ContainerRegistryName)

    # TODO: use Azure identity resource instead
    $CRCredentials = Get-AzContainerRegistryCredential -ResourceGroupName $($Obj.ResourceGroupName) -Name $($Obj.ContainerRegistryName)

    # .env file must have NAME and TAG, with values assigned to them
    $Image = Get-Content .\.env | ForEach-Object {
      $Entry = $_.ToString().Split('=')
      @{ $Entry[0].ToLower() = $Entry[1] }
    }
    $Image = $Image.name + ":" + $Image.tag
    $ImageUri = "$($CR.LoginServer)/$Image"

    $Obj.TemplateParameterObject.Add('imageUri', $ImageUri)

    Write-Verbose "Executing docker login" -Verbose
    $CRCredentials.Password | docker login $CR.LoginServer -u $CRCredentials.Username --password-stdin

    Write-Verbose "Executing docker tag" -Verbose
    docker tag $Image $ImageUri

    Write-Verbose "Executing docker push" -Verbose
    docker push $ImageUri

    New-AzResourceGroupDeployment `
      -ResourceGroupName $Obj.ResourceGroupName `
      -TemplateFile $Obj.TemplateFile `
      -TemplateParameterObject $Obj.TemplateParameterObject
  }
}
