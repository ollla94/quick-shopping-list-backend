const Sequelize = require('sequelize');

const sequelize = require('../database');

const ShoppingList = sequelize.define('shoppingList', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    listName: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

module.exports = ShoppingList;

