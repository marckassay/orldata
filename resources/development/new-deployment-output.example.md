```powershell
E:\marckassay\orldata [1.0.9 +2 ~9 -0 | +0 ~3 -0 !]> yarn run new:deployment -Verbose
yarn run v1.17.3
$ pwsh -f ./build/deployment/scripts/new-deployment.ps1 -Verbose
VERBOSE: Loading module from path 'C:\Users\marck\OneDrive\Documents\PowerShell\Modules\XAz\1.0.1\XAz.psd1'.
VERBOSE: Populating RepositorySourceLocation property for module XAz.
VERBOSE: Loading module from path 'C:\Users\marck\OneDrive\Documents\PowerShell\Modules\XAz\1.0.1\XAz.psm1'.
VERBOSE: Exporting function 'Connect-XAzAccount'.
VERBOSE: Exporting function 'Read-Confirmation'.
VERBOSE: Exporting function 'Get-XAzRegistryCredentials'.
VERBOSE: Exporting function 'Approve-XAzRegistryName'.
VERBOSE: Exporting function 'Get-XAzContainerRegistryTags'.
VERBOSE: Exporting function 'Confirm-XAzResourceGroup'.
VERBOSE: Exporting function 'Get-XAzTemplateParameterObject'.
VERBOSE: Exporting function 'Invoke-AzureCLIDownload'.
VERBOSE: Exporting function 'Write-StepMessage'.
VERBOSE: Exporting function 'Approve-XAzDomainName'.
VERBOSE: Importing function 'Approve-XAzDomainName'.
VERBOSE: Importing function 'Approve-XAzRegistryName'.
VERBOSE: Importing function 'Confirm-XAzResourceGroup'.
VERBOSE: Importing function 'Connect-XAzAccount'.
VERBOSE: Importing function 'Get-XAzContainerRegistryTags'.
VERBOSE: Importing function 'Get-XAzRegistryCredentials'.
VERBOSE: Importing function 'Get-XAzTemplateParameterObject'.
VERBOSE: Importing function 'Read-Confirmation'.
VERBOSE: Importing function 'Write-StepMessage'.
VERBOSE: Loading module from path 'E:\marckassay\orldata\build\deployment\psapp\PSApp.psd1'.
VERBOSE: Loading module from path 'E:\marckassay\orldata\build\deployment\psapp\Find-RequiredPrograms.ps1'.
VERBOSE: Dot-sourcing the script file 'E:\marckassay\orldata\build\deployment\psapp\Find-RequiredPrograms.ps1'.
VERBOSE: Checking for 'az' command
VERBOSE: Checked 'az' command
VERBOSE: Checking for 'docker' command
VERBOSE: Checked 'docker' command
VERBOSE: Loading module from path 'E:\marckassay\orldata\build\deployment\psapp\PSApp.psm1'.
VERBOSE: Exporting function 'Get-InitialDeploymentTemplateObject'.
VERBOSE: Exporting function 'Get-UpdateDeploymentTemplateObject'.
VERBOSE: Exporting function 'New-AppDeployment'.
VERBOSE: Exporting function 'Update-AppDeployment'.
VERBOSE: Importing function 'Get-InitialDeploymentTemplateObject'.
VERBOSE: Importing function 'Get-UpdateDeploymentTemplateObject'.
VERBOSE: Importing function 'New-AppDeployment'.
VERBOSE: Importing function 'Update-AppDeployment'.
VERBOSE: Checking for a connected Azure session
VERBOSE: Connected to Azure with the following subscription: XXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXX
VERBOSE: Step 1 out of 5 steps completed
VERBOSE:
VERBOSE: Loading file: E:\marckassay\orldata\build\deployment\templates\parameters.json
VERBOSE: Converting json file into object
VERBOSE: Loaded file successfully
VERBOSE: Step 2 out of 5 steps completed
VERBOSE:
VERBOSE: Checking for resource group: zedasResourceGroup
VERBOSE: Verified resource group exist
VERBOSE: Created and verified resource group
VERBOSE: Step 3 out of 5 steps completed
VERBOSE:
VERBOSE: Checking availability of container registry name
VERBOSE: Container registry name 'zedasContainerRegistry', is available for use.
VERBOSE: Checked and verified availability of container registry name of: zedasContainerRegistry
VERBOSE: Step 4 out of 5 steps completed
VERBOSE:
VERBOSE: Checking availability of sub-domain
VERBOSE: Sub-domain, 'zedas', is available for use.
VERBOSE: Checked and verified availability of sub-domain name of: zedas
VERBOSE: Step 5 out of 5 steps completed
VERBOSE:

Confirm
Are you sure you want to perform this action?
Performing the operation "Creating Deployment" on target "zedasResourceGroup".
[Y] Yes  [A] Yes to All  [N] No  [L] No to All  [S] Suspend  [?] Help (default is "Y"): A
VERBOSE: 10:25:36 AM - Template is valid.
VERBOSE: 10:25:37 AM - Create template deployment 'initial-deployment'
VERBOSE: 10:25:37 AM - Checking deployment status in 5 seconds
VERBOSE: 10:25:42 AM - Checking deployment status in 5 seconds
VERBOSE: 10:25:48 AM - Checking deployment status in 5 seconds
VERBOSE: 10:25:53 AM - Checking deployment status in 5 seconds
VERBOSE: 10:25:58 AM - Resource Microsoft.ContainerRegistry/registries 'zedasContainerRegistry' provisioning status is succeeded
VERBOSE: 10:25:58 AM - Resource Microsoft.ManagedIdentity/userAssignedIdentities 'zedasId' provisioning status is succeeded
VERBOSE: 10:25:58 AM - Resource Microsoft.ManagedIdentity/userAssignedIdentities 'zedasId' provisioning status is succeeded
VERBOSE: 10:25:59 AM - Checking deployment status in 5 seconds
VERBOSE: 10:26:04 AM - Resource Microsoft.KeyVault/vaults 'zedasKV' provisioning status is running
VERBOSE: 10:26:04 AM - Checking deployment status in 12 seconds
VERBOSE: 10:26:16 AM - Resource Microsoft.Web/serverfarms 'zedasSP' provisioning status is succeeded
VERBOSE: 10:26:16 AM - Checking deployment status in 5 seconds
VERBOSE: 10:26:21 AM - Resource Microsoft.KeyVault/vaults 'zedasKV' provisioning status is succeeded
VERBOSE: 10:26:21 AM - Checking deployment status in 5 seconds
VERBOSE: 10:26:27 AM - Checking deployment status in 5 seconds
VERBOSE: 10:26:32 AM - Checking deployment status in 5 seconds
VERBOSE: 10:26:37 AM - Checking deployment status in 5 seconds
VERBOSE: 10:26:43 AM - Checking deployment status in 5 seconds
VERBOSE: 10:26:48 AM - Checking deployment status in 5 seconds
VERBOSE: 10:26:54 AM - Checking deployment status in 5 seconds
VERBOSE: 10:26:59 AM - Checking deployment status in 5 seconds
VERBOSE: 10:27:04 AM - Checking deployment status in 5 seconds
VERBOSE: 10:27:10 AM - Checking deployment status in 5 seconds
VERBOSE: 10:27:15 AM - Checking deployment status in 5 seconds
VERBOSE: 10:27:20 AM - Checking deployment status in 5 seconds
VERBOSE: 10:27:25 AM - Resource Microsoft.Web/sites/hostNameBindings 'zedas/zedas.azurewebsites.net' provisioning status is succeeded
VERBOSE: 10:27:25 AM - Resource Microsoft.Web/sites 'zedas' provisioning status is succeeded

DeploymentName          : initial-deployment
ResourceGroupName       : zedasResourceGroup
ProvisioningState       : Succeeded
Timestamp               : 11/19/2019 3:27:25 PM
Mode                    : Incremental
TemplateLink            :
Parameters              :
                          Name                     Type                       Value
                          =======================  =========================  ==========
                          hostName                 String                     zedas
                          containerRegistryName    String                     zedasContainerRegistry
                          userAssignedIdName       String                     zedasId
                          keyVaultName             String                     zedasKV
                          appServicePlanName       String                     zedasSP

Outputs                 :
                          Name             Type                       Value
                          ===============  =========================  ==========
                          valueC           String                     -------------

DeploymentDebugLogLevel :


Done in 131.74s.
```
