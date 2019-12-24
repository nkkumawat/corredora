var adminUserService = require('../services/admin/adminUserService');
var groupService = require('../services/groupService');
var tokenHelper = require('../helpers/tokenHelper');
var constants = require("../config/constants");
var resultHelper = require("../helpers/responseHelper");

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
      tokenHelper.getToken(tok).then((token) => {
        var maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        res.cookie(constants.APP_NAME, token, { maxAge: maxAge, httpOnly: true });
        return res.redirect("/")
      }).catch((err) => {
        return res.render('error', {error: err})
      })
    }).catch(err => {
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
    return res.render("admin/dashboard", resultHelper.withSuccess(data) )
  },
  renderCreateGroup: (req, res, next) => {
    var data = {
      page: "createGroup"
    }
    return res.render("admin/dashboard", resultHelper.withSuccess(data) )
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
  renderGroups: (req, res, next) => {
    groupService.getAllGroups().then(groups => {
      var data = {
        page: "allGroups",
        groups: groups
      }
      return res.render('admin/dashboard', resultHelper.withSuccess(data))
    }).catch(err => {
      return res.render("error", {error: err})
    })
  },
  renderIdentityProvider: (req, res, next) => {
    var data = {
      page: "createIdentityProvider"
    }
    groupService.getAllGroups().then(groups => {
      data['groups'] = groups;
      return res.render('admin/dashboard', resultHelper.withSuccess(data))
    }).catch(err => {
      return res.render("error", {error: err})
    })
  }
}
