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

E:\marckassay\orldata [1.0.4]> . .\build\Get-DeploymentTemplateObject.ps1
E:\marckassay\orldata [1.0.4]> Get-DeploymentTemplateObject -SslKeyPath C:\Users\marck\ssl.key
