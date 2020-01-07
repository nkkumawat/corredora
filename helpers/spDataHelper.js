const spDataService = require('../services/spDataService');
const groupService = require('../services/groupService');
const fs = require('fs');
module.exports = {
   init: (realmName) => {
     return new Promise((resolve , reject) => {
      var spConfig = {};
      groupService.getGroupByName({group_name: realmName}).then(group => {
        if(group){
          spDataService.getSpData({group_id: group.id}).then(spData => {
            if(spData.entity_id) { spConfig['entity_id'] = spData.entity_id }
            if(spData.private_key) { spConfig['private_key'] =  spData.private_key }
            if(spData.certificate) { spConfig['certificate'] =  spData.certificate  }
            if(spData.assert_endpoint) { spConfig['assert_endpoint'] = spData.assert_endpoint }
            if(spData.audience) { spConfig['audience'] = spData.audience }
            if(spData.notbefore_skew) { spConfig['notbefore_skew'] = spData.notbefore_skew }
            if(spData.force_authn) { spConfig['force_authn'] = spData.force_authn }
            if(spData.nameid_format) { spConfig['nameid_format'] = spData.nameid_format }
            if(spData.sign_get_request) { spConfig['sign_get_request'] = spData.sign_get_request }
            if(spData.allow_unencrypted_assertion) { spConfig['allow_unencrypted_assertion'] = spData.allow_unencrypted_assertion }
            console.log(spConfig)
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