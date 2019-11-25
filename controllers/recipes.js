const path = require('path');

const Recipe = require('../models/recipe');
const Ingredient = require('../models/ingredient');
const file = require('../file');

const config = require('../config.json');

const { validationResult } = require('express-validator');

exports.getRecipes = (req, res, next) => {

    Recipe.findAll({ include: [Ingredient] })
        .then(recipes => {
            if (!recipes) {
                const error = new Error('could not find recipes');
                error.statusCode(404);
                throw error;
            }
            res
                .status(200)
                .json({
                    message: 'Fetched posts successfully.',
                    recipes: recipes
                });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getRecipe = (req, res, next) => {
    const recipeId = req.params.id;

    Recipe.findOne({
        where: {
            id: recipeId
        }, include: [Ingredient]
    }).then(recipe => {
        if (!recipe) {
            const error = new Error('could not find recipe');
            error.statusCode = 404;
            throw error;
        }
        res
            .status(200)
            .json({
                message: 'Fetched posts successfully.',
                recipe: recipe
            });
    }).catch(error => {
        if (!error.statusCode) {
            err.statusCode = 500;
        }
        next(error);
    });
};

exports.postRecipe = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    const image = req.file;
    const recipeName = req.body.recipeName;
    const ingredients = req.body.ingredients;

    if (!image) {
        const error = new Error('no image uploaded or image has wrong format');
        error.statusCode = 404;
        throw error;
    }
    const imageUrl = path.basename(image.path);

    Recipe.create({
        recipeName: recipeName,
        imageUrl: imageUrl
    }).then(recipe => {
        if (!recipe) {
            const error = new Error('recipe creation failed');
            error.statusCode = 404;
            throw error;
        }
        if (!ingredients) {
            const error = new Error('No ingredients added.');
            error.statusCode = 400;
            throw error;
        }
        ingredients.map((ingredient) => {
            const JSONingredient = JSON.parse(ingredient);
            recipe.createIngredient({
                name: JSONingredient.name,
                quantity: JSONingredient.quantity,
                unit: JSONingredient.unit
            })
        });
    }).then(recipe => {
        res.status(200).json({ message: 'sucsses', recipe: recipe })
    }).catch(error => {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    });
};

exports.deleteRecipe = (req, res, next) => {
    const recipeId = req.params.id;

    Recipe.findOne({
        where: {
            id: recipeId
        }, include: [Ingredient]
    }).then(recipe => {
        if (!recipe) {
            const error = new Error('could not find recipe');
            error.statusCode = 404;
            throw error;
        }
        file.deleteFile(config.images_dir + recipe.imageUrl);
        Recipe.destroy({
            where: {
                id: recipeId
            }
        });
        res.
            status(200).
            json({ message: 'sucssesfully deleted' })
    }).catch(error => {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    });
};

exports.editeRecipe = (req, res, next) => {
    const recipeId = req.params.id;
    const image = req.file;
    const recipeName = req.body.recipeName;
    const ingredients = req.body.ingredients;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }

    Recipe.findOne({
        where: {
            id: recipeId
        }, include: [Ingredient]
    }).then(recipe => {
        if (!recipe) {
            const error = new Error('could not find recipe');
            error.statusCode = 404;
            throw error;
        }
        recipe.recipeName = recipeName;

        Ingredient.destroy({
            where: {
                recipeId: recipeId
            }
        });

        ingredients.map((ingredient) => {
            const JSONingredient = JSON.parse(ingredient);
            recipe.createIngredient({
                name: JSONingredient.name,
                quantity: JSONingredient.quantity,
                unit: JSONingredient.unit
            })
        });

        if (image) {
            recipe.imageUrl = path.basename(image.path);
        }
        return recipe.save();
    }).then(result => {
        res.status(200).json({ message: 'Recipe updated!', post: result });
    }).catch(error => {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    });
};
