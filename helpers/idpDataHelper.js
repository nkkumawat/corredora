var idpDataService = require('../services/idpDataService');
var groupService = require('../services/groupService');
var fs = require('fs');
module.exports = {
  init: (realmName) => {
    return new Promise((resolve , reject) => {
      var idpConfig = {};
      groupService.getGroupRealm({group_name: realmName}).then(groupId => {
        if(groupId){
          idpDataService.getIdpData({group_id: groupId}).then(idpData => {
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
          reject({error: err})
        }
      }).catch(err => {
        reject({error: err})
      });
    })
  }
}