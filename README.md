# OrlData

An Angular app that syndicates to ['Orlando's Open Data'](https://data.cityoforlando.net/) services to view public data-sets. This project consists of the following:

- Front-end tech includes: [Angular](https://angular.io/) 8.0 with [NgRx](https://ngrx.io/) for state management, and also [Angular Material](https://material.angular.io/) for UI components.
- Cloud computing is Azure which consists of the following SaaS: [Azure AD B2C](https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-overview) for authentication using [msal-angular](https://github.com/AzureAD/microsoft-authentication-library-for-js); [ContainerRegistry](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-intro) for the application's Docker images; [KeyVault](https://docs.microsoft.com/en-us/azure/key-vault/key-vault-overview) for application credentials; and [App Service](https://docs.microsoft.com/en-us/azure/app-service/containers/app-service-linux-intro) to host Docker image.
- Docker image consists of: [Alpine](https://hub.docker.com/_/alpine/) for Linux; [NGINX](https://www.nginx.com/) for server; and [Docker-compose](https://docs.docker.com/compose/) to build image.

![OrlData](resources/media/web_screenshot.png)

The UI layout is derived from Angular Material's website, whereas my objective for the UI was to simply utilize Material components by styling and programming them. The services are provided by [Socrata](https://dev.socrata.com/)'s DaaS platform using their "rich query functionality" through a query language that they refer to as "Socrata Query Language" or "SoQL".

Development environment contains a Docker image that is able to hot-reload the browser. This is particularly helpful when simultaneously debugging on an attached Android phone, thanks to the robust Chrome browser. Production image is pushed to an Azure Container Registry for containerization by Azure App Service which is where the app is being hosted. PowerShell has been used to supplement automating CLI expressions with Azure ARM templates.

Visit the following link to see 'OrlData':
[orldata.azurewebsites.net](https://orldata.azurewebsites.net)

## Other README

For information on how to use this repository in regards to development and deployment, see the following README file:

- ['.\build\'](build/README.md)
