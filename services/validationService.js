const models = require('../models');
module.exports = {
	doesSuchUserExist: function(param) {
		return new Promise((resolve, reject) => {
			let condition = {
        email: param.email,
        group_id: param.group_id
      };
      console.log(condition, "=========================")
			models.user.findOne({
				where: condition
			}).then((user) => {
		    if (user) {
		    	resolve(user);
		    } else {
		    	resolve(false);
		    }
			}).catch((err) => {
				console.log(err);
			  reject(err);
			});
		});
	}
};