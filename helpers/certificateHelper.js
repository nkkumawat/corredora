var pem = require('pem');
var constants = require("../config/constants");

module.exports = {
  getCertificates: () => {
    return new Promise((resolve, reject) => {
      pem.createCertificate({ 
        days: constants.CERTIFICATE_LIFE,
        selfSigned: true 
      }, function (err, keys) {
        if (err) {
          reject(null);
        } else {
          resolve(keys); // key keys.serviceKey, cert: keys.certificate
        }
      })
    })
  }
}