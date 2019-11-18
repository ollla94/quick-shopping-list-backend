const Recepie = require('../models/recepie');
const Ingredient = require('../models/ingredient');
const file = require('../file');

const { validationResult } = require('express-validator');

exports.getRecepies = (req, res, next) => {

    Recepie.findAll({ include: [Ingredient] })
        .then(recepies => {
            if (!recepies) {
                const error = new Error('could not find recepies');
                error.statusCode(404);
                throw error;
            }
            res
                .status(200)
                .json({
                    message: 'Fetched posts successfully.',
                    recepies: recepies
                });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getRecepie = (req, res, next) => {
    const recepieId = req.params.id;

    Recepie.findOne({
        where: {
            id: recepieId
        }, include: [Ingredient]
    }).then(recepie => {
        if (!recepie) {
            const error = new Error('could not find recepie');
            error.statusCode = 404;
            throw error;
        }
        res
            .status(200)
            .json({
                message: 'Fetched posts successfully.',
                recepie: recepie
            });
    }).catch(error => {
        if (!error.statusCode) {
            err.statusCode = 500;
        }
        next(error);
    });
};

exports.postRecepie = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    const image = req.file;
    const recepieName = req.body.recepieName;
    const ingredients = req.body.ingredients;

    if (!image) {
        const error = new Error('no image uploaded or image has wrong format');
        error.statusCode = 404;
        throw error;
    }
    const imageUrl = image.path;

    Recepie.create({
        recepieName: recepieName,
        imageUrl: imageUrl
    }).then(recepie => {
        if (!recepie) {
            const error = new Error('recepie creation failed');
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
            recepie.createIngredient({
                name: JSONingredient.name,
                quantity: JSONingredient.quantity,
                unit: JSONingredient.unit
            })
        });
    }).then(recepie => {
        res.status(200).json({ message: 'sucsses', recepie: recepie })
    }).catch(error => {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    });
};

exports.deleteRecepie = (req, res, next) => {
    const recepieId = req.params.id;

    Recepie.findOne({
        where: {
            id: recepieId
        }, include: [Ingredient]
    }).then(recepie => {
        if (!recepie) {
            const error = new Error('could not find recepie');
            error.statusCode = 404;
            throw error;
        }
        file.deleteFile(recepie.imageUrl);
        Recepie.destroy({
            where: {
                id: recepieId
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

exports.editeRecepie = (req, res, next) => {
    const recepieId = req.params.id;
    const image = req.file;
    const recepieName = req.body.recepieName;
    const ingredients = req.body.ingredients;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }

    Recepie.findOne({
        where: {
            id: recepieId
        }, include: [Ingredient]
    }).then(recepie => {
        if (!recepie) {
            const error = new Error('could not find recepie');
            error.statusCode = 404;
            throw error;
        }
        recepie.recepieName = recepieName;

        Ingredient.destroy({
            where: {
                recepieId: recepieId
            }
        });

        ingredients.map((ingredient) => {
            const JSONingredient = JSON.parse(ingredient);
            recepie.createIngredient({
                name: JSONingredient.name,
                quantity: JSONingredient.quantity,
                unit: JSONingredient.unit
            })
        });

        if (image) {
            recepie.imageUrl = image.path;
        }
        return recepie.save();
    }).then(result => {
        res.status(200).json({ message: 'Recepie updated!', post: result });
    }).catch(error => {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    });
};
