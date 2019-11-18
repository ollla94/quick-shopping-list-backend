const Sequelize = require('sequelize');
const config = require('./config.json')

const sequelize = new Sequelize(config.db,
    config.user, config.password,
    { dialect: 'postgres', host: config.host });

module.exports = sequelize;
