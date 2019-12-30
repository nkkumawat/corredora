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
        logger.info(decoded)
        if(decoded.email != null) {
          req.currentUser = decoded;
          logger.info(`Session value: ${JSON.stringify(decoded)}`)
          if(url === "/admin/login" || url === "/admin/signup"){
            return res.redirect("/admin/dashboard")
          } else {
            next();
          }
        } else {
          res.clearCookie(constants.APP_NAME);
          return res.redirect('/admin/logout');
        }
      }).catch((err) => {
        logger.error(err)
        res.clearCookie(constants.APP_NAME);
        return res.redirect('/admin/login');
      })
    } else {
      console.log(url)
      if(url == "/admin/login" || url == "/admin/signup"){
        console.log("============")
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
      logger.log(`${credentials.name} is accessing APIS: trying`);
      adminUserService.getUserForBasicAuth({email: credentials.name}).then(user => {
      valid = compare(credentials.name, user.email) && valid
      valid = compare(credentials.pass, user.user_token) && valid
      if(valid){
        req.basicAuth = credentials;
        logger.info(`${user.email} is accessing APIS: success`);
        next();
      } else {
        logger.error(`${user.email} is accessing APIS: failure`);
        return res.sendStatus(401);
      }
      }).catch(err => {
        logger.error(`${credentials.name} is accessing APIS: failure`);
        logger.error(err)
        return res.sendStatus(401);
      })
    } else {
      logger.error(`No credentails while accessing APIS`);
      return res.sendStatus(401);
    }
  }
}
