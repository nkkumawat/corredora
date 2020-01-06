var constants = require('./config/constants');
module.exports = {
  apps : [{
    name: constants.APP_NAME,
    script: './bin/www',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
