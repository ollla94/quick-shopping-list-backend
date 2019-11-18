const ShoppingList = require('../models/shoppingList');
const ListIngredient = require('../models/listIngredient');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.getShoppingList = (req, res, next) => {
    ListIngredient.findAll()
        .then(listIngredient => {
            if (!listIngredient) {
                const error = new Error('could not find shopping list');
                error.statusCode(404);
                throw error;
            }
            res.status(200)
                .json({
                    message: 'Fetched posts successfully.',
                    listIngredient: listIngredient
                });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.postShoppingList = (req, res, next) => {
    const ingredients = req.body;

    if (!ingredients) {
        const error = new Error('shopping list creation failed');
        error.statusCode = 404;
        throw error;
    }

    ingredients.map((ingredient) => {
        ListIngredient.findOrCreate({
            where: {
                [Op.and]: { name: ingredient.name, unit: ingredient.unit }
            },
            defaults: { quantity: ingredient.quantity, name: ingredient.name, unit: ingredient.unit }
        }).then(([listIngredient, created]) => {
            if (!created) {
                listIngredient.quantity = Number(listIngredient.quantity) + Number(ingredient.quantity)
                return listIngredient.save();
            }
        })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
    });
    return res.status(200).json({ message: 'sucsses' })
};

exports.deleteShoppingList = (req, res, next) => {
    const listId = req.params.id;

    ShoppingList.findOne({
        where: {
            id: listId
        }, include: [ListIngredient]
    }).then(shoppingList => {
        if (!shoppingList) {
            const error = new Error('could not find shopping list');
            error.statusCode = 404;
            throw error;
        }
        ShoppingList.destroy({
            where: {
                id: listId
            }
        });
        console.log('usunieto');
        res.
            status(200).
            json({ message: 'sucssesfully deleted' })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.editeShoppingList = (req, res, next) => {
    const listId = req.params.id;
    const ingredients = req.body.ingredients;

    ShoppingList.findOne({
        where: {
            id: listId
        }, include: [ListIngredient]
    }).then(shoppingList => {
        if (!shoppingList) {
            const error = new Error('could not find shopping list');
            error.statusCode = 404;
            throw error;
        }
        recepie.listIngredients = ingredients;
        res.
            status(200).
            json({ message: 'sucsses', shoppingList: shoppingList });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};
