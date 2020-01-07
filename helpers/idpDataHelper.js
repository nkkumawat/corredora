const idpDataService = require('../services/idpDataService');
const groupService = require('../services/groupService');
module.exports = {
  init: (realmName) => {
    return new Promise((resolve , reject) => {
      var idpConfig = {};
      groupService.getGroupByName({group_name: realmName}).then(group => {
        if(group){
          idpDataService.getIdpData({group_id: group.id}).then(idpData => {
            if(idpData.sso_login_url) { idpConfig['sso_login_url'] = idpData.sso_login_url }
            if(idpData.sso_logout_url) { idpConfig['sso_logout_url'] = idpData.sso_logout_url }      
            if(idpData.force_authn) { idpConfig['force_authn'] = idpData.force_authn }
            if(idpData.sign_get_request) { idpConfig['sign_get_request'] = idpData.sign_get_request }
            if(idpData.allow_unencrypted_assertion) { idpConfig['allow_unencrypted_assertion'] = idpData.allow_unencrypted_assertion }
            if(idpData.certificates) { idpConfig['certificates'] = [idpData.certificates] }
            resolve(idpConfig);
          }).catch(err => {
            reject({error: err})
          })
        } else {
          reject({error: "err"})
        }
      }).catch(err => {
        reject({error: err})
      });
    })
  }
}