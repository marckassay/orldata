# .\build\deployment

This is output from a successful initial deployment to Azure. For intial deployments, the account needs to at least a role to create Azure resources. All subsequent deployments can use the service principal created in the initial deployment.

```powershell
E:\marckassay\orldata [1.0.10 ↑2 +0 ~9 -0 ~]> yarn run deployment
yarn run v1.17.3
$ pwsh -f ./build/deployment/scripts/deployment.ps1 -Verbose
VERBOSE: Checking for 'az' command
VERBOSE: Checked 'az' command
VERBOSE: Checking for 'docker' command
VERBOSE: Checked 'docker' command
WARNING: HARDCODING 'XAZ' PATH TO IMPORT-MODULE. REMOVE AFTER TESTING!
For 'az CLI' and 'Az module', select the service principal to be used for 'New-AppDeployment'. If it
has no option for service principal, halt this operation now. Afterwards login and attempt again.
Currently 'az cli' is signed-in having the following account info:
SubscriptionId:   99ccf722-891a-4a2d-b847-95eabc10b7ce
TenantId:         0670456d-5caf-4a9f-9618-9391b6be0ba9
SignedInIdentity: marckassay@gmail.com

---------------------------------------------------------------------

Press '0' to use current account info.
Press '1' to set account to use subscription: 0bbd8c2d-f767-4293-837a-ae725107f204
Press '2' to set account to use subscription: 4a616cbd-50ab-4388-8410-2b1d72f68cc9
Or press 'ENTER' to halt deployment.

Make selection and press 'ENTER': 0

Current account will be used.

Currently 'Az module' is signed-in having the following account info:
SubscriptionId:   99ccf722-891a-4a2d-b847-95eabc10b7ce
TenantId:         0670456d-5caf-4a9f-9618-9391b6be0ba9
SignedInIdentity: 85f98c33-e2af-48cd-b3fc-f711cb9ff0ea

---------------------------------------------------------------------

Press '0' to use current account info.
Press '1' to set account to use subscription and identity of: 4a616cbd-50ab-4388-8410-2b1d72f68cc9 - marckassay@gmail.com
Press '2' to set account to use subscription and identity of: 0bbd8c2d-f767-4293-837a-ae725107f204 - marckassay@gmail.com
Press '3' to set account to use subscription and identity of: 99ccf722-891a-4a2d-b847-95eabc10b7ce - marckassay@gmail.com
Or press 'ENTER' to halt deployment.

Make selection and press 'ENTER': 3

Executing:
Get-AzContext -Name Visual Studio Ultimate with MSDN (99ccf722-891a-4a2d-b847-95eabc10b7ce) - marckassay@gmail.com | Set-AzContext
VERBOSE:
VERBOSE: Loading file: E:\marckassay\orldata\build\deployment\templates\app-deployment.parameters.json
VERBOSE: Converting json file into object
VERBOSE: Loaded file successfully
VERBOSE: Checking for resource group: orldatastageRG
WARNING: Resource group was not found. This is needed to continue.
Do you want to create it now under current subscription?
[Y] Yes  [N] No  [?] Help (default is "N"): y
VERBOSE: Performing the operation "Replacing resource group ..." on target "orldatastageRG".
VERBOSE: 1:33:51 PM - Created resource group 'orldatastageRG' in location 'centralus'
VERBOSE: Created and verified resource group existence
VERBOSE: Checking availability of container registry name
VERBOSE: Container registry name 'orldatastageCR', is available for use.
VERBOSE: Approved availability of container registry name of: orldatastageCR
VERBOSE: Checking availability of sub-domain
VERBOSE: The domain, 'orldatastage.azurewebsites.net', is available for use.
VERBOSE: Checked and verified availability: orldatastage.azurewebsites.net
VERBOSE: T+00:34:320  Step 1 out of 6 steps completed
VERBOSE:
VERBOSE: Stage 1 needs to be deployed.

Confirm
Are you sure you want to perform this action?                                                                                                                                                        Performing the operation "Creating Deployment" on target "orldatastageRG".                                                                                                                           [Y] Yes  [A] Yes to All  [N] No  [L] No to All  [S] Suspend  [?] Help (default is "Y"): Y                                                                                                            VERBOSE: 1:34:07 PM - Template is valid.                                                                                                                                                             VERBOSE: 1:34:08 PM - Create template deployment 'app-deployment'                                                                                                                                    VERBOSE: 1:34:08 PM - Checking deployment status in 5 seconds
VERBOSE: 1:34:13 PM - Checking deployment status in 5 seconds
VERBOSE: 1:34:18 PM - Checking deployment status in 5 seconds
VERBOSE: 1:34:24 PM - Checking deployment status in 5 seconds
VERBOSE: 1:34:29 PM - Checking deployment status in 5 seconds
VERBOSE: 1:34:34 PM - Checking deployment status in 5 seconds
VERBOSE: 1:34:40 PM - Resource Microsoft.Authorization/roleDefinitions 'b4aca487-8e0c-5569-8532-5a4cb07f2d51' provisioning status is succeeded
VERBOSE: 1:34:40 PM - Checking deployment status in 5 seconds
VERBOSE: 1:34:45 PM - Resource Microsoft.KeyVault/vaults 'orldatastageKV' provisioning status is running
VERBOSE: 1:34:45 PM - Resource Microsoft.ContainerRegistry/registries 'orldatastageCR' provisioning status is succeeded
VERBOSE: 1:34:45 PM - Resource Microsoft.ContainerRegistry/registries 'orldatastageCR' provisioning status is succeeded
VERBOSE: 1:34:45 PM - Checking deployment status in 15 seconds
VERBOSE: 1:35:00 PM - Checking deployment status in 5 seconds
VERBOSE: 1:35:06 PM - Resource Microsoft.KeyVault/vaults 'orldatastageKV' provisioning status is succeeded
VERBOSE: 1:35:06 PM - Checking deployment status in 5 seconds
VERBOSE: 1:35:11 PM - Resource Microsoft.KeyVault/vaults/secrets 'orldatastageKV/DOCKER-REGISTRY-SERVER-PASSWORD' provisioning status is succeeded
VERBOSE: 1:35:11 PM - Resource Microsoft.KeyVault/vaults/secrets 'orldatastageKV/DOCKER-REGISTRY-SERVER-USERNAME' provisioning status is succeeded
VERBOSE: 1:35:11 PM - Resource Microsoft.KeyVault/vaults/secrets 'orldatastageKV/DOCKER-REGISTRY-SERVER-URL' provisioning status is succeeded
VERBOSE: 1:35:11 PM - Checking deployment status in 5 seconds
VERBOSE: 1:35:16 PM - Checking deployment status in 5 seconds
VERBOSE: 1:35:22 PM - Checking deployment status in 5 seconds
VERBOSE: 1:35:28 PM - Checking deployment status in 5 seconds
VERBOSE: 1:35:33 PM - Checking deployment status in 5 seconds
VERBOSE: 1:35:38 PM - Checking deployment status in 5 seconds
VERBOSE: 1:35:44 PM - Checking deployment status in 5 seconds
VERBOSE: 1:35:49 PM - Resource Microsoft.Web/serverfarms 'orldatastageSP' provisioning status is succeeded
VERBOSE: 1:35:49 PM - Checking deployment status in 5 seconds
VERBOSE: 1:35:54 PM - Checking deployment status in 5 seconds
VERBOSE: 1:36:00 PM - Checking deployment status in 5 seconds
VERBOSE: 1:36:05 PM - Checking deployment status in 5 seconds
VERBOSE: 1:36:10 PM - Checking deployment status in 5 seconds
VERBOSE: 1:36:16 PM - Checking deployment status in 5 seconds
VERBOSE: 1:36:21 PM - Checking deployment status in 5 seconds
VERBOSE: 1:36:26 PM - Checking deployment status in 5 seconds
VERBOSE: 1:36:32 PM - Resource Microsoft.Web/sites/hostNameBindings 'orldatastage/orldatastage.azurewebsites.net' provisioning status is succeeded
VERBOSE: 1:36:32 PM - Resource Microsoft.Web/sites 'orldatastage' provisioning status is succeeded
WARNING: Sleeping for 5 seconds
VERBOSE: T+03:22:346  Step 2 out of 6 steps completed
VERBOSE:
VERBOSE: A login will be performed in 'az cli' and 'Az module' for ServicePrincipal: desktop-vo9i03v-deployer
VERBOSE: T+03:36:147  Step 3 out of 6 steps completed
VERBOSE:
VERBOSE: Attempting to retrieve ContainerRegistry tags. This typically takes a few seconds.
VERBOSE: Searching for repositories and tags in the registry of: orldatastageCR
WARNING: Found no repository in this registry.
VERBOSE: Completed repository search
VERBOSE: No container repository has been found in 'orldatastageCR'. Now checking for local image to push.
VERBOSE: T+03:53:034  Step 4 out of 6 steps completed
VERBOSE:
VERBOSE: Executing: 'az acr login --name orldatastageCR'
VERBOSE: Executing: 'docker image inspect orldatastage:1.0.10'
VERBOSE: Executing: 'docker tag orldatastage:1.0.10 orldatastagecr.azurecr.io/orldatastage:1.0.10'
VERBOSE: Executing: 'docker push orldatastagecr.azurecr.io/orldatastage:1.0.10'
VERBOSE: Executing: 'docker logout orldatastageCR.azurecr.io'
VERBOSE: T+04:30:202  Step 5 out of 6 steps completed
VERBOSE:

Set-AzWebApp will be called having the image ('LinuxFxVersion' property) set to: 'DOCKER|orldatastagecr.azurecr.io/orldatastage:1.0.10'

Do you want to update with this image value above?
Confirm
[Y] Yes  [N] No  [?] Help (default is "N"): y
'orldatastage.azurewebsites.net' currently has a state of 'Running'
VERBOSE: T+04:53:959  Step 6 out of 6 steps completed
VERBOSE:
Done in 296.94s.
E:\marckassay\orldata [1.0.10 ↑2 +0 ~9 -0 ~]>
```
