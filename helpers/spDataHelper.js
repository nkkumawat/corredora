var spDataService = require('../services/spDataService');
var groupService = require('../services/groupService');
var fs = require('fs');
module.exports = {
   init: (realmName) => {
     return new Promise((resolve , reject) => {
      var spConfig = {};
      groupService.getGroupRealm({group_name: realmName}).then(groupId => {
        if(groupId){
          spDataService.getSpData({group_id: groupId}).then(spData => {
            if(spData.entity_id) { spConfig['entity_id'] = spData.entity_id }
            if(spData.private_key) { spConfig['private_key'] = "-----BEGIN CERTIFICATE-----\n" + spData.private_key +"\n-----END CERTIFICATE-----" }
            if(spData.certificate) { spConfig['certificate'] = "-----BEGIN CERTIFICATE-----\n" + spData.certificate +"\n-----END CERTIFICATE-----" }
            if(spData.assert_endpoint) { spConfig['assert_endpoint'] = spData.assert_endpoint }
            if(spData.audience) { spConfig['audience'] = spData.audience }
            if(spData.notbefore_skew) { spConfig['notbefore_skew'] = spData.notbefore_skew }
            if(spData.force_authn) { spConfig['force_authn'] = spData.force_authn }
            if(spData.nameid_format) { spConfig['nameid_format'] = spData.nameid_format }
            if(spData.sign_get_request) { spConfig['sign_get_request'] = spData.sign_get_request }
            if(spData.allow_unencrypted_assertion) { spConfig['allow_unencrypted_assertion'] = spData.allow_unencrypted_assertion }
            resolve(spConfig);
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