var constants = require("../config/constants");
const models = require('../models');
const validationService = require('./validationService');

module.exports = {
  createUser: (params) => {
    return new Promise((resolve, reject) => {
      if(params.username == null || params.group_id == null || params.email == null) {
        reject(constants.MISSING_PARAMS.GROUP_ID);
      }
      validationService.doesSuchUserExist({email: params.email, group_id: params.group_id}).then(usr => {
        if(!usr) {
          models.user.create(params).then(user => {
              resolve(user);
          }).catch(err => {
            reject(err);
          })
        } else {
          resolve(usr);
        }
      }).catch(err => {
        reject(err);
      })
    })
  },
}