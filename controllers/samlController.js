var spDataHelper = require("../helpers/spDataHelper");
var idpDataHelper = require("../helpers/idpDataHelper");
var passport = require('../utils/passport');
var saml2 = require('saml2-js');
var responseHelper = require('../helpers/responseHelper');
var samlDataHelper = require('../helpers/samlDataHelper');
var fs = require('fs');
var userController = require("./userController");
var groupService = require('../services/groupService');


module.exports = {
  initLogin: (req, res, next) => {
    var realmName = req.params.realmName
    spDataHelper.init(realmName).then(spData => {
      var sp = new saml2.ServiceProvider(spData);
      idpDataHelper.init(realmName).then(idpData => {
        var idp = new saml2.IdentityProvider(idpData);
        sp.create_login_request_url(idp, {}, function(err, login_url, request_id) {
          if (err != null) { return res.send(500) }
          return res.redirect(login_url);
        });
      }).catch(err => {
        console.log(err, "========================")
        return res.sendStatus(500).json(responseHelper.withFailure(err))
      })
    }).catch(err => {
      return res.sendStatus(500).json(responseHelper.withFailure(err))
    })
  },
  initAuth: (req, res, next) => { 
    var realmName = req.params.realmName;
    // console.log(req.body)
    idpDataHelper.init(realmName).then(idpData => {
      passport.createInstance({
        path: idpData.sso_login_url,
        entityPoint: idpData.sso_login_url,
        issuer: "passport-saml",
        // decryptionPvk: fs.readFileSync('scripts/acme_tools_com.key', 'utf-8'), // ADFS case (if data encrypted)
        // privateCert: fs.readFileSync('scripts/acme_tools_com.key', 'utf-8'), // ADFS case (if data encrypted)
        cert:  "-----BEGIN CERTIFICATE-----\n" + idpData.certificates[0]+ "\n-----END CERTIFICATE-----", 
        signatureAlgorithm: 'sha256',
      })
      next();
    }).catch(err => {
      console.log(err)
      return res.sendStatus(500).json(responseHelper.withFailure(err))
    })
  },
  passportAuth: passport.passport.authenticate(
      'saml',
      {
        failureRedirect: '/saml/logout',
        failureFlash: true,
      }
    ),
  assertionLogin: (req, res, next) => {
    // return res.send(req.body)
    var nameID = req.session.passport.user.nameID;
    var sessionIndex = req.session.passport.user.sessionIndex;
    var xml = req.session.passport.user.getSamlResponseXml();
    var assertionXml = req.session.passport.user.getAssertionXml();
    var assertionJs = req.session.passport.user.getAssertion();
    var userAttributes = samlDataHelper.getAttributes(assertionJs);
    userAttributes["nameID"] = nameID;
    groupService.getGroupRealm({group_name: req.params.realmName}).then(groupID => {
      var user = userController.createUser(groupID, userAttributes);
      return res.json({attr: userAttributes, nameID: nameID, user: user})
    }).catch(err => {
      console.log(err)
      return res.json({err: err})
    })
  },
  metaData: (req, res, next) => {
    var realmName = req.params.realmName
    spDataHelper.init(realmName).then(spData => {
      var sp = new saml2.ServiceProvider(spData);
      res.type('application/xml');
      return res.send(sp.create_metadata());
    }).catch(err => {
      console.log(err)
      return res.sendStatus(500).json(responseHelper.withFailure(err))
    })
  }
}