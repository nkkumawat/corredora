var env       = process.env.NODE_ENV || 'development';
var config    = require('../config/config.json')[env];

module.exports = {
  APP_NAME: "myapp",
  HOST_NAME: config['host'],
  SERVER_SUPER_SECRET: config['secret'],
  MISSING_PARAMS: {
    GROUP_ID: "Group ID is not present in params",
    REALM_NAME: "Realm Name is not present",
    DEFAULT_ERROR: "Some params are missing"
  },
  DEFAULT_ERROR: "Something went wrong!"
}