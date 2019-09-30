/**
 * To specify what environment setup to be used, append either suffix to `ng` commands:
 * `--configuration=dev` or `--configuration=production` for development and production, respectively.
 */
export const environment = {
  production: true,
  // TODO: Yeah, I know. This is used exclusively for read-only queries. Setup Azure for OAuth for services.
  token: 'XsVdIPvgqvEmIgHOmFowjVeOu',
  semver: '1.0.3'
};
