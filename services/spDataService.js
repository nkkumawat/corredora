const constants = require("../config/constants");
const models = require('../models');
const logger = require("../utils/logger");


module.exports = {
  getSpData: (params) => {
    return new Promise((resolve, reject) => {
      if(params.group_id == null || params.group_id == 'undefined') {
        reject(constants.MISSING_PARAMS.GROUP_ID);
      }
      models.sp_data.findOne({
        where: params,
        raw: true
      }).then(spData => {
        resolve(spData);
      }).catch(err => {
        logger.error(err)
        reject(constants.DEFAULT_ERROR);
      })
    })
  },
  createSPData: (params) => {
    return new Promise((resolve, reject) => {
      if(params.group_id == null || params.group_id == 'undefined') {
        reject(constants.MISSING_PARAMS.GROUP_ID);
      }
      if(params.nameid_format == null || params.nameid_format == 'undefined') {
        reject("name id format is missing");
      }
      models.sp_data.findOne({
        where: {group_id : params.group_id}
      }).then(spData => {
        if(spData) {
          spData.update(
            params
          ).then(spData => { 
            logger.info('Sp iniitated data', JSON.stringify(spData)," Done")
            resolve(spData)
          }).catch(err => {
            logger.error(err)
            reject(err)
          })
        } else {
          models.sp_data.create(
            params
          ).then(spData => {
            resolve(spData);
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
  }
}