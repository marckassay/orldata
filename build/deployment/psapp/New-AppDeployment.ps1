function New-AppDeployment {
  [CmdletBinding()]
  param(
    [switch]$SkipApprovals
  )

  if (-not $PSBoundParameters.ContainsKey('Verbose')) {
    $VerbosePreference = $PSCmdlet.GetVariableValue('VerbosePreference')
  }

  $Obj = Get-InitialDeploymentTemplateObject -SkipApprovals:$SkipApprovals -Verbose:$Verbose
  $Obj | New-AzResourceGroupDeployment -TemplateParameterObject ($Obj.TemplateParameterObject) -Confirm

  # TODO: although the following works here, perhaps move to XAz module
  # For the currently logged in user, give them access to the KeyVault.
  $Id = Get-AzContext | `
    Select-Object -ExpandProperty Account | `
    Select-Object -ExpandProperty Id

  $UserPrincipalName = Get-AzADUser | `
    Where-Object { $_.DisplayName -eq $Id } | `
    Select-Object -ExpandProperty UserPrincipalName

  Set-AzKeyVaultAccessPolicy `
    -VaultName $($Obj.TemplateParameterObject.keyVaultName) `
    -UserPrincipalName $UserPrincipalName `
    -PermissionsToSecrets set, delete, get, list

  # Now the logged in user, set the secrets for the Azure App can access on Azure. This is need to get access to the container registry.
  $CR = Get-AzContainerRegistry -ResourceGroupName $($Obj.ResourceGroupName) `
    -Name $($Obj.TemplateParameterObject.containerRegistryName)

  Set-AzKeyVaultSecret -VaultName $($Obj.TemplateParameterObject.keyVaultName) `
    -Name 'DOCKER-REGISTRY-SERVER-URL' `
    -SecretValue $(ConvertTo-SecureString -String ($CR.LoginServer) -AsPlainText -Force)

  $CRC = Get-AzContainerRegistryCredential -ResourceGroupName $($Obj.ResourceGroupName) `
    -Name $($Obj.TemplateParameterObject.containerRegistryName)

  Set-AzKeyVaultSecret -VaultName $($Obj.TemplateParameterObject.keyVaultName) `
    -Name 'DOCKER-REGISTRY-SERVER-USERNAME' `
    -SecretValue $(ConvertTo-SecureString -String ($CRC.Username) -AsPlainText -Force)

  Set-AzKeyVaultSecret -VaultName $($Obj.TemplateParameterObject.keyVaultName) `
    -Name 'DOCKER-REGISTRY-SERVER-PASSWORD' `
    -SecretValue $(ConvertTo-SecureString -String ($CRC.Password) -AsPlainText -Force)
}
