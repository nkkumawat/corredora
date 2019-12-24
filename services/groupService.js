var constants = require("../config/constants");
const models = require('../models');

module.exports = {
  getGroupRealm: (params) => {
    return new Promise((resolve, reject) => {
      if(params.group_name == null || params.group_name == 'undefined') {
        reject(constants.MISSING_PARAMS.REALM_NAME)
      }
      models.group.findOne({
        where: params,
        raw: true
      }).then(group => {
        if(group){
          resolve(group.id)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
  getAllGroups: () => {
    return new Promise((resolve, reject) => {
      models.group.findAll().then(groups => {
        resolve(groups)
      }).catch(err => {
        reject(err)
      })
    })
  },
  createGroup: (params) => {
    return new Promise((resolve, reject) => {
      if(params.group_name == null || params.group_name == 'undefined') {
        reject(constants.MISSING_PARAMS.REALM_NAME)
      }
      models.group.findOne({
        where: {group_name: params.group_name},
        raw: true
      }).then(group => {
        if(group){
          reject("Group Already Exist")
        } else {
          models.group.create(params).then(group => { 
            resolve(group);
          }).catch(err => {
            reject(err)
          })
        }
      }).catch(err => {
        console.log(err)
        reject(err);
      })
    })
  }
}