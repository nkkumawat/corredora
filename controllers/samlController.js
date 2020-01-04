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
var tokenHelper = require('../helpers/tokenHelper');
var queryString = require('query-string');
var sessionService = require('../services/sessionService');


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
    var realmName = req.params.realmName;
    var token = req.query.token;
    tokenHelper.decodeToken(token).then(token => {
      spDataHelper.init(realmName).then(spData => {
        var sp = new saml2.ServiceProvider(spData);
        idpDataHelper.init(realmName).then(idpData => {
          var idp = new saml2.IdentityProvider(idpData);
          sp.create_login_request_url(idp, {}, function(err, login_url, request_id) {
            if (err != null) { return res.send(500) }
            res.redirect(login_url);
          });
        }).catch(err => {
          logger.error(err);
          return res.render("error", {error: err})
        })
      }).catch(err => {
        logger.error(err);
        return res.render("error", {error: err})
      })
    }).catch(err => {
      logger.error(err);
      return res.render("error", {error: err})
    })
  },
  initAuth: (req, res, next) => { 
    var realmName = req.params.realmName;
    idpDataHelper.init(realmName).then(idpData => {
      spDataHelper.init(realmName).then(spData => {
        passport.createInstance({
          path: idpData.sso_login_url,
          entityPoint: idpData.sso_login_url,
          issuer: "passport-saml",
          decryptionPvk: spData.private_key, // ADFS case (if data encrypted)
          privateCert: spData.certificate, // ADFS case (if data encrypted)
          cert:  "-----BEGIN CERTIFICATE-----\n" + idpData.certificates[0]+ "\n-----END CERTIFICATE-----", 
          signatureAlgorithm: 'sha256',
        })
        next();
      }).catch(err => {
        logger.error(err)
        return res.json(responseHelper.withFailure(err))
      })
    }).catch(err => {
      logger.error(err)
      return res.json(responseHelper.withFailure(err))
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
    logger.info(req.session.passport.user)
    var nameID = req.session.passport.user.nameID;
    var sessionIndex = req.session.passport.user.sessionIndex;
    // var xml = req.session.passport.user.getSamlResponseXml();
    // var assertionXml = req.session.passport.user.getAssertionXml();
    var assertionJs = req.session.passport.user.getAssertion();
    var userAttributes = samlDataHelper.getAttributes(assertionJs);
    userAttributes["nameID"] = nameID;
    groupService.getGroupByName({group_name: req.params.realmName}).then(group => {
      userController.createUser(group.id, userAttributes).then(user => {
        var data = {
          user: user,
          session_id: sessionIndex
        }
        var sessionData = {
          group_id: user.group_id,
          user_id: user.id,
          session_id: sessionIndex
        }
        sessionService.createSession(sessionData).then(sess => {
          tokenHelper.getToken(data, constants.TOKEN_LIFE).then(token => {
            var qry = queryString.stringify({token: token});
            logger.info("Calling external URl: " + group.succ_callback + "?" + qry)
            return res.redirect(group.succ_callback + "?" + qry)
          }).catch(err => {
            logger.error(err)
            return res.redirect(group.fail_callback)
          })
        }).catch(err => {
          logger.error(err)
          return res.redirect(group.fail_callback)
        })
      }).catch(err => {
        logger.error(err)
        return res.json({err: err})
      })
    }).catch(err => {
      logger.error(err)
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
      return res.json(responseHelper.withFailure(err))
    })
  },
  createIdentityProvider: (req, res, next) => {
    // use this for create idp data
    // also call createSPMetadata after creating IDP metadata
    // make sure on successfull operation this will redirect to /admin/dashboard/identity-providers
    var params = req.body;
    var idpData = {
      group_id: params.group_id,
      sso_login_url: params.sso_login_url,
      sso_logout_url: params.sso_logout_url,
      certificates: params.certificates,
      force_authn: params.force_authn === 'on' ? true : false
    }
    var spData = {
      group_id: params.group_id,
      group_name: params.group_name,
      nameid_format: params.nameid_policies
    }
    logger.info("IDP metadata: ", idpData)
    logger.info("SP Meta data: ", spData)
    idpDataService.createIdpData(idpData).then(idpData => {
      createSPMetadata(spData).then(spData => {
        return res.redirect(`/admin/dashboard/group/${params.group_id}/identity-provider/${idpData.id}`)
      }).catch(err => {
        logger.error(err);
        return res.render("error", {error: err})
      })
    }).catch(err => {
      logger.error(err);
      return res.render("error", {error: err})
    })
  },
  logout: (req, res, next) => {
    // query: session_id and token
    var sessionId = req.query.session_id;
    var realmName = req.params.realmName;
    var token = req.query.token;
    tokenHelper.decodeToken(token).then(token => {
      sessionService.getSessionBySessionId({session_id: sessionId}).then(session => {
        spDataHelper.init(realmName).then(spData => {
          var sp = new saml2.ServiceProvider(spData);
          idpDataHelper.init(realmName).then(idpData => {
            var idp = new saml2.IdentityProvider(idpData);
            var options = {
              name_id: session['user.name_id'],
              session_index: sessionId
            };
            logger.info(options);
            sp.create_logout_request_url(idp, options, function(err, logout_url) {
              if (err != null)
                return res.send(500);
              res.redirect(logout_url);
            });
          }).catch(err => {
            logger.error(err);
            return res.render("error", {error: err})
          })
        }).catch(err => {
          logger.error(err);
          return res.render("error", {error: err})
        })
      }).catch(err => {
        logger.error(err);
        return res.render("error", {error: err})
      })
    }).catch(err => {
      logger.error(err);
      return res.render("error", {error: err})
    })
  }
}

module.exports.createSPMetadata = createSPMetadata;
