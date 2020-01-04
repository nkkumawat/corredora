var constants = require('../config/constants');
module.exports = require('logger').createLogger(`${constants.LOG_DIR}/development.log`);
