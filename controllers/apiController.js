var constants = require('../config/constants');
var responseHelper = require('../helpers/responseHelper');
var tokenHelper = require('../helpers/tokenHelper');
var idpDataService = require('../services/IdpDataService');
var groupService = require('../services/groupService');
var mapperService = require('../services/mapperService');
var samlController = require('../controllers/samlController');
var logger = require('../utils/logger');
var uuidv4 = require('uuid/v4');


module.exports = {
  verifyToken: (req, res, next) => {
    // params = {
    //   token: "STRING" // Jwt token
    // }
    var data = req.body.token;
    tokenHelper.decodeToken(data).then(token => {
      if(token) {
        return res.json(responseHelper.withSuccess({valid: true, data: token}))
      } else {
        return res.json(responseHelper.withSuccess({valid: false}))
      }
    }).catch(err => {
      return res.json(responseHelper.withFailure({error: err}))
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
  createMapper: (req, res, next) => {
    // parmas = {
    //   "group_id": "STRING",
    //   "saml_attribute": "STRING",
    //   "user_attribute": "STRING"
    // }

    var params = req.body;
    if(!params.group_id ||
       !params.saml_attribute ||
       !params.user_attribute){
      return res.json(responseHelper.withFailure({message: constants.MISSING_PARAMS.DEFAULT_ERROR}))
    }
    mapperService.createMapper(params).then(mapper => {
      return res.json(responseHelper.withSuccess({mapper: mapper}))
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
  },
  getGroup: (req, res, next) => {
    // parmas = {
    //   "group_id": "INT",
    // }
    var params = req.query;
    if(!params.group_id){
      return res.json(responseHelper.withFailure({message: constants.MISSING_PARAMS.GROUP_ID}))
    }
    groupService.getOnlyGroupById({id: params.group_id}).then(group => {
      return res.json(responseHelper.withSuccess({group: group}))
    }).catch(err => {
      return res.json(responseHelper.withFailure({error: err}));
    })
  },
  getGroupMappers: (req, res, next) => {
    var params = req.params;
    if(!params.group_id){
      return res.json(responseHelper.withFailure({message: constants.MISSING_PARAMS.GROUP_ID}))
    }
    mapperService.getGroupMappers(params).then(mappers => {
      return res.json(responseHelper.withSuccess({mappers: mappers}))
    }).catch(err => {
      return res.json(responseHelper.withFailure({error: err}));
    })
  },
  getGroups: (req, res, next) => {
    // parmas = {
    //   "offset": "INT",
    //   "limit": "INT",
    // }
    var params = req.query;
    if(!params.limit){
      return res.json(responseHelper.withFailure({message: constants.MISSING_PARAMS.LIMIT}))
    }
    if(!params.offset){
      params.offset = 0;
    }
    groupService.getAllGroupsOffsetLimit(params).then(group => {
      return res.json(responseHelper.withSuccess({group: group}))
    }).catch(err => {
      return res.json(responseHelper.withFailure({error: err}));
    })
  },
  getToken: (req, res, next) => {
    var params = req.basicAuth;
    if(!params.name ||
      !params.pass){
     return res.json(responseHelper.withFailure({message: constants.MISSING_PARAMS.DEFAULT_ERROR}))
    }
    params['_uuid'] = uuidv4();
    tokenHelper.getToken({token: params}, constants.TOKEN_LIFE).then(token => {
      return res.json(responseHelper.withSuccess({token: token}));
    }).catch(err => {
      return res.json(responseHelper.withFailure({error: err}));
    })
  },
  deleteGroup: (req, res, next) => {
    // parmas = {
    //   "group_id": "INT",
    // }
    var params = req.body;
    if(!params.group_id){
      return res.json(responseHelper.withFailure({message: constants.MISSING_PARAMS.GROUP_ID}))
    }
    groupService.deleteGroup({id: params.group_id}).then(group => {
      return res.json(responseHelper.withSuccess({deleted: true}))
    }).catch(err => {
      return res.json(responseHelper.withFailure({error: err}));
    })
  },
  updateGroup: (req, res, next) => {
    // parmas = {
    //   "group_id": "INT",
    //   "group_name": "STRING", // optional
    //   "succ_callback": "STRING", // optional
    //   "fail_callback": "STRING" //optional
    // }
    var params = req.body;
    var notPresent = 0;
    var updateParams = {};
    if(!params.group_id){
      return res.json(responseHelper.withFailure({message: constants.MISSING_PARAMS.GROUP_ID}))
    }
    if(params.group_name) { notPresent ++; updateParams['group_name'] = params.group_name;}
    if(params.succ_callback) { notPresent ++; updateParams['succ_callback'] = params.succ_callback;}
    if(params.fail_callback) { notPresent ++; updateParams['fail_callback'] = params.fail_callback;}
    if(notPresent == 0) {
      return res.json(responseHelper.withFailure({message: constants.MISSING_PARAMS.DEFAULT_ERROR}))
    }
    groupService.updateGroup({id: params.group_id, updateParams: updateParams}).then(group => {
      return res.json(responseHelper.withSuccess({updated: true}))
    }).catch(err => {
      return res.json(responseHelper.withFailure({error: err}));
    })
  },
  deleteMapper: (req, res, next) => {
    // parmas = {
    //   "mapper_id": "INT",
    // }
    var params = req.body;
    if(!params.mapper_id){
      return res.json(responseHelper.withFailure({message: constants.MISSING_PARAMS.GROUP_ID}))
    }
    mapperService.deleteMapper({id: params.mapper_id}).then(mp => {
      return res.json(responseHelper.withSuccess({deleted: true}))
    }).catch(err => {
      return res.json(responseHelper.withFailure({error: err}));
    })
  },
  getMapper: (req, res, next) => {
    // query = {
    //   "mapper_id": "INT",
    // }
    var params = req.query;
    if(!params.mapper_id){
      return res.json(responseHelper.withFailure({message: constants.MISSING_PARAMS.MAPPER_ID}))
    }
    mapperService.getMapper({id: params.mapper_id}).then(mp => {
      return res.json(responseHelper.withSuccess({mapper: mp}))
    }).catch(err => {
      return res.json(responseHelper.withFailure({error: err}));
    })
  },
  getMappers: (req, res, next) => {
    // parmas = {
    //   "offset": "INT",
    //   "limit": "INT",
    // }
    var params = req.query;
    if(!params.limit){
      return res.json(responseHelper.withFailure({message: constants.MISSING_PARAMS.LIMIT}))
    }
    if(!params.offset){
      params.offset = 0;
    }
    mapperService.getMappersOffsetLimit(params).then(mp => {
      return res.json(responseHelper.withSuccess({mappers: mp}))
    }).catch(err => {
      return res.json(responseHelper.withFailure({error: err}));
    })
  },
  updateMapper: (req, res, next) => {
    // params = {
    //   "mapper_id": "INT",
    //   "group_id": "INT",
    //   "saml_attribute": "STRING",
    //   "user_attribute": "STRING"
    // }

    var params = req.body;
    var notPresent = 0;
    var updateParams = {};
    if(!params.mapper_id){
      return res.json(responseHelper.withFailure({message: constants.MISSING_PARAMS.MAPPER_ID}))
    }
    if(params.group_id) {notPresent ++; updateParams['group_id'] = params.group_id}
    if(params.saml_attribute) {notPresent ++; updateParams['saml_attribute'] = params.saml_attribute}
    if(params.user_attribute) {notPresent ++; updateParams['user_attribute'] = params.user_attribute}
    if(notPresent == 0) {
      return res.json(responseHelper.withFailure({message: constants.MISSING_PARAMS.DEFAULT_ERROR}))
    }
    mapperService.updateMapper({id: params.mapper_id, updateParams: updateParams}).then(mp => {
      return res.json(responseHelper.withSuccess({updated: true}))
    }).catch(err => {
      return res.json(responseHelper.withFailure({error: err}));
    })
  },
  getIdentityProvider: (req, res, next) => {
    // params = {
    //   "idp_id": "INT",
    // }
    var params = req.query;
    if(!params.idp_id){
      return res.json(responseHelper.withFailure({message: constants.MISSING_PARAMS.IDP_ID}))
    }
    idpDataService.getIdpDataById({id: params.idp_id}).then(idp => {
      var spData = idp['sp_datum'];
      var idpData = idp.dataValues;
      delete idpData["sp_datum"];
      return res.json(responseHelper.withSuccess({idpData: idpData, spData: spData}))
    }).catch(err => {
      return res.json(responseHelper.withFailure({error: err}));
    })
  },
  getGroupIdentityProvider: (req, res, next) => {
    // params = {
    //   "group_id": "INT",
    // }
    var params = req.params;
    if(!params.group_id){
      return res.json(responseHelper.withFailure({message: constants.MISSING_PARAMS.GROUP_ID}))
    }
    idpDataService.getIdpDataWithGroups(params).then(idp => {
      // var spData = idp['sp_datum'];
      var idpData = idp;
      // delete idpData["sp_datum"];
      return res.json(responseHelper.withSuccess({idpData: idpData}))
    }).catch(err => {
      console.log(err)
      return res.json(responseHelper.withFailure({error: err}));
    })
  },
  getIdentityProviders: (req, res, next) => {
    // parmas = {
    //   "offset": "INT",
    //   "limit": "INT",
    // }
    var params = req.query;
    if(!params.limit){
      return res.json(responseHelper.withFailure({message: constants.MISSING_PARAMS.LIMIT}))
    }
    if(!params.offset){
      params.offset = 0;
    }
    idpDataService.getAllIdpDataOffsetLimit(params).then(idp => {
      var idpData = idp;
      return res.json(responseHelper.withSuccess({idpData: idpData}))
    }).catch(err => {
      console.log(err)
      return res.json(responseHelper.withFailure({error: err}));
    })
  }
}