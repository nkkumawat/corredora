const Passport = require("passport").Passport;
const SamlStrategy = require('passport-saml').Strategy;
var passport = new Passport();

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

createInstance = (config) => {
  
  passport.use(new SamlStrategy(
    {
      path: config.path,
      entryPoint: config.entryPoint,
      issuer: config.issuer,
      privateCert: config.privateCert
    },
    function(profile, done) {
      done(null, profile)
    })
  );
}

module.exports.createInstance = createInstance;
module.exports.passport = passport;