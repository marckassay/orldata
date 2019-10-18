# build/README.md

## Build Processes

### production

To build and deploy to nginx webserver, simply call:

```shell
yarn run up:production
```

This will eventually call: `docker-compose up ...production.yml ... -d --build`. After build `nginx:alpine` container should be running, which you can test production build of the app at: `localhost:80`.

### development

These development instructions assume you're using VS Code for development.

Using VS Code's remote feature to work inside container, execute the 'Remote-Container: Reopen in Container' command. This command will be seen when typing in the View > Command Palette of VS Code.

Once VS Code is running in the container and to start a debug session, select the 'serve orldata' debug configuration. Ensure breakpoints bind and hot
reload is enabled. Also ensure git is enabled.

Caveats:

- Error: Cannot find module 'spdlog'
  - Is known by VS Code developers and mentioned implementing Alpine is in its early stages.

- "Port 4200 is already in use."
  - This comes after debugger is launched. Fortunately, the debugger continues with session. Solution is likely mentioned [here](https://code.visualstudio.com/docs/remote/containers#_creating-a-devcontainerjson-file) which needs to be implemented.

## Deployment Process

This section is still being worked on.
```
$ Connect-AzAccount
$ $OrlDataCR = Get-AzContainerRegistry -ResourceGroupName orldataResourceGroup -Name orldataContainerRegistry
$ $CRCredentials = Get-AzContainerRegistryCredential -Registry $OrlDataCR
$ $CRCredentials.Password | docker login $OrlDataCR.LoginServer -u $CRCredentials.Username --password-stdin
$ yarn run up:production
$ docker tag d03d8eb63c4a orldatacontainerregistry.azurecr.io/orldata/prod:1.0.4
$ docker push orldatacontainerregistry.azurecr.io/orldata/prod:1.0.4
$ # az webapp config appsettings set --resource-group orldataResourceGroup --name orldataWebApp --settings WEBSITES_ENABLE_APP_SERVICE_STORAGE=true
$ New-Storage
$ . .\build\Get-DeploymentTemplateObject.ps1
$ Get-DeploymentTemplateObject -SslKeyPath 'D:\Google Drive\Documents\Programming\orldata\ssl.key' | New-XAzResourceGroupDeployment `
  -ContainerRegistryName orldataContainerRegistry `
  -Image orldata/prod:1.0.4 `
  -TemplateName deploy-orldata-port-443.json `
  -Name orldata-deploygroup
```


$AzCred = Get-Credential -UserName <username>
az login -u $AzCred.UserName -p $AzCred.GetNetworkCredential().Password

az webapp create --name aorldata --resource-group orldataResourceGroup --docker-registry-server-url https://orldatacontainerregistry.azurecr.io  --multicontainer-config-type compose --multicontainer-config-file .\docker-compose.azure.yml --docker-registry-server-user orldataContainerRegistry --docker-registry-server-password uWOAI3W8+RuC2+ofps=w8aoIb/8rZGrv

az webapp create --resource-group orldataResourceGroup --plan orldataAppServicePlanII --name zorldata  --multicontainer-config-type compose --multicontainer-config-file .\docker-compose.azure.yml
