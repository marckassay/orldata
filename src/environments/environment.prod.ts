/**
 * To specify what environment setup to be used, append either suffix to `ng` commands:
 * `--configuration=dev` or `--configuration=production` for development and production, respectively.
 */
export const environment = {
  production: true,
  token: 'XsVdIPvgqvEmIgHOmFowjVeOu',
  semver: '1.0.13',
  azure: {
    authority: 'https://orldatab2c.b2clogin.com/orldatab2c.onmicrosoft.com/B2C_1_signupsignin2',
    // A unique identifier that is used to represent your application on requests made to Azure AD B2C
    clientId: '30e4178e-d6c6-412c-9e1c-5d3d53c6f635',
    redirectUri: 'https://orldata.azurewebsites.net',
    postLogoutRedirectUri: 'https://orldata.azurewebsites.net',
  }
};
