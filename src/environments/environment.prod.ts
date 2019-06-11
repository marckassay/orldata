export enum DatasetIDs {
  PERMITS = 'ryhf-m453',
  CRIMES = '4y9m-jbmz'
}

/**
 * To specify what environment setup to be used, append either suffix to `ng` commands:
 * `--configuration=dev` or `--configuration=production` for development and production, respectively.
 */
export const environment = {
  production: true,
  token: 'SODA_APP_TOKEN',
  endpoint: (id: DatasetIDs) => `https://data.cityoforlando.net/resource/${id}.json`,
  metadata_endpoint: (id: DatasetIDs) => `https://data.cityoforlando.net/api/views/metadata/v1/${id}`
};
