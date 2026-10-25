const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('assignment55-db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

module.exports = sequelize;
