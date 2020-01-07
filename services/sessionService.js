const constants = require("../config/constants");
const models = require('../models');
const logger = require('../utils/logger');

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
      models.session.findOne({
        where: params,
        include: [{model: models.user}],
        raw: true
      }).then(session => {
        if(session){
          resolve(session)
        } else {
          reject(constants.NOT_PRESENT.SESSION)
        }
      }).catch(err => {
        logger.error(err);
        reject(err)
      })
    })
  },
  createSession: (params) => {
    return new Promise((resolve, reject) => {
      if(params.group_id == null || params.group_id == 'undefined') {
        reject(constants.MISSING_PARAMS.GROUP_ID)
      }
      models.session.findOne({
        where: {user_id: params.user_id}
      }).then(session => {
        if(session){
          session.update(params).then(session => {
            resolve(session)
          }).catch(err => {
            logger.error(err);
            reject(err)
          })
        } else {
          models.session.create(params).then(session => {
            resolve(session)
          }).catch(err => {
            logger.error(err);
            reject(err)
          })
        }
      }).catch(err => {
        logger.error(err);
        reject(err)
      })
    })
  },
  deleteSession: (params) => {
    return new Promise((resolve, reject) => {
      if( params.group_id == null || params.id == null) {
        reject(constants.MISSING_PARAMS.GROUP_ID);
      }
      models.session.destroy({
        where: params
      }).then(session => {
        if(session) {
          resolve(session)
        } else {
          reject(constants.NOT_PRESENT.SESSION)
        }
      }).catch(err => {
        reject(err)
      })
    })
  }
}