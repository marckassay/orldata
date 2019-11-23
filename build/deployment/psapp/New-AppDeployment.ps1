function New-AppDeployment {
  [CmdletBinding()]
  param(
    [switch]$Rebuild
  )

  if (-not $PSBoundParameters.ContainsKey('Verbose')) {
    $VerbosePreference = $PSCmdlet.GetVariableValue('VerbosePreference')
  }

  ##################
  # Stage 0
  ##################

  # process and approve when needed domain name and container registry.
  $Obj = Get-DeploymentTemplateObject -Verbose:$Verbose
  if ($null -eq $Obj) {
    Write-Error 'Get-DeploymentTemplateObject returned null value' -ErrorAction Stop
  }

  # remove property after reading value to prevent any issues with piping it into cmdlet
  $Dirty = $Obj.Dirty
  $Obj.PSObject.Properties.Remove('Dirty')
  if ($Dirty -gt 0) {

    # set parameterobject back to the file on disk; domain name or container registry name may have changed from Get-DeploymentTemplateObject
    $Obj | Set-DeploymentTemplateParameterFile -Verbose:$Verbose
  }


  ##################
  # Stage 1
  ##################

  $CRName = $Obj.TemplateParameterObject.containerRegistryName
  $UAIdName = $Obj.TemplateParameterObject.userAssignedIdName

  $SkipStage1 = $false

  # check to see if stage1 deployment can be skipped
  $SkipStage1 += Get-AzContainerRegistry -ResourceGroupName ($Obj.ResourceGroupName) -Name $CRName -ErrorAction SilentlyContinue | `
    Measure-Object | `
    Select-Object -ExpandProperty Count

  $SkipStage1 += Get-AzADServicePrincipal -DisplayName $UAIdName -ErrorAction SilentlyContinue | `
    Measure-Object | `
    Select-Object -ExpandProperty Count

  if ($SkipStage1 -eq $false) {

    Write-Verbose "Stage 1 needs to be deployed."

    $Exit = New-AzResourceGroupDeployment -ResourceGroupName ($Obj.ResourceGroupName) `
      -TemplateFile ($Obj.TemplateFile) `
      -TemplateParameterObject ($Obj.TemplateParameterObject) `
      -Mode 'Incremental' `
      -Confirm

    if ($Exit.ProvisioningState -ne 'Succeeded') {
      Write-Error "New-AzResourceGroupDeployment must succeed before continuing" -ErrorAction Stop
    }

    Write-StepMessage
  }


  ##################
  # Stage 2
  ##################

  # at this point in execution, Azure resources should have been created or *is creating*. If it is creating, and since it seems that ARM
  # template deployment can't be *truly* syncronously deployed, it might be best to detemrine if a Start-Sleep is needed here.

  # all code below here is to detemrine if docker image needs to be built and update app service with imageUri and set app settings in PS
  $CheckForLocalImage = $false

  # this stand-alone if statement is to have user select value for 'imageUri'
  if ($Rebuild.IsPresent -eq $false) {

    Write-Verbose "Attempting to retrieve ContainerRegistry tags. This typically takes a few seconds." -Verbose

    # cast as an array, if just one tag image is returned it will fail later
    [array]$Images = Get-XAzContainerRegistryTags -ContainerRegistryName $CRName

    Write-StepMessage

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

  # TODO: if the user is Connected with SP that has Roles versus a user that has Azure Creds, what conditions need to apply?

  if (($Rebuild.IsPresent -eq $true) -or ($CheckForLocalImage -eq $true)) {

    # if `-Rebuild` has been switched, then first find a local image of value in `.env` file.
    # if that is not available, build image. Afterwards tag it and push to ContainerRegistry and update app with it.
    $CR = Get-AzContainerRegistry -ResourceGroupName ($Obj.ResourceGroupName) -Name $CRName

    # TODO: use Azure identity resource instead
    $CRCredentials = Get-AzContainerRegistryCredential -ResourceGroupName ($Obj.ResourceGroupName) -Name $CRName

    Write-StepMessage

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

      Write-Verbose "Executing docker image inspect" -Verbose

      # redirect docker error to success stream. also it seems docker return at least 2 items on error; compare Count with 5. A success
      # return seems to be over 100.
      $DoesLocalImageExist = docker image inspect $Image 2>&1 | `
        Measure-Object | `
        ForEach-Object { $_.Count -gt 5 }

      $Rebuild = $DoesLocalImageExist -eq $false
    }

    # intermediate stage
    if ($Rebuild.IsPresent -eq $true) {
      Write-Verbose "Building image" -Verbose
      yarn run up:production
    }

    Write-Verbose "Executing docker tag" -Verbose
    docker tag $Image $ImageUri

    Write-Verbose "Executing docker push" -Verbose
    docker push $ImageUri
  }


  ##################
  # Stage 3
  ##################

  <#
  $AppSettings = @{
    "DOCKER_REGISTRY_SERVER_USERNAME" = ""
    "DOCKER_REGISTRY_SERVER_PASSWORD" = ""
    "DOCKER_REGISTRY_SERVER_URL"      = ""
  }
  #>
  Set-AzWebApp -ResourceGroupName ($Obj.ResourceGroupName) `
    -Name ($Obj.TemplateParameterObject.hostName) `
    -AppServicePlan $AppSettings

  Write-StepMessage
}
