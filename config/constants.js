var env       = process.env.NODE_ENV || 'development';
var config    = require('../config/config.json')[env];

module.exports = {
  APP_NAME: "myapp",
  HOST_NAME: config['host'],
  SERVER_SUPER_SECRET: config['secret'],
  MISSING_PARAMS: {
    GROUP_ID: "Group ID is not present in params",
    MAPPER_ID: "Mapper ID is not present in params",
    SAML_ATTR: "SAML Attribute is not present in params",
    USER_ATTR: "User Attribute is not present in params",
    REALM_NAME: "Realm Name is not present",
    DEFAULT_ERROR: "Some params are missing",
    SESSION_ID: "Session Id is not present in params",
    IDP_ID: "IDP Id is not present in params",
    LIMIT: "Data limit is not defined"
  },
  INVALID_TOKEN: "Invalid token",
  DEFAULT_ERROR: "Something went wrong!",
  NOT_PRESENT: {
    GROUP: "Group is not present",
    USER: "User is not present",
    SESSION: "Session is not present",
    MAPPER: "Mapper is not present",
    IDP: "Identity provider is not present"
  },
  CERTIFICATE_LIFE: config['certificate-life'],
  NAMEID_POLICIES: {
    persistent: "string:urn:oasis:names:tc:SAML:2.0:nameid-format:persistent",
    email: "string:urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
    unspecified : "string:urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified"
  },
  TOKEN_LIFE: config["token-validation"],
  PASSWORD_SALT_ROUND: config["password-salt-rounds"]
}