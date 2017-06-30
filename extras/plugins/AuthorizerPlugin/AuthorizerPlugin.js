/*
  Simply checks for the authorizer claims and adds it to config.user.
*/
const buildSettings = settings => ({
  removeAuthorizer: true,
  removeApiKey: false,
  ...settings,
});

export default class AuthorizerPlugin {
  constructor(settings) {
    this.settings = buildSettings(settings);
  }
  onBuild = (data, config) => {
    config.auth = {
      apiKey: null,
      user: null,
    };
    const requestContext = config.request && config.request.requestContext;
    if (requestContext) {
      config.auth.user = (requestContext.authorizer && requestContext.authorizer.claims) || null;
      config.auth.apiKey = (requestContext.identity && requestContext.identity.apiKey) || null;
    }
    if (this.settings.removeAuthorizer === true && config.auth.user) {
      delete config.request.requestContext.authorizer;
    }
    if (this.settings.removeApiKey === true && config.auth.apiKey) {
      delete config.request.requestContext.identity.apiKey;
    }
  };
}
