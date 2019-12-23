module.exports = function(sequelize, DataTypes) {
	var spData = sequelize.define('sp_data', {
		id: { 
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    entity_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    private_key: {
      type: DataTypes.TEXT, //path 
      allowNull: true
    },
    certificate: {
      type: DataTypes.TEXT, //path
      allowNull: true
		},
		assert_endpoint: {
	    type: DataTypes.STRING, 
			allowNull: true
    },
    alt_private_keys: {
      type: DataTypes.TEXT, //path
      allowNull: true
    },
    alt_certs: {
      type: DataTypes.TEXT, //path
      allowNull: true
    },
    audience: {
      type: DataTypes.STRING,
      allowNull: true
    },
    notbefore_skew: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    force_authn: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    auth_context: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nameid_format: {
      type: DataTypes.STRING,
      allowNull: true
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

	spData.associate = function(models) {
    spData.belongsTo(models.group, {foreignKey: 'group_id'});
	}  
	return spData;
};