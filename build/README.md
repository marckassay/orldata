# .\build\

## .\build\image\

Contents of this folder include Docker related files and shell scripts to assist in building image and Azure deployments.

The following sections explain about development and production environments:

### development

These development instructions assume you're using VS Code for development. Before running inside VS Code, I find it best to do an initial build via CLI. This can be done by running: `yarn run up:dev`. Afterwards, stop the container and continue the instructions in the next paragraph.

Using VS Code's remote feature to develop inside running container, execute the 'Remote-Containers: Reopen in Container' command. This command will be seen when typing in the View > Command Palette of VS Code. Or can be executed by a click of the green left-bottom button as shown below:

![Open Remote Window](../resources/development/vscode-remote-dev-status-bar.png)

Once VS Code is running in the container, Angular dev server should be hosting OrlData that can be seen by visiting, `https://localhost:4201/` using your host computer's browser. The reason I choose to have enable SSL on localhost, was due to a requirement from Azure B2C for redirect Uris. And to start a debug session, select the 'serve orldata' debug configuration. Ensure breakpoints bind and hot reload is enabled. Also ensure git is enabled.

Caveats:

- Error: Cannot find module 'spdlog'
  - Is known by VS Code developers and mentioned implementing Alpine is in its early stages.

- "Port 4200 is already in use."
  - This comes after debugger is launched. Fortunately, the debugger continues with session. Solution is likely mentioned [here](https://code.visualstudio.com/docs/remote/containers#_creating-a-devcontainerjson-file) which needs to be implemented.

- "favicon.ico error"
  - This is likely erroneous due to the start-up command failing; 'ng serve'. When VS Code launches inside a container, the Angular live dev server logs cannot be seen, at least in the instance of VS Code that launched it. A solution is to open another instance of VS Code and in the 'Docker' extension, right-click on the now running container (even though Angular server is failing), to select the 'View Logs' item in the context menu. This should open VS Code's Terminal panel with logs shown.

### production

To build for production, simply call:

```shell
yarn run up:production
```

This will eventually call: `docker-compose up ...production.yml ... -d --build`. After build, you can test production build of the app at: `localhost:80`. This image will be named and tagged according to values specified in the `.env` file. If at this point the app is approved for production, you may stop docker container and continue to the deployment section of this document.

## .\build\deployment\

Contents of this folder includes a PowerShell module named, PSApp, and Azure ARM templates, to be used to deploy to Azure. PSApp has a dependency listed in its `RequiredModules` array. This dependency is named `XAz`, which will get downloaded and installed automatically.

The following command will deploy the Azure ARM template (`.\templates\app-deployment.json`). This template will create several resources on Azure that will be used in commands that follows. All variables need to be set in the `.\templates\app-deployment.parameters.json` file. When executed initially, an account in both in 'az cli' and 'Az PowerShell module' needs have at least a role to create new resource on Azure. All subsequent deployments can use the service principal created in the initial deployment.

Since Azure AD B2C is treated differently than Azure, unfortunately there isn't any templates to automate deployment.

For an example of output to a successful initial deployment, see `.\output-of-initial-deployment.md`  

```powershell
yarn run deployment
```

## Switches

Any of these can be used alone or in combination of others.

### Rebuild

This is to be used when docker image needs to be built. Since this is applied to deployment command, it will push the image to the registry and update Azure App with it.

```powershell
yarn run deployment -Rebuild
```

### RollOver

The service principal to be used in deployments (expect for initial deployment), is created in the `.\scripts\deployment.ps1` file. This principal is authenticated using a x509 certificate, which is stored in the certificate store. As the certificate has an expiration date, it will need to be rolled over at times. This switch indicates that prior to deployment, rollover this certificate.

```powershell
yarn run deployment -RollOver
```

### RollBack

If the desired image has already been published to Azure Container Registry, this method (no switch) will list all images available in the registry so that the user can select for deployment.

```powershell
yarn run deployment

Press '1' for: orldata:1.0.6
Press '2' for: orldata:1.0.7
Press '3' for: orldata:1.0.8
Press 'ENTER' to halt deployment.
Select image for deployment and press 'ENTER': 2
```

### SkipStage2

Skips the ARM template check. When you know that Azure resources don't need to be created or updated, to expedite the deployment process, this can be used.

```powershell
yarn run deployment -SkipStage2
```

## More Information

### Authenticate with Certificate and Authorize with Assigned Role

In the `.\scripts\deployment.ps1` file is where creation of service principal is located. Having `XAz` automatically installed into PowerShell session, creating a self-signed certificate and assigned to service principal for authenticationg to Azure, can be achieved. With this method of authentication, it seems that Azure doesn't allow system identities for WebApps to be able to authenticate to container registry too. Because of this, no managed identities are currently being used.
