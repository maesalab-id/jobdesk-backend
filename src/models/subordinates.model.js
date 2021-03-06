// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const subordinates = sequelizeClient.define('subordinates', {
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  subordinates.associate = function (models) {
    subordinates.belongsTo(models.users, { onDelete: 'cascade', as: 'superior' });
    subordinates.belongsTo(models.users, { onDelete: 'cascade', as: 'subordinate' });
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return subordinates;
};
