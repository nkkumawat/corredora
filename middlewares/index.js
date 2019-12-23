var constants = require("../config/constants");
var tokenHelper = require('../helpers/tokenHelper');

module.exports = {
  varifyRequest: (req, res, next) => {
    const token = req.cookies[constants.APP_NAME];
    const url = req.originalUrl;
    if(token != null) {
      tokenHelper.decodeToken(token).then((decoded) => {
        if(decoded.email != null) {
          req.currentUser = decoded;;
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
  }
}
