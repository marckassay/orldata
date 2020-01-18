/**
 * To specify what environment setup to be used, append either suffix to `ng` commands:
 * `--configuration=dev` or `--configuration=production` for development and production, respectively.
 */
export const environment = {
  production: false,
  token: 'XsVdIPvgqvEmIgHOmFowjVeOu',
  semver: '1.0.12',
  // This value is retrived by: (Get-AzADApplication -DisplayName orldata-msal | Select-Object -ExpandProperty ApplicationId).Guid
  azureClientId: 'b4ef625d-edc4-4d5b-ac43-de07defa727e'
};
