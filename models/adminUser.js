module.exports = function(sequelize, DataTypes) {
	var AdminUsers = sequelize.define('admin_users', {
		id: { 
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,  
      allowNull: true
    },
    access: {
      type: DataTypes.INTEGER, // 1 view only, 2 edit 
      allowNull: true
    },
    user_token: {
      type: DataTypes.STRING, // for admin access
      allowNull: true
    }
	}, {
		timestamp: true
	});

	AdminUsers.associate = function(models) {

	}  
	return AdminUsers;
};