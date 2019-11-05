This file shows the output from executing `yarn run update:deployment` with `Push` and `Verbose` switched. Notice that I manually tag a
previous image to match the Azure App name, alphaz.

```powershell
E:\marckassay\orldata [1.0.9 +0 ~12 -0 | +0 ~2 -0 !]> docker tag zedas:1.0.9 alphaz:1.0.9
E:\marckassay\orldata [1.0.9 +0 ~12 -0 | +0 ~5 -0 !]> yarn run update:deployment -Push -Verbose
yarn run v1.17.3
$ pwsh -f ./build/deployment/scripts/update-deployment.ps1 -Push -Verbose
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
VERBOSE: Step 1 out of 6 steps completed
VERBOSE:
VERBOSE: Loading file: E:\marckassay\orldata\build\deployment\templates\parameters.json
VERBOSE: Converting json file into object
VERBOSE: Loaded file successfully
VERBOSE: Step 2 out of 6 steps completed
VERBOSE:
VERBOSE: Checking for resource group: alphazResourceGroup
VERBOSE: Verified resource group exist
VERBOSE: Created and verified resource group
VERBOSE: Step 3 out of 6 steps completed
VERBOSE:
VERBOSE: Retrieving key vault resource id
VERBOSE: Step 4 out of 6 steps completed
VERBOSE:
VERBOSE: Replacing tokens with key vault values
VERBOSE: Loading file: E:\marckassay\orldata\build\deployment\templates\parameters.json
VERBOSE: Converting json file into object
VERBOSE: Loaded file successfully
VERBOSE: Found and replaced token(s)
VERBOSE: Step 5 out of 6 steps completed
VERBOSE:
VERBOSE: Retrieving login server Url for container registry
VERBOSE: Step 6 out of 6 steps completed
VERBOSE:
VERBOSE: Executing docker login
Login Succeeded
VERBOSE: Executing docker tag
VERBOSE: Executing docker push
The push refers to repository [alphazcontainerregistry.azurecr.io/alphaz]
3593e6296fc5: Pushed
5230226959e8: Pushed
77cae8ab23bf: Pushed
1.0.9: digest: sha256:b44c57ca2961c860ead105f0bdd7b32a652dbfac91a2eccd495591ff792be946 size: 950
VERBOSE: 2:47:48 PM - Template is valid.
VERBOSE: 2:47:49 PM - Create template deployment 'update-deployment'
VERBOSE: 2:47:49 PM - Checking deployment status in 5 seconds
VERBOSE: 2:47:55 PM - Checking deployment status in 5 seconds
VERBOSE: 2:48:00 PM - Checking deployment status in 5 seconds
VERBOSE: 2:48:05 PM - Checking deployment status in 5 seconds
VERBOSE: 2:48:11 PM - Checking deployment status in 5 seconds
VERBOSE: 2:48:16 PM - Checking deployment status in 5 seconds
VERBOSE: 2:48:21 PM - Checking deployment status in 5 seconds
VERBOSE: 2:48:26 PM - Checking deployment status in 5 seconds
VERBOSE: 2:48:32 PM - Checking deployment status in 5 seconds
VERBOSE: 2:48:37 PM - Checking deployment status in 5 seconds
VERBOSE: 2:48:42 PM - Checking deployment status in 5 seconds
VERBOSE: 2:48:48 PM - Checking deployment status in 5 seconds
VERBOSE: 2:48:53 PM - Checking deployment status in 5 seconds
VERBOSE: 2:48:58 PM - Checking deployment status in 5 seconds
VERBOSE: 2:49:03 PM - Checking deployment status in 5 seconds
VERBOSE: 2:49:09 PM - Resource Microsoft.Web/sites 'alphaz' provisioning status is succeeded

DeploymentName          : update-deployment
ResourceGroupName       : alphazResourceGroup
ProvisioningState       : Succeeded
Timestamp               : 11/20/2019 7:49:06 PM
Mode                    : Incremental
TemplateLink            :
Parameters              :
                          Name                            Type                       Value
                          ==============================  =========================  ==========
                          hostName                        String                     alphaz
                          imageUri                        String                     alphazcontainerregistry.azurecr.io/alphaz:1.0.9
                          dockerRegistryServerUsername    SecureString
                          dockerRegistryServerPassword    SecureString
                          dockerRegistryServerUrl         SecureString

Outputs                 :
DeploymentDebugLogLevel :


Done in 124.56s.
E:\marckassay\orldata [1.0.9 +0 ~12 -0 | +0 ~5 -0 !]>
```
