var jwt = require('jsonwebtoken');
const env = process.env.NODE_ENV || 'development';
var constants = require('../config/constants')

module.exports = {
	getToken: function(data, exp = null) {
		return new Promise((resolve, reject) => {
			if(exp === null) {
				exp = 24 * 60 * 60
			}
			jwt.sign(data, constants.SERVER_SUPER_SECRET, { expiresIn: exp }, function(err, token) {
			  if(err){
					console.log(err);
			  	reject("Something Went Wrong")
			  } else {
			  	resolve(token)
			  }
			})
		})
	},
	decodeToken: function(token) {
		return new Promise((resolve, reject) => {
			try {
				jwt.verify(token, constants.SERVER_SUPER_SECRET, function(err, token) {      
					if(err){
						reject(constants.INVALID_TOKEN)
					} else {
						resolve(token)
					}
				})
			} catch(err) {
				resolve(err)
			}
		})
	}
}