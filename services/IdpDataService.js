var constants = require("../config/constants");
const models = require('../models');
var logger = require('../utils/logger');

module.exports = {
  getIdpData: (params) => {
    return new Promise((resolve, reject) => {
      if(params.group_id == null || params.group_id == 'undefined') {
        reject(constants.MISSING_PARAMS.GROUP_ID);
      }
      models.idp_data.findOne({
        where: params,
        raw: true
      }).then(idpData => {
         resolve(idpData);
      }).catch(err => {
        logger.error(err)
        reject(constants.DEFAULT_ERROR);
      })
    })
  },  
  getIdpDataById: (params) => {
    return new Promise((resolve, reject) => {
      if(params.id == null || params.id == 'undefined') {
        reject(constants.MISSING_PARAMS.GROUP_ID);
      }
      models.idp_data.findOne({
        where: params,
        include: [{model: models.sp_data}]
      }).then(idpData => {
         resolve(idpData);
      }).catch(err => {
        logger.error(err)
        reject(constants.DEFAULT_ERROR);
      })
    })
  },
  createIdpData: (params) => {
    return new Promise((resolve, reject) => {
      if(params.group_id == null || params.group_id == 'undefined') {
        reject(constants.MISSING_PARAMS.GROUP_ID);
      }
      models.idp_data.findOne({
        where: {group_id : params.group_id}
      }).then(idpData => {
        if(idpData) {
          idpData.update(
            params
          ).then(idpData => { 
            logger.info('Idp iniitated data', JSON.stringify(idpData)," Done")
            resolve(idpData)
          }).catch(err => {
            logger.error(err)
            reject(err)
          })
        } else {
          models.idp_data.create(
            params
          ).then(idpData => {
            resolve(idpData);
          }).catch(err => {
            logger.error(err)
            reject(err)
          })
        }
      }).catch(err => {
        logger.error(err)
        reject(constants.DEFAULT_ERROR);
      })
    })
  },
  getAllIdpData: () => {
    return new Promise((resolve, reject) => {
      models.idp_data.findAll({
        include: [{
          model: models.sp_data
        }, {
          model: models.group
        }],
        raw: true
      }).then(idpData => {
        resolve(idpData);
      }).catch(err => {
        logger.error(err)
        reject(constants.DEFAULT_ERROR);
      })
    })
  },
  getIdpDataWithGroups: (params) => {
    return new Promise((resolve, reject) => {
      if(params.group_id == null || params.group_id == 'undefined') {
        reject(constants.MISSING_PARAMS.GROUP_ID);
      }
      models.idp_data.findOne({
        include: [{
          model: models.sp_data
        }, {
          model: models.group
        }],
        where: params,
        raw: true
      }).then(idpData => {
        resolve(idpData);
      }).catch(err => {
        logger.error(err)
        reject(constants.DEFAULT_ERROR);
      })
    })
  }
}