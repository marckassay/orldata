/**
 * To specify what environment setup to be used, append either suffix to `ng` commands:
 * `--configuration=dev` or `--configuration=production` for development and production, respectively.
 */
export const environment = {
  production: false,
  token: 'SODA_APP_TOKEN',
  semver: '',
  // This value is retrived by: (Get-AzADApplication -DisplayName orldata-msal | Select-Object -ExpandProperty ApplicationId).Guid
  azureClientId: ''
};
