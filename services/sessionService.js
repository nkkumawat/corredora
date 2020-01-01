var constants = require("../config/constants");
const models = require('../models');
var logger = require('../utils/logger');

module.exports = {
  getSessionByGroup: (params) => {
    return new Promise((resolve, reject) => {
      if(params.group_id == null || params.group_id == 'undefined') {
        reject(constants.MISSING_PARAMS.GROUP_ID)
      }
      models.session.findAll({
        where: params,
        include: [{model: models.user}]
      }).then(session => {
        if(session){
          resolve(session)
        } else {
          reject(null)
        }
      }).catch(err => {
        logger.error(err);
        reject(err)
      })
    })
  },  
  getSessionBySessionId: (params) => {
    return new Promise((resolve, reject) => {
      if(params.session_id == null || params.session_id == 'undefined') {
        reject(constants.MISSING_PARAMS.SESSION_ID)
      }
      models.session.findAll({
        where: params,
        include: [{model: models.user}]
      }).then(session => {
        if(session){
          resolve(session)
        } else {
          reject(null)
        }
      }).catch(err => {
        logger.error(err);
        reject(err)
      })
    })
  },
  createDession: (params) => {
    return new Promise((resolve, reject) => {
      if(params.group_id == null || params.group_id == 'undefined') {
        reject(constants.MISSING_PARAMS.GROUP_ID)
      }
      models.session.create(params).then(session => {
        resolve(session)
      }).catch(err => {
        logger.error(err);
        reject(err)
      })
    })
  }
}