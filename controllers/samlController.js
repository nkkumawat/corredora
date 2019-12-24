var saml2 = require('saml2-js');
var passport = require('../utils/passport');
var constants = require('../config/constants');
var logger = require('../utils/logger');
var userController = require("./userController");
var spDataHelper = require("../helpers/spDataHelper");
var idpDataHelper = require("../helpers/idpDataHelper");
var responseHelper = require('../helpers/responseHelper');
var samlDataHelper = require('../helpers/samlDataHelper');
var groupService = require('../services/groupService');
var spDataService = require('../services/spDataService');
var idpDataService = require('../services/idpDataService');
var certificateHelper = require('../helpers/certificateHelper');

var createSPMetadata = (params) => { // Use this after IDP creation // send group_name from body params (hidden field)
  return new Promise((resolve, reject) => {
    var data = {
      group_id: params.group_id,
      entity_id: constants.HOST_NAME,
      assert_endpoint: constants.HOST_NAME + "/saml/" + params.group_name + "/assert",
      nameid_format: params.nameid_format
    }
    certificateHelper.getCertificates().then(cert => {
      data['private_key'] = cert.serviceKey;
      data['certificate'] = cert.certificate;
      spDataService.createSPData(data).then(spData => {
        resolve(spData);
      }).catch(err => {
        reject(err);
      })
    }).catch(err => {
      reject(err);
    })
  })
}

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
  },
  createIdentityProvider: (req, res, next) => {
    // use this for create idp data
    // also call createSPMetadata after creating IDP metadata
    // make sure on successfull operation this will redirect to /admin/dashboard/identity-providers
    var params = req.body;
    var group = params.group_id.split("|")
    var idpData = {
      group_id: group[0],
      sso_login_url: params.sso_login_url,
      sso_logout_url: params.sso_logout_url,
      certificates: params.certificates,
      force_authn: params.force_authn === 'on' ? true : false
    }
    var spData = {
      group_id: group[0],
      group_name: group[1],
      nameid_format: params.nameid_policies
    }
    logger.info("IDP metadata: ", idpData)
    logger.info("SP Meta data: ", spData)
    idpDataService.createIdpData(idpData).then(idpData => {
      createSPMetadata(spData).then(spData => {
        return res.redirect(`/admin/dashboard/identity-provider/${idpData.id}`)
      }).catch(err => {
        return res.render("error", {error: err})
      })
    }).catch(err => {
      console.log(err)
      return res.render("error", {error: err})
    })
  }
}