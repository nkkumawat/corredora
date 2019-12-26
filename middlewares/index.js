var constants = require("../config/constants");
var tokenHelper = require('../helpers/tokenHelper');
var logger = require('../utils/logger');
var apiAuth = require('basic-auth');
var compare = require('tsscmp');
var responseHelper = require('../helpers/responseHelper');
var adminUserService = require('../services/admin/adminUserService');

module.exports = {
  varifyRequest: (req, res, next) => {
    const token = req.cookies[constants.APP_NAME];
    const url = req.originalUrl;
    if(token != null) {
      tokenHelper.decodeToken(token).then((decoded) => {
        if(decoded.email != null) {
          req.currentUser = decoded;
          logger.info(decoded)
          if(url === "/admin/login" || url === "/admin/signup"){
            return res.redirect("/admin/dashboard")
          } else {
            next();
          }
        } else {
          return res.redirect('/admin/logout');
        }
      }).catch((err) => {
        console.log(err)
        return res.redirect('/admin/login');
      })
    } else {
      console.log(url)
      if(url == "/admin/login" || url == "/admin/signup"){
        next();
      } else {
        return res.redirect('/admin/login');
      }
    }
  },
  apiAuth: (req, res, next) => {
    var credentials = apiAuth(req);
    if(credentials){
      var valid = true;
      adminUserService.getUserForBasicAuth({email: credentials.name}).then(user => {
      valid = compare(credentials.name, user.email) && valid
      valid = compare(credentials.pass, user.user_token) && valid
      console.log("valid", valid)
      if(valid){
        req.basicAuth = credentials;
        next();
      } else {
        return res.sendStatus(401);
      }
      }).catch(err => {
        return res.sendStatus(401);
      })
    } else {
      return res.sendStatus(401);
    }
  }
}
