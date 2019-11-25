const Sequelize = require('sequelize');

const sequelize = require('../database');

const Recipe = sequelize.define('recipe', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    recipeName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Recipe;
