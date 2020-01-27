/**
 * To specify what environment setup to be used, append either suffix to `ng` commands:
 * `--configuration=dev` or `--configuration=production` for development and production, respectively.
 */
export const environment = {
  production: false,
  token: 'SODA_APP_TOKEN',
  semver: '',
  azure: {
    authority: '',
    // A unique identifier that is used to represent your application on requests made to Azure AD B2C
    clientId: '',
    redirectUri: ''
  }
};
