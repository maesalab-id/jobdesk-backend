// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const users = sequelizeClient.define('users', {

    full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM(['administrator', 'employee']),
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false
    },
    avatar: {
      type: DataTypes.BLOB,
      allowNull: true
    }

  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      },
    }
  });

  // eslint-disable-next-line no-unused-vars
  users.associate = function (models) {
    users.belongsTo(models.departments, { onDelete: 'cascade' });
    users.hasMany(models.desks, { onDelete: 'cascade' });
    users.hasMany(models.subordinates, { onDelete: 'cascade', foreignKey: 'superior_id', as: 'subordinates' });
    users.hasMany(models.subordinates, { onDelete: 'cascade', foreignKey: 'subordinate_id', as: 'superiors' })
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
  };

  return users;
};
