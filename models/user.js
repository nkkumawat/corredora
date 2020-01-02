module.exports = function(sequelize, DataTypes) {
	var User = sequelize.define('user', {
		id: { 
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    name_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true
    },
    attributes: {
      type: DataTypes.TEXT, //json string 
      allowNull: true
    },
    saml_attributes: {
      type: DataTypes.TEXT, //json string 
      allowNull: true
    }
	}, {
		timestamp: true
	});

	User.associate = function(models) {
    User.belongsTo(models.group, {foreignKey: 'group_id'});
    User.hasMany(models.session, {foreignKey: 'user_id', onDelete: 'cascade'});
	}  
	return User;
};