var constants = require('../config/constants');
var responseHelper = require('../helpers/responseHelper');
var tokenHelper = require('../helpers/tokenHelper');
var idpDataService = require('../services/IdpDataService');
var groupService = require('../services/groupService');
var samlController = require('../controllers/samlController');
var logger = require('../utils/logger');



module.exports = {
  verifyRequest: (req, res, next) => {
    // params = {
    //   token: "STRING" // Jwt token
    // }
    var data = req.body.token;
    tokenHelper.decodeToken(data).then(token => {
      if(token) {
        return res.json(responseHelper.withSuccess({valid: true, data: token.user}))
      } else {
        return res.json(responseHelper.withSuccess({valid: false}))
      }
    }).catch(err => {
      return res.sendStatus(500).json(responseHelper.withFailure({error: err}))
    })
  },

  createIdentityProvider: (req, res, next) => {
    // params = {
    //   group_id : INT,
    //   sso_login_url: STRING,
    //   sso_logout_url: STRING,
    //   certificates: STRING,
    //   nameid_format: STRING
    //   force_authn: Boolean,
    // }
    var params = req.body;
    if(!params.group_id ||
        !params.sso_login_url ||
        !params.sso_logout_url ||
        !params.certificates ||
        !params.nameid_format ||
        !params.force_authn) {
        return res.json(responseHelper.withFailure({message: constants.MISSING_PARAMS.DEFAULT_ERROR}))
    }
    var idpData = {
      group_id: params.group_id,
      sso_login_url: params.sso_login_url,
      sso_logout_url: params.sso_logout_url,
      certificates: params.certificates,
      force_authn: params.force_authn
    }
    var spData = {
      group_id: params.group_id,
      nameid_format: params.nameid_format
    }
    logger.info("IDP metadata: ", idpData)
    logger.info("SP Meta data: ", spData)
    groupService.getGroupById({id: params.group_id}).then(group => {
      idpDataService.createIdpData(idpData).then(idpData => {
        spData['group_name'] = group.group_name;
        samlController.createSPMetadata(spData).then(spData => {
          return res.json(responseHelper.withSuccess({idpData: idpData, spData: spData}))
        }).catch(err => {
          return res.json(responseHelper.withFailure({error: err}))
        })
      }).catch(err => {
        return res.json(responseHelper.withFailure({error: err}))
      })
    }).catch(err => {
      return res.json(responseHelper.withFailure({error: err}))
    })
  },
  createGroup: (req, res, next) => {
    // parmas = {
    //   "group_name": "STRING",
    //   "succ_callback": "STRING",
    //   "fail_callback": "STRING"
    // }

    var params = req.body;
    if(!params.group_name ||
       !params.succ_callback ||
       !params.fail_callback){
      return res.json(responseHelper.withFailure({message: constants.MISSING_PARAMS.DEFAULT_ERROR}))
    }
    groupService.createGroup(params).then(group => {
      return res.json(responseHelper.withSuccess({group: group}))
    }).catch(err => {
      return res.json(responseHelper.withFailure({error: err}))
    })
  }
}