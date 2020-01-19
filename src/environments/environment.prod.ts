/**
 * To specify what environment setup to be used, append either suffix to `ng` commands:
 * `--configuration=dev` or `--configuration=production` for development and production, respectively.
 */
export const environment = {
  production: true,
  token: 'XsVdIPvgqvEmIgHOmFowjVeOu',
  semver: '1.0.12',
  // This value is retrived by: (Get-AzADApplication -DisplayName orldata-msal | Select-Object -ExpandProperty ApplicationId).Guid
  azureClientId: '7ddfc531-7244-4f44-a3ff-5f89ff2bac4c',
};
