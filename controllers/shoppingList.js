const ShoppingList = require('../models/shoppingList');
const ListIngredient = require('../models/listIngredient');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.getShoppingList = (req, res, next) => {
    const listId = req.params.id;
    ListIngredient.findAll(
        {
            where: {
                shoppingListId: listId
            }
        }
    ).then(listIngredient => {
        if (!listIngredient) {
            const error = new Error('could not find shopping list');
            error.statusCode(404);
            throw error;
        }
        res.status(200)
            .json({
                message: 'Fetched list successfully.',
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

exports.deleteShoppingListIngredient = (req, res, next) => {
    const listId = req.params.id;
    const ingredientId = req.body.id;

    console.log(ingredientId);

    ListIngredient.findOne(
        {
            where: {
                shoppingListId: listId,
                id: ingredientId
            }
        }
    ).then(listIngredient => {
        if (!listIngredient) {
            const error = new Error('could not find ingredient');
            error.statusCode = 404;
            throw error;
        }
        ListIngredient.destroy({
            where: {
                shoppingListId: listId,
                id: ingredientId
            }
        })
        res.status(200)
            .json({
                message: 'Deleted sucssesfully.'
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
    const listId = req.params.id;
    const ingredients = req.body;

    if (!ingredients) {
        const error = new Error('shopping list creation failed');
        error.statusCode = 404;
        throw error;
    }

    ShoppingList.findOrCreate({
        where: {
            id: listId
        }, include: [ListIngredient]
    }).then(shoppingList => {
        ingredients.map(ingredient => {
            const foundIngredient = shoppingList[0].listIngredients.find(listIngredient => (listIngredient.name === ingredient.name) && (listIngredient.unit === ingredient.unit));
            if (foundIngredient) {
                foundIngredient.quantity = Number(foundIngredient.quantity) + Number(ingredient.quantity);
                foundIngredient.save();
            } else {
                shoppingList[0].createListIngredient(ingredient);
            }
        })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
    return res.status(200).json({ message: 'sucsses' })
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
