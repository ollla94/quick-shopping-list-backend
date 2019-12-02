const ShoppingList = require('../models/shoppingList');
const ListIngredient = require('../models/listIngredient');
const User = require('../models/user');

exports.getShoppingList = (req, res, next) => {
    const userId = req.params.userId;

    ShoppingList.findOne({
        where: {
            userId: userId
        }
    }).then(shoppingList => {
        if (!shoppingList) {
            const error = new Error('No shopping list created yet.');
            error.statusCode = 400;
            throw error;
        }
        ListIngredient.findAll({
            where: {
                shoppingListId: shoppingList.id
            },
            order: [['orderId', 'ASC']]
        }).then(listIngredient => {
            if (!listIngredient) {
                const error = new Error('Could not find shopping list.');
                error.statusCode = 400;
                throw error;
            }
            res.status(200).json({
                message: 'Fetched list successfully.',
                listIngredient: listIngredient,
                shoppingListId: shoppingList.id
            });
        })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }

        next(err);
    });
};

exports.deleteShoppingListIngredient = (req, res, next) => {
    const listId = req.params.id;
    const ingredientId = req.body.id;

    if (!ingredientId) {
        const error = new Error('Ingredient id not found.');
        error.statusCode = 400;
        throw error;
    }

    ListIngredient.findOne({
        where: {
            shoppingListId: listId,
            id: ingredientId
        }
    }).then(listIngredient => {
        if (!listIngredient) {
            const error = new Error('Could not find ingredient.');
            error.statusCode = 400;
            throw error;
        }

        return ListIngredient.destroy({
            where: {
                shoppingListId: listId,
                id: ingredientId
            }
        })
    }).then(() => {
        res.status(200).json({
            message: 'Deleted sucssesfully.'
        });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }

        next(err);
    });
};

exports.postShoppingList = (req, res, next) => {
    const ingredients = req.body.ingredients;
    const userId = req.params.userId;

    if (!ingredients) {
        const error = new Error('Shopping list creation failed.');
        error.statusCode = 400;
        throw error;
    }

    ShoppingList.findOrCreate({
        where: {
            userId: userId
        }, include: [ListIngredient]
    }).then(([shoppingList, created]) => {
        if (!created) {
            ListIngredient.max('orderId', {
                where: {
                    shoppingListId: shoppingList.id
                }
            }).then(order => {
                if (isNaN(order)) {
                    order = 0;
                }

                return Promise.all(ingredients.map(ingredient => {
                    const foundIngredient = shoppingList.listIngredients.find(listIngredient => (listIngredient.name === ingredient.name) && (listIngredient.unit === ingredient.unit));
                    if (foundIngredient) {
                        foundIngredient.quantity = Number(foundIngredient.quantity) + Number(ingredient.quantity);
                        foundIngredient.save();
                    } else {
                        order = order + 1;
                        shoppingList.createListIngredient({
                            orderId: order,
                            name: ingredient.name,
                            quantity: ingredient.quantity,
                            unit: ingredient.unit
                        })
                    }
                })).then(() => {
                    res.status(200).json({
                        message: 'Added sucssesfully.'
                    })
                })
            })
        } else {
            let order = 0;
            User.findOne({ where: { id: userId } }).then(user => {
                user.createShoppingList().then(shoppingList => {
                    return Promise.all(ingredients.map(ingredient => {
                        order = order + 1
                        shoppingList.createListIngredient({
                            orderId: order,
                            name: ingredient.name,
                            quantity: ingredient.quantity,
                            unit: ingredient.unit
                        })
                    }))
                })
            }).then(() => {
                res.status(200).json({
                    message: 'Added sucssesfully.'
                })
            })
        }
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }

        next(err);
    });
};

exports.editShoppingList = (req, res, next) => {
    const listId = req.params.id;
    const ingredients = req.body;

    if (!ingredients) {
        const error = new Error('Ingredients not found.');
        error.statusCode = 400;
        throw error;
    }

    const changeIngredients = (listIngredient, ingredient) => {
        if (ingredient.name) {
            listIngredient.name = ingredient.name;
        }
        if (ingredient.unit) {
            listIngredient.unit = ingredient.unit;
        }
        if (ingredient.quantity) {
            listIngredient.quantity = ingredient.quantity;
        }
        if (ingredient.orderId) {
            listIngredient.orderId = ingredient.orderId;
        }
        return listIngredient.save();
    }

    const asyncFindIngredient = async ingredient => {
        try {
            let listIngredient = await ListIngredient.findOne(
                {
                    where: {
                        shoppingListId: listId,
                        id: ingredient.id
                    }
                }
            )
            if (!listIngredient) {
                const error = new Error('Ingredient not found.');
                error.statusCode = 400;
                throw error;
            } else {
                return changeIngredients(listIngredient, ingredient)
            }
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }

            next(err);
        }
    }

    const mapIngredients = async () => {
        return Promise.all(ingredients.map(ingredient =>
            asyncFindIngredient(ingredient)))
    }

    mapIngredients().then(() => {
        res.status(200).json({
            message: 'Changed sucssesfully.'
        });
    })
};
