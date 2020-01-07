const constants = require("../config/constants");
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
  getUsersByGroupId: (params) => {
    return new Promise((resolve, reject) => {
      if( params.group_id == null) {
        reject(constants.MISSING_PARAMS.GROUP_ID);
      }
      models.user.findAll({
        where: params,
        include: [{model: models.session}]
      }).then(user => {

          resolve(user);
      }).catch(err => {
        reject(err);
      })
    })
  },
  deleteUser: (params) => {
    return new Promise((resolve, reject) => {
      if( params.group_id == null || params.id == null) {
        reject(constants.MISSING_PARAMS.GROUP_ID);
      }
      models.user.destroy({
        where: params
      }).then(user => {
        if(user) {
          resolve(user)
        } else {
          reject(constants.NOT_PRESENT.USER)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
}