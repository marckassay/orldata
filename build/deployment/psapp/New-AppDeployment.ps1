function New-AppDeployment {
  [CmdletBinding()]
  param(
    [switch]$Rebuild
  )

  if (-not $PSBoundParameters.ContainsKey('Verbose')) {
    $VerbosePreference = $PSCmdlet.GetVariableValue('VerbosePreference')
  }

  # Stage 0
  # process and approve when needed domain name and container registry.
  $Obj = Get-DeploymentTemplateObject -Verbose:$Verbose

  # set parameterobject back to the file on disk; domain name or container registry name may have changed from Get-DeploymentTemplateObject
  $Obj.TemplateParameterObject | Set-DeploymentTemplateParameterFile -Verbose:$Verbose

  $CheckForLocalImage = $false

  $CRName = $Obj.TemplateParameterObject.containerRegistryName

  # Stage 1
  # Create, resourcegroup, container registry, user-assigned Id so that a local image can be pushed if needed. Since mode set to 'Incremental', this
  # will have an idompotent behavior.
  $Stage1Obj = @(
    containerRegistryName = $CRName
    userAssignedIdName = ($Obj.TemplateParameterObject.userAssignedIdName)
  )

  New-AzResourceGroupDeployment -ResourceGroupName ($Obj.ResourceGroupName) `
    -TemplateFile ($Obj.TemplateFile) `
    -TemplteParameterObject $Stage1Obj `
    -Mode 'Incremental' `
    -Confirm

  # this stand-alone if statement is to have user select value for 'imageUri'
  if ($Rebuild.IsPresent -eq $false) {

    Write-Verbose "Attempting to retrieve ContainerRegistry tags. This typically takes a few seconds." -Verbose

    # cast as an array, if just one tag image is returned it will fail later
    [array]$Images = Get-XAzContainerRegistryTags -ContainerRegistryName $CRName

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
          $ImageUri = $CRName.ToLower() + ".azurecr.io/" + $Image
          $Obj.TemplateParameterObject.Add('imageUri', $ImageUri)
        }
      }
    }
    else {
      Write-Verbose "No container repository has been found in '$CRName'. Now checking for local image to push."
      $CheckForLocalImage = $true;
    }
  }

  if (($Rebuild.IsPresent -eq $true) -or ($CheckForLocalImage -eq $true)) {
    # if `-Rebuild` has been switched, then first find a local image of value in `.env` file.
    # if that is not available, build image. Afterwards tag it and push to ContainerRegistry and update app with it.
    $CR = Get-AzContainerRegistry -ResourceGroupName ($Obj.ResourceGroupName) -Name $CRName

    # TODO: use Azure identity resource instead
    $CRCredentials = Get-AzContainerRegistryCredential -ResourceGroupName ($Obj.ResourceGroupName) -Name $CRName

    Write-Verbose "Executing docker login" -Verbose
    $CRCredentials.Password | docker login $CR.LoginServer -u $CRCredentials.Username --password-stdin

    # .env file must have NAME and TAG, with values assigned to them
    $Image = Get-Content .\.env | ForEach-Object {
      $Entry = $_.ToString().Split('=')
      @{ $Entry[0].ToLower() = $Entry[1] }
    }

    $Image = $Image.name + ":" + $Image.tag

    $ImageUri = $CR.LoginServer + "/" + $Image

    $Obj.TemplateParameterObject.Add('imageUri', $ImageUri)

    if ($CheckForLocalImage -eq $true) {
      $DoesLocalImageExist = docker image inspect $Image | `
        Measure-Object | `
        ForEach-Object { $_.Count -gt 1 }

      $Rebuild = $DoesLocalImageExist -eq $false
    }

    # intermediate stage
    if ($Rebuild.IsPresent -eq $true) {
      yarn run up:production
    }

    Write-Verbose "Executing docker tag" -Verbose
    docker tag $Image $ImageUri

    Write-Verbose "Executing docker push" -Verbose
    docker push $ImageUri
  }

  # Stage 2
  # After stage 1 (and if build was performed), this is executed to create the remaining resources and update the web app with image
  $Obj | New-AzResourceGroupDeployment -TemplateParameterObject ($Obj.TemplateParameterObject) `
    -Verbose `
    -Debug `
    -Mode 'Incremental' `
    -Confirm
}
