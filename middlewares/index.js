var constants = require("../config/constants");
var tokenHelper = require('../helpers/tokenHelper');
var logger = require('../utils/logger');
var apiAuth = require('basic-auth');
var compare = require('tsscmp');
var responseHelper = require('../helpers/responseHelper');
var cli = require('node-cli-tool');
var adminUserService = require('../services/admin/adminUserService');

module.exports = {
  varifyRequest: (req, res, next) => {
    const token = req.cookies[constants.APP_NAME];
    const url = req.originalUrl;
    if(token != null) {
      tokenHelper.decodeToken(token).then((decoded) => {
        logger.info(cli.fgGreen(`Session value: ${JSON.stringify(decoded)}`))
        if(decoded.user && decoded.user.email != null) {
          req.currentUser = decoded.user;          
          if(url === "/admin/login" || url === "/admin/signup"){
            return res.redirect("/admin/dashboard")
          } else {
            next();
          }
        } else {
          logger.error(cli.fgRed(`Wrong Session. Logging OUT`));
          res.clearCookie(constants.APP_NAME);
          return res.redirect('/admin/logout');
        }
      }).catch((err) => {
        logger.error(cli.fgRed(err))
        res.clearCookie(constants.APP_NAME);
        return res.redirect('/admin/login');
      })
    } else {
      logger.info(cli.fgGreen(`User is not logged in`))
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
      logger.log(cli.fgGreen(`${credentials.name} is accessing APIS: trying`));
      adminUserService.getUserForBasicAuth({email: credentials.name}).then(user => {
      valid = compare(credentials.name, user.email) && valid
      valid = compare(credentials.pass, user.user_token) && valid
      if(valid){
        req.basicAuth = credentials;
        logger.info(cli.fgGreen(`${user.email} is accessing APIS: success`));
        next();
      } else {
        logger.error(cli.fgRed(`${user.email} is accessing APIS: failure`));
        return res.sendStatus(401);
      }
      }).catch(err => {
        logger.error(cli.fgRed(`${credentials.name} is accessing APIS: failure`));
        logger.error(err)
        return res.sendStatus(401);
      })
    } else {
      logger.error(cli.fgRed(`No credentails while accessing APIS`));
      return res.sendStatus(401);
    }
  }
}
