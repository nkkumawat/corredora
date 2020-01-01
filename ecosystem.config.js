module.exports = {
  apps : [{
    name: "SAML-SSO-APP",
    script: "./bin/www",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}