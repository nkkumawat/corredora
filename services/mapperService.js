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
      }).then(idpData => {
         resolve(idpData);
      }).catch(err => {
        reject(constants.DEFAULT_ERROR);
      })
    })
  }
}