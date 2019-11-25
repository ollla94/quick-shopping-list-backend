const Sequelize = require('sequelize');

const sequelize = require('../database');

const ListIngredient = sequelize.define('listIngredient', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    orderId: {
        type: Sequelize.INTEGER
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    quantity: {
        type: Sequelize.STRING,
        allowNull: false
    },
    unit: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = ListIngredient;
