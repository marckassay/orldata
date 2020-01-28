/**
 * To specify what environment setup to be used, append either suffix to `ng` commands:
 * `--configuration=dev` or `--configuration=production` for development and production, respectively.
 */
export const environment = {
  production: false,
  token: 'XsVdIPvgqvEmIgHOmFowjVeOu',
  semver: '1.0.12',
  azure: {
    authority: 'https://orldatab2c.b2clogin.com/orldatab2c.onmicrosoft.com/B2C_1_signupsignin2',
    // A unique identifier that is used to represent your application on requests made to Azure AD B2C
    clientId: '4ff92049-e2e1-44a0-894d-fd3c7580e8ce',
    redirectUri: 'https://localhost:4201/auth',
    postLogoutRedirectUri: 'https://localhost:4201/logout',
  }
};
