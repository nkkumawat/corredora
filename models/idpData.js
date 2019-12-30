module.exports = function(sequelize, DataTypes) {
	var idpData = sequelize.define('idp_data', {
		id: { 
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sso_login_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sso_logout_url: {
      type: DataTypes.STRING, //path 
      allowNull: true
    },
    certificates: {
      type: DataTypes.TEXT, //path comma seprated path
      allowNull: true
		},
    force_authn: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    sign_get_request: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    allow_unencrypted_assertion: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
	}, {
		timestamp: true
	});

	idpData.associate = function(models) {
    idpData.belongsTo(models.group, {foreignKey: 'group_id'});
    idpData.belongsTo(models.sp_data, { foreignKey: 'group_id', targetKey: 'group_id' })
    idpData.hasMany(models.mapper, { foreignKey: 'group_id', targetKey: 'group_id' })
	}  
	return idpData;
};