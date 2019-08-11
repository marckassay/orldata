The dev and prod folders are here to circumvent this limitation in VS Code:
https://github.com/microsoft/vscode-docker/pull/531

# New-OrlDataResourcesDeployment

Creates the following resources: ResourceGroup, ContainerRegistry, ContainerInstance, VNET, (Application) Gateway

# Build-OrlDataImage -Environment [dev | production] -Run

Builds a Docker image for the specified environment. If Run is switched, image will be instantiated as local container

# Tag-OrlDataImage -Value

Tags the local `orldata` image with the value of `Value`

# Push-OrlDataImage -Tag

Pushes image with the `Tag` value to ContainerRegistry

# Get-DeploymentTemplateObject
