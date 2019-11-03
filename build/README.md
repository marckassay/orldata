# .\build\

## .\build\image\

Contents of this folder include Docker related files and shell scripts to assist in building image.

The following sections explain about development and production environments:

### development

These development instructions assume you're using VS Code for development. Before running inside VS Code, I find it best to do an initial build via CLI. This can be done by running: `yarn run up:dev`. Afterwards, stop the container and read the following instructions in the next paragraph.

Using VS Code's remote feature to work inside container, execute the 'Remote-Containers: Reopen in Container' command. This command will be seen when typing in the View > Command Palette of VS Code. Or can be executed by a click of the green left-bottom button as shown below:

![Open Remote Window](../resources/development/vscode-remote-dev-status-bar.png)

Once VS Code is running in the container and to start a debug session, select the 'serve orldata' debug configuration. Ensure breakpoints bind and hot
reload is enabled. Also ensure git is enabled.

Caveats:

- Error: Cannot find module 'spdlog'
  - Is known by VS Code developers and mentioned implementing Alpine is in its early stages.

- "Port 4200 is already in use."
  - This comes after debugger is launched. Fortunately, the debugger continues with session. Solution is likely mentioned [here](https://code.visualstudio.com/docs/remote/containers#_creating-a-devcontainerjson-file) which needs to be implemented.

### production

To build for production, simply call:

```shell
yarn run up:production
```

This will eventually call: `docker-compose up ...production.yml ... -d --build`. After build, you can test production build of the app at: `localhost:80`.

## .\build\deployment\

Contents of this folder includes a PowerShell module named, PSApp, and Azure ARM templates, to be used to deploy to Azure.

The following command will deploy an Azure ARM template. This template will create several resources on Azure that will be used in commands that follows. All variables need to be set in the `parameters.json` file. This is to be executed only once as it sets-up Azure for future update deployments.

```powershell
yarn run new:deployment
```

After the preceeding command has been executed successfully, the command below will build a docker image, publish it to Azure Container Registry and update the Azure App that was created prior. This deployment method performs the most computing in comparsion of the two others that follows.

```powershell
yarn run update:deployment -BuildAndPublish
```

This is to be used when a local image has already been built. It will publish and update the Azure App similar to the deployment method just mentioned.

```powershell
yarn run update:deployment -PublishOnly
```

If the desired image has already been published to Azure Container Registry, this method (no switch) will list all images available in the registry so that the user can select for deployment.

```powershell
yarn run update:deployment
Press '1' for: orldata/prod:1.0.6
Press '2' for: orldata/prod:1.0.7
Press '3' for: orldata/prod:1.0.8
Press 'ENTER' to halt deployment.
Select image for deployment and press 'ENTER': 3
```
