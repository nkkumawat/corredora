module.exports = function(sequelize, DataTypes) {
	var Group = sequelize.define('group', {
		id: { 
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
    group_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    succ_callback: {
      type: DataTypes.STRING,
      allowNull: true
		},
    fail_callback: {
      type: DataTypes.STRING,
      allowNull: true
    }
	}, {
		timestamp: true
	});

	Group.associate = function(models) {
    Group.hasMany(models.user, {foreignKey: 'group_id', onDelete: 'cascade'});
    Group.hasMany(models.idp_data, {foreignKey: 'group_id', onDelete: 'cascade'});
    Group.hasMany(models.sp_data, {foreignKey: 'group_id', onDelete: 'cascade'});
    Group.hasMany(models.mapper, {foreignKey: 'group_id', onDelete: 'cascade'});
	}  
	return Group;
};