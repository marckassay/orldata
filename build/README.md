## Build Processes

The requirements for:

### production

To build and deploy to nginx webserver, simply call:

```shell
yarn run up:production
```

### development

To build development image, ideally use VSCode's remote feature to work inside container. Click on the bottom-left "><" icon and select the 
"Reopen in Container" command.

Once VSCode is running in the container and to start a debug session, select the 'serve orldata' debug configuration. Breakpoints bind and hot
reload is enabled, git is enabled.

Cavets: 
- Error: Cannot find module 'spdlog': is known by vscode developers as this project is using Alpine. 
- "Port 4200 is already in use.": this comes after debugger is launched. Fortunately, the debugger continues with session. Solution is likely mentioned here: https://code.visualstudio.com/docs/remote/containers#_creating-a-devcontainerjson-file