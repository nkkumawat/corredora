var jwt = require('jsonwebtoken');
const env = process.env.NODE_ENV || 'development';
var constants = require('../config/constants')

module.exports = {
	getToken: function(data) {
		return new Promise((resolve, reject) => {
			jwt.sign(data, constants.SERVER_SUPER_SECRET, function(err, token) {
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
			jwt.verify(token, constants.SERVER_SUPER_SECRET, function(err, token) {      
	      if(err){
					console.log(err);
		  		reject("Something Went Wrong")
			  } else {
			  	resolve(token)
			  }
	    })
		})
	}
}