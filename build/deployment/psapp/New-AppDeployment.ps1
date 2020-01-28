using namespace System.Security.Cryptography.X509Certificates

function New-AppDeployment {
  [CmdletBinding()]
  param(
    [Parameter(
      Mandatory = $false,
      ValueFromPipeline = $false,
      Position = 0
    )]
    [string]$DesktopPrincipalName,

    [Parameter(
      Mandatory = $false,
      ValueFromPipeline = $false,
      Position = 1
    )]
    [X509Certificate]$Certificate,

    [switch]$Rebuild,
    [switch]$SkipStage2
  )

  if (-not $PSBoundParameters.ContainsKey('Verbose')) {
    $VerbosePreference = $PSCmdlet.GetVariableValue('VerbosePreference')
  }

  ##################
  # Stage 1 - Creation of TemplateFile param object
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

  Write-StepMessage

  ##################
  # Stage 2 - Creation of Azure Resources
  ##################

  $CRName = $Obj.TemplateParameterObject.containerRegistryName
  $KeyVaultName = $Obj.TemplateParameterObject.keyVaultName
  $AppServicePlanName = $Obj.TemplateParameterObject.appServicePlanName
  $HostName = $Obj.TemplateParameterObject.hostName

  $ExecuteStage2 = 0

  # silence AzAppServicePlan and AzWebApp progress bar activities
  $ProgressPreference = 'SilentlyContinue'
  if ($SkipStage2.IsPresent -eq $false) {

    if ($Rebuild.IsPresent -eq $false) {
      # check to see if stage 2 deployment can be skipped
      $ExecuteStage2 += Get-AzContainerRegistry -ResourceGroupName ($Obj.ResourceGroupName) -Name $CRName -ErrorAction 'SilentlyContinue' | `
        Measure-Object | Select-Object -ExpandProperty Count | ForEach-Object { if ($_ -eq 0) { 1 } }

      $ExecuteStage2 += Get-AzKeyVault -Name $KeyVaultName -ErrorAction 'SilentlyContinue' | `
        Measure-Object | Select-Object -ExpandProperty Count | ForEach-Object { if ($_ -eq 0) { 1 } }

      $ExecuteStage2 += Get-AzAppServicePlan -Name $AppServicePlanName -ErrorAction 'SilentlyContinue' | `
        Measure-Object | Select-Object -ExpandProperty Count | ForEach-Object { if ($_ -eq 0) { 1 } }

      $ExecuteStage2 += Get-AzWebApp -Name $HostName -ErrorAction 'SilentlyContinue' | `
        Measure-Object | Select-Object -ExpandProperty Count | ForEach-Object { if ($_ -eq 0) { 1 } }
    }
    else {
      $ExecuteStage2 = 1
    }

    if ($ExecuteStage2 -ge 1) {

      Write-Verbose "Stage 2 needs to be deployed." -Verbose

      Write-Host "Press 'C' to continue with this stage."
      Write-Host "Press 'S' to skip this stage."
      Write-Host "Press 'ENTER' to halt deployment."
      $Selection = Read-Host "Make a selection and press 'ENTER'"

      # equality checks lower and upper
      if ($Selection -eq 'S') {
        Write-Verbose "Stage 2 has been commanded to be by-passed."
      }
      elseif ($Selection -eq 'C') {
        $Exit = New-AzResourceGroupDeployment -ResourceGroupName ($Obj.ResourceGroupName) `
          -TemplateFile ($Obj.TemplateFile) `
          -TemplateParameterObject ($Obj.TemplateParameterObject) `
          -Mode 'Incremental'

        if ($Exit.ProvisioningState -ne 'Succeeded') {
          Write-Error "New-AzResourceGroupDeployment must succeed before continuing" -ErrorAction Stop
        }
        else {

          # TODO: admin account needs to be enabled for current deployment. Azure allow cert authenication for ServicePrincipal, but not
          # ManagedIdentities. At least, it doesn't not using a VM.
          # Update-AzContainerRegistry -ResourceGroupName ($Obj.ResourceGroupName) -Name $CRName -DisableAdminUser | Out-Null

          # this sleeping is due to a bug (could be fixed now) in template deployments not having resources immediately available.
          do {
            Write-Warning "Sleeping for 5 seconds"
            Start-Sleep -Milliseconds 5000

            $AzADGroup = Get-AzADGroup -DisplayName ($HostName + 'ADG')
            $RoleDef = Get-AzRoleDefinition -Name ($HostName + ' Contributor') -ErrorAction SilentlyContinue

            if (($null -ne $AzADGroup) -and ($null -ne $RoleDef)) {
              New-AzRoleAssignment -ObjectId $AzADGroup.Id -RoleDefinitionId $RoleDef.Id -Scope ($RoleDef.AssignableScopes[0]) | `
                Out-Null
            }

          } until (($null -ne $AzADGroup) -and ($null -ne $RoleDef))

          # now that we have AzADGroup.Id, assign it here versus in template.
          Set-AzKeyVaultAccessPolicy -VaultName $KeyVaultName `
            -ObjectId $AzADGroup.Id `
            -PermissionsToSecrets set, delete, get | Out-Null
        }
      }
      else {
        return
      }
    }
    else {
      Write-Verbose "Stage 2 has determined to be by-passed."
    }
  }
  else {
    Write-Verbose "Stage 2 has been explicitly set to be by-passed."
  }

  Write-StepMessage

  ##################
  # Stage 3 - switching login to use AD DesktopPrincipal
  ##################

  Write-Verbose "A login will be performed in 'az cli' and 'Az module' for ServicePrincipal: $DesktopPrincipalName"
  Set-XAzServicePrincipal -TenantId $(Get-AzContext | Select-Object -ExpandProperty Tenant).Id -DisplayName $DesktopPrincipalName -Certificate $Certificate

  Write-StepMessage

  ##################
  # Stage 4 - Determines if docker build
  ##################

  # at this point in execution, Azure resources should have been created or *is creating*. If it is creating, and since it seems that ARM
  # template deployment can't be *truly* syncronously deployed, it might be best to determine if a Start-Sleep is needed here.

  # this variable is used to determine execution flow should check for local image before performing a docker built command.
  $CheckForLocalImage = $false

  # conditional statement is to have user select value for 'imageUri'. if stage 2 was just built, no need to check empty registry
  if (($Rebuild.IsPresent -eq $false) -or ($SkipStage2.IsPresent -eq $true)) {

    Write-Verbose "Attempting to retrieve ContainerRegistry tags. This typically takes a few seconds." -Verbose

    # cast as an array, if just one tag image is returned it will fail later
    [array]$Images = Get-XAzContainerRegistryTags -ContainerRegistryName $CRName

    if ($Images.Count -gt 0) {

      $Index = 0
      $Selection = -1
      $script:Image

      $Images | ForEach-Object -Process {
        $script:Image = $Images.Get($Index)
        $NuIndex = ++$Index

        Write-Host "Press '$NuIndex' for: $script:Image"

      } -End {

        Write-Host "Press 'S' to skip this stage."
        Write-Host "Press 'ENTER' to halt deployment."
        $Selection = Read-Host "Make a selection and press 'ENTER'"
        # equality checks lower and upper
        if ($Selection -eq 'S') {
          $script:Image = $null
        }
        elseif (($Selection -ge $Images.Count) -and ($Selection -le $Images.Count)) {
          $script:Image = $Images.Get($Selection - 1)
        }
        else {
          return
        }
      }

      if ($null -eq $script:Image) {
        $CheckForLocalImage = $true;
      }
      else {
        $Image = $script:Image
      }
    }
    else {
      Write-Verbose "No container repository has been found in '$($CRName.ToLower())'. Now checking for local image to push."
      $CheckForLocalImage = $true;
    }
  }
  else {
    $CheckForLocalImage = $true;
  }

  $LoginServer = Get-AzKeyVaultSecret -VaultName $KeyVaultName -Name 'DOCKER-REGISTRY-SERVER-URL' | Select-Object -ExpandProperty SecretValueText

  Write-StepMessage

  ##################
  # Stage 5 - Determines if image push is needed
  ##################

  if (($Rebuild.IsPresent -eq $true) -or ($CheckForLocalImage -eq $true)) {

    $IsDockerDesktopRunning = Get-Process 'Docker Desktop' -ErrorAction 'SilentlyContinue' | `
      Measure-Object | `
      ForEach-Object { $($_.Count -gt 0) }

    if (-not $IsDockerDesktopRunning) {
      Write-Warning "Docker Desktop is not currently running and will be needed now. Start Docker Desktop now. Do you want to continue?" -WarningAction Inquire
    }

    # if `-Rebuild` has been switched, then first find a local image of value in `.env` file.
    # if that is not available, build image. Afterwards tag it and push to ContainerRegistry and update app with it.

    # since the current Azure context is using the ServicePrincipal created above, we can login and authenicate using its Certificate.
    Write-Verbose "Executing: 'az acr login --name $($CRName.ToLower())'" -Verbose
    az acr login --name ($CRName.ToLower()) 2>&1 | Out-Null

    # .env file must have NAME and TAG, with values assigned to them
    $Image = Get-Content .\.env | ForEach-Object {
      $Entry = $_.ToString().Split('=')
      @{ $Entry[0].ToLower() = $Entry[1] }
    }

    # ex: orldatastage:1.0.10
    $Image = $Image.name + ":" + $Image.tag

    # ex: orldatastagecr.azurecr.io/orldatastage:1.0.10
    $ImageUri = $LoginServer.ToLower() + "/" + $Image

    if ($CheckForLocalImage -eq $true) {

      Write-Verbose "Executing: 'docker image inspect $Image'" -Verbose

      # redirect docker error to success stream. also it seems docker return at least 2 items on error; compare Count with 5. A success
      # return seems to be over 100.
      $DoesLocalImageExist = docker image inspect $Image 2>&1 | `
        Measure-Object | `
        ForEach-Object { $_.Count -gt 5 }

      $Rebuild = $DoesLocalImageExist -eq $false
    }

    if ($Rebuild.IsPresent -eq $true) {
      Write-Verbose "Executing: 'yarn run up:production'" -Verbose
      yarn run up:production
    }

    Write-Verbose "Executing: 'docker tag $Image $ImageUri'" -Verbose
    docker tag $Image $ImageUri 2>&1 | Out-Null

    Write-Verbose "Executing: 'docker push $ImageUri'" -Verbose
    docker push $ImageUri 2>&1 | Out-Null

    Write-Verbose "Executing: 'docker logout $LoginServer'"
    docker logout $LoginServer 2>&1 | Out-Null
  }
  else {
    $ImageUri = $LoginServer.ToLower() + "/" + $Image
  }

  Write-StepMessage

  ##################
  # Stage 6 - Update WebApp with image
  ##################

  Write-Host ""
  Write-Host "Set-AzWebApp will be called having the image ('LinuxFxVersion' property) set to: 'DOCKER|$ImageUri'" -ForegroundColor Yellow
  if (Read-Confirmation "Confirm" "Do you want to update with this image value above?") {

    $ExistingWebApp = Get-AzWebApp -ResourceGroupName ($Obj.ResourceGroupName) -Name ($Obj.TemplateParameterObject.hostName)
    $ExistingWebApp.Enabled = $true
    $ExistingWebApp.SiteConfig.LinuxFxVersion = ("DOCKER|" + $ImageUri)
    $ExistingWebApp.SiteConfig.AppSettings | ForEach-Object {
      $item = $_
      switch -Wildcard ($_.Name) {
        '*URL' { $item.Value = (Get-AzKeyVaultSecret -VaultName $KeyVaultName -Name 'DOCKER-REGISTRY-SERVER-URL' ).SecretValueText }
        '*PASSWORD' { $item.Value = (Get-AzKeyVaultSecret -VaultName $KeyVaultName -Name 'DOCKER-REGISTRY-SERVER-PASSWORD' ).SecretValueText }
        '*USERNAME' { $item.Value = (Get-AzKeyVaultSecret -VaultName $KeyVaultName -Name 'DOCKER-REGISTRY-SERVER-USERNAME' ).SecretValueText }
      }
    }

    if ($ExistingWebApp.State -ne 'Running') {
      $ExistingWebApp = Set-AzWebApp -WebApp $ExistingWebApp | Start-AzWebApp
    }
    else {
      $ExistingWebApp = Set-AzWebApp -WebApp $ExistingWebApp | Restart-AzWebApp
    }

    Write-Host $("'" + $ExistingWebApp.DefaultHostName + "' currently has a state of '" + $ExistingWebApp.State + "'")
  }

  Write-StepMessage
}
