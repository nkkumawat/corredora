var adminUserService = require('../services/admin/adminUserService');
var groupService = require('../services/groupService');
var mapperService = require('../services/mapperService');
var tokenHelper = require('../helpers/tokenHelper');
var constants = require("../config/constants");
var responseHelper = require("../helpers/responseHelper");
var idpdataService = require("../services/IdpDataService");
var logger = require('../utils/logger');

module.exports = {
  renderLogin: (req, res, next) => {
    return res.render('admin/login')
  },
  renderSignUp: (req, res, next) => {
    return res.render('admin/signup')
  },
  verifyLogin: (req, res, next) => {
    params = req.body;
    adminUserService.getUser(params).then(user => {
      tokenHelper.getToken(user).then((token) => {
        var maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        res.cookie(constants.APP_NAME, token, { maxAge: maxAge, httpOnly: true });
        return res.redirect("/")
      }).catch((err) => {
        
        return res.render('error', {error: err})
      })
    }).catch(err => {
      logger.error(err);
      return res.redirect("/admin/login")
    })
  },
  signUp: (req, res, next) => {
    params = req.body;
    adminUserService.createUser(params).then(user => {
      var tok = {
        email: user.email,
        id: user.id
      }
      tokenHelper.getToken(tok).then((token) => {
        var maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        res.cookie(constants.APP_NAME, token, { maxAge: maxAge, httpOnly: true });
        return res.redirect("/")
      }).catch((err) => {
        return res.render('error', {error: err})
      })
    }).catch(err => {
      return res.render('error', {error: err})
    })
  },
  renderDashboard: (req, res, next) => {
    var data = {
      page: "dashboard"
    }
    return res.render("admin/dashboard", responseHelper.withSuccess(data) )
  },
  renderCreateGroup: (req, res, next) => {
    var data = {
      page: "createGroup"
    }
    return res.render("admin/dashboard", responseHelper.withSuccess(data) )
  },
  renderCreateMapper: (req, res, next) => {
    var data = {
      page: "createMapper"
    }
    var group_id = req.params.group_id;
    groupService.getGroupById({id: group_id}).then(group => {
      data['group'] = group;
      return res.render("admin/dashboard", responseHelper.withSuccess(data) )
    }).catch(err => {
      return res.render("error", {error: err})
    })
  },  
  renderGroup: (req, res, next) => {
    var group_id = req.params.id;
    var data = {
      page: "getGroup"
    }
    groupService.getGroupById({id: group_id}).then(group => {
      data['group'] = group;
      return res.render("admin/dashboard", responseHelper.withSuccess(data) )
    }).catch(err => {
      logger.error(err)
      return res.render("error", {error: "Something went wrong"})
    })
  },
  createGroup: (req, res, next) => {
    groupService.createGroup(req.body).then(group => {
      if(group) {
        return res.redirect("/admin/dashboard/groups");
      } else {
        return res.render("error", {error: "Something went wrong"})
      }
    }).catch(err => {
      return res.render("error", {error: err})
    })
  },
  createMapper: (req, res, next) => {
    var params = req.body;
    var group_id = req.params.group_id;
    params['group_id'] = group_id;
    mapperService.createMapper(params).then(mapper => {
      if(mapper) {
        return res.redirect(`/admin/dashboard/group/${group_id}/mappers`);
      } else {
        return res.render("error", {error: "Something went wrong"})
      }
    }).catch(err => {
      return res.render("error", {error: err})
    })
  },
  renderGroups: (req, res, next) => {
    groupService.getAllGroups().then(groups => {
      var data = {
        page: "allGroups",
        groups: groups
      }
      return res.render('admin/dashboard', responseHelper.withSuccess(data))
    }).catch(err => {
      return res.render("error", {error: err})
    })
  },
  renderCreateIdentityProvider: (req, res, next) => {
    var data = {
      page: "createIdentityProvider",
      nameIdPolicies: constants.NAMEID_POLICIES
    }
    var currentGroupId = req.params.group_id;
    groupService.getAllGroups().then(groups => {
      data['groups'] = groups;
      groups.forEach(g => {
        if(g.id == currentGroupId){
          data['group'] = g;
        }
      })
      console.log(data);
      return res.render('admin/dashboard', responseHelper.withSuccess(data))
    }).catch(err => {
      return res.render("error", {error: err})
    })
  },
  renderIdentityProviders: (req, res, next) => {
    idpdataService.getAllIdpData().then(data => {
      
    }).catch(err => {
      return res.render("error", {error: err})
    })
  },
  renderMappers: (req, res, next) => {
    var group_id = req.params.group_id;
    groupService.getGroupById({id: group_id}).then(group => {
      mapperService.getGroupMappers({group_id: group_id}).then(mappers => {
        var data = {
          page: "groupMappers",
          group: group,
          mappers: mappers
        }
        return res.render('admin/dashboard', responseHelper.withSuccess(data))
      })
    }).catch(err => {
      return res.render("error", {error: err})
    })
  },
  renderIdentityProvider: (req, res, next) => {
    // var id = req.params.id;
    var group_id = req.params.group_id;
    idpdataService.getIdpDataWithGroups({group_id: group_id}).then(allData => {
      if(!allData){
        return res.render("error", {error: "No IDP Present"});
      }
      var data = {
        idpData: allData,
        page: "identityProvider",
        host: constants.HOST_NAME,
        group: {id: allData['group.id'], group_name: allData['group.group_name'], 'idp_data.id': allData.id}
      };
      logger.info(allData)
      mapperService.getGroupMappers({group_id: group_id}).then(mappers => {
        data['mappers'] = mappers;
        return res.render('admin/dashboard', responseHelper.withSuccess(data))
      }).catch(err => {
        return res.render("error", {error: err})
      })
    }).catch(err => {
      return res.render("error", {error: err})
    })
  },
  deleteGroup: (req, res, next) => {
    var group_id = req.params.id;
    logger.info(`deleting group ${group_id}`)
    if(!group_id){
      return res.render("error", {error: constants.MISSING_PARAMS.GROUP_ID})
    }
    groupService.deleteGroup({id: group_id}).then(gd => {
      return res.json(responseHelper.withSuccess(true))
    }).catch(err => {
      return res.json(responseHelper.withFailure(false))
    })
  },
  deleteMapper: (req, res, next) => {
    var mapper_id = req.params.id;
    logger.info(`deleting mapper ${mapper_id}`)
    if(!mapper_id){
      return res.render("error", {error: constants.MISSING_PARAMS.MAPPER_ID})
    }
    mapperService.deleteMapper({id: mapper_id}).then(response => {
      return res.json(responseHelper.withSuccess(true));
    }).catch(err => {
      return res.json(responseHelper.withFailure(false))
    })
  }
}
