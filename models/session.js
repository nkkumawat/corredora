module.exports = function(sequelize, DataTypes) {
	var Session = sequelize.define('session', {
		id: { 
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
    session_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
		},
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
	}, {
		timestamp: true
	});

	Session.associate = function(models) {
    Session.belongsTo(models.user, {foreignKey: 'user_id', onDelete: 'cascade'});
    Session.belongsTo(models.group, {foreignKey: 'group_id', onDelete: 'cascade'});
	}  
	return Session;
};