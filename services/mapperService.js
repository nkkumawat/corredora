var constants = require("../config/constants");
const models = require('../models');

module.exports = {
  getGroupMappers: (params) => {
    return new Promise((resolve, reject) => {
      if(params.group_id == null || params.group_id == 'undefined') {
        reject(constants.MISSING_PARAMS.GROUP_ID);
      }
      models.mapper.findAll({
        where: params,
        raw: true
      }).then(mapperData => {
         resolve(mapperData);
      }).catch(err => {
        reject(constants.DEFAULT_ERROR);
      })
    })
  },
  getMapper: (params) => {
    return new Promise((resolve, reject) => {
      if(params.id == null || params.id == 'undefined') {
        reject(constants.MISSING_PARAMS.MAPPER_ID);
      }
      models.mapper.findOne({
        where: params,
        raw: true
      }).then(mapperData => {
         resolve(mapperData);
      }).catch(err => {
        reject(constants.DEFAULT_ERROR);
      })
    })
  },
  deleteMapper: (params) => {
    return new Promise((resolve, reject) => {
      if(params.id == null || params.id == 'undefined') {
        reject(constants.MISSING_PARAMS.MAPPER_ID)
      }
      models.mapper.destroy({
        where: params
      }).then(mapper => {
        if(mapper){
          resolve(mapper)
        } else {
          reject(constants.NOT_PRESENT.MAPPER)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
  updateMapper: (params) => {
    return new Promise((resolve, reject) => {
      if(params.id == null || params.id == 'undefined') {
        reject(constants.MISSING_PARAMS.MAPPER_ID)
      }
      models.mapper.update(
        params.updateParams,
        { where: { id: params.id } }
      ).then( mapper => { 
        if(mapper && mapper[0]){
          resolve(mapper);
        } else {
          reject(constants.NOT_PRESENT.MAPPER)
        }
        resolve(mapper);
      }).catch(err => {
        reject(err)
      })
    })
  },
  createMapper: (params) => {
    return new Promise((resolve, reject) => {
      if(params.group_id == null || params.group_id == 'undefined') {
        reject(constants.MISSING_PARAMS.GROUP_ID)
      } else if (params.saml_attribute == null || params.saml_attribute == 'undefined') {
        reject(constants.MISSING_PARAMS.SAML_ATTR)
      } else if (params.user_attribute == null || params.user_attribute == 'undefined') {
        reject(constants.MISSING_PARAMS.User_ATTR)
      }
      models.mapper.findOne({
        where: {saml_attribute: params.saml_attribute},
        raw: true
      }).then(mapper => {
        if(mapper){
          reject("Mapper Already Exist")
        } else {
          models.mapper.create(params).then( mapper => { 
            resolve(mapper);
          }).catch(err => {
            reject(err)
          })
        }
      }).catch(err => {
        console.log(err)
        reject(err);
      })
    })
  },
}