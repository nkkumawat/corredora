const adminUserService = require('../services/admin/adminUserService');
const groupService = require('../services/groupService');
const mapperService = require('../services/mapperService');
const tokenHelper = require('../helpers/tokenHelper');
const constants = require("../config/constants");
const responseHelper = require("../helpers/responseHelper");
const idpdataService = require("../services/IdpDataService");
const userService = require('../services/userService');
const sessionService = require('../services/sessionService');
const logger = require('../utils/logger');

module.exports = {
  renderLogin: (req, res, next) => {
    return res.render('admin/login');
  },
  logout: (req, res, next) => {
    res.clearCookie(constants.APP_NAME);
    return res.redirect('/admin/login');
  },
  renderSignUp: (req, res, next) => {
    return res.render('admin/signup');
  },
  verifyLogin: (req, res, next) => {
    params = req.body;
    adminUserService.getUser(params).then(user => {
      tokenHelper.getToken({user: user}).then((token) => {
        var maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        res.cookie(constants.APP_NAME, token, { maxAge: maxAge, httpOnly: true });
        return res.redirect("/admin/dashboard/groups");
      }).catch((err) => {
        logger.error(err);
        return res.render('error', {error: err});
      })
    }).catch(err => {
      logger.error(err);
      return res.redirect("/admin/login");
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
        return res.redirect("/");
      }).catch((err) => {
        return res.render('error', {error: err});
      })
    }).catch(err => {
      return res.render('error', {error: err});
    })
  },
  renderDashboard: (req, res, next) => {
    var data = {
      page: "dashboard",
      app_name: constants.APP_NAME
    }
    data['currentUser'] = req.currentUser;
    return res.render("admin/dashboard", responseHelper.withSuccess(data));
  },
  renderCreateGroup: (req, res, next) => {
    var data = {
      page: "createGroup",
      app_name: constants.APP_NAME
    }
    data['currentUser'] = req.currentUser;
    return res.render("admin/dashboard", responseHelper.withSuccess(data));
  },
  renderCreateMapper: (req, res, next) => {
    var data = {
      page: "createMapper",
      app_name: constants.APP_NAME
    }
    var group_id = req.params.group_id;
    groupService.getGroupById({id: group_id}).then(group => {
      data['group'] = group;
      data['currentUser'] = req.currentUser;
      return res.render("admin/dashboard", responseHelper.withSuccess(data));
    }).catch(err => {
      return res.render("error", {error: err});
    })
  },  
  renderGroup: (req, res, next) => {
    var group_id = req.params.id;
    var data = {
      page: "getGroup",
      app_name: constants.APP_NAME
    }
    groupService.getGroupById({id: group_id}).then(group => {
      data['group'] = group;
      data['currentUser'] = req.currentUser;
      data['host'] = constants.HOST_NAME;
      return res.render("admin/dashboard", responseHelper.withSuccess(data));
    }).catch(err => {
      logger.error(err);
      return res.render("error", {error: "Something went wrong"});
    })
  },
  createGroup: (req, res, next) => {
    groupService.createGroup(req.body).then(group => {
      if(group) {
        return res.redirect("/admin/dashboard/groups");
      } else {
        return res.render("error", {error: "Something went wrong"});
      }
    }).catch(err => {
      return res.render("error", {error: err});
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
        return res.render("error", {error: "Something went wrong"});
      }
    }).catch(err => {
      return res.render("error", {error: err});
    })
  },
  renderGroups: (req, res, next) => {
    groupService.getAllGroups().then(groups => {
      var data = {
        page: "allGroups",
        groups: groups,
        app_name: constants.APP_NAME
      }
      data['currentUser'] = req.currentUser;
      return res.render('admin/dashboard', responseHelper.withSuccess(data));
    }).catch(err => {
      return res.render("error", {error: err});
    })
  },
  renderCreateIdentityProvider: (req, res, next) => {
    var data = {
      page: "createIdentityProvider",
      nameIdPolicies: constants.NAMEID_POLICIES,
      app_name: constants.APP_NAME
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
      data['currentUser'] = req.currentUser;
      return res.render('admin/dashboard', responseHelper.withSuccess(data));
    }).catch(err => {
      return res.render("error", {error: err});
    })
  },
  renderIdentityProviders: (req, res, next) => {
    idpdataService.getAllIdpData().then(data => {
      
    }).catch(err => {
      return res.render("error", {error: err});
    })
  },
  renderMappers: (req, res, next) => {
    var group_id = req.params.group_id;
    groupService.getGroupById({id: group_id}).then(group => {
      mapperService.getGroupMappers({group_id: group_id}).then(mappers => {
        var data = {
          page: "groupMappers",
          group: group,
          mappers: mappers,
          app_name: constants.APP_NAME
        }
        data['currentUser'] = req.currentUser;
        return res.render('admin/dashboard', responseHelper.withSuccess(data));
      })
    }).catch(err => {
      return res.render("error", {error: err});
    })
  },
  renderIdentityProvider: (req, res, next) => {
    // var id = req.params.id;
    var group_id = req.params.group_id;
    idpdataService.getIdpDataWithGroups({group_id: group_id}).then(allData => {
      if(!allData){
        return res.render("error", {error: "No IDP Present"});
      }
      var group = allData.group
      group['idp_data.id'] = allData.id
      var data = {
        idpData: allData,
        page: "identityProvider",
        host: constants.HOST_NAME,
        group: group,
        app_name: constants.APP_NAME
      };
      logger.info(allData)
      mapperService.getGroupMappers({group_id: group_id}).then(mappers => {
        data['mappers'] = mappers;
        data['currentUser'] = req.currentUser;
        return res.render('admin/dashboard', responseHelper.withSuccess(data));
      }).catch(err => {
        return res.render("error", {error: err});
      })
    }).catch(err => {
      return res.render("error", {error: err});
    })
  },
  deleteGroup: (req, res, next) => {
    var group_id = req.params.id;
    logger.info(`deleting group ${group_id}`);
    if(!group_id){
      return res.render("error", {error: constants.MISSING_PARAMS.GROUP_ID});
    }
    groupService.deleteGroup({id: group_id}).then(gd => {
      return res.json(responseHelper.withSuccess(true));
    }).catch(err => {
      return res.json(responseHelper.withFailure(false));
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
      return res.json(responseHelper.withFailure(false));
    })
  },
  renderUsers: (req, res, next) => {
    var group_id = req.params.group_id;
    userService.getUsersByGroupId({group_id: group_id}).then(users => {
      var data = {
        page: "showUsers",
        users: users,
        app_name: constants.APP_NAME
      }
      console.log(users)
      groupService.getGroupById({id: group_id}).then(group => {
        data['group'] = group;
        data['currentUser'] = req.currentUser;
        return res.render('admin/dashboard', responseHelper.withSuccess(data));
      }).catch(err => {
        return res.render("error", {error: err});
      })
    }).catch(err => {
      return res.render("error", {error: err});
    })
  },
  renderSessions: (req, res, next) => {
    var group_id = req.params.group_id;
    sessionService.getSessionByGroup({group_id: group_id}).then(sessions => {
      var data = {
        page: "showSessions",
        sessions: sessions,
        app_name: constants.APP_NAME
      }
      console.log(sessions)
      groupService.getGroupById({id: group_id}).then(group => {
        data['group'] = group;
        data['currentUser'] = req.currentUser;
        return res.render('admin/dashboard', responseHelper.withSuccess(data));
      }).catch(err => {
        return res.render("error", {error: err});
      })
    }).catch(err => {
      return res.render("error", {error: err});
    })
  },
  deleteUser: (req, res, next) => {
    var group_id = req.params.group_id;
    var user_id = req.params.id;
    userService.deleteUser({group_id: group_id, id: user_id}).then(u => {
      return res.json(responseHelper.withSuccess(true));
    }).catch(err => {
      return res.json(responseHelper.withFailure(false));
    })
  },
  deleteSession: (req, res, next) => {
    var group_id = req.params.group_id;
    var session_id = req.params.id;
    sessionService.deleteSession({group_id: group_id, id: session_id}).then(session => {
      return res.json(responseHelper.withSuccess(true));
    }).catch(err => {
      return res.json(responseHelper.withFailure(false));
    })
  }
}
