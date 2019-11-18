const express = require('express');
const { body } = require('express-validator');

const shoppingListController = require('../controllers/shoppingList');

const router = express.Router();

router.get('/shopping-list', shoppingListController.getShoppingList);

router.post('/shopping-list', [
    body('name')
        .trim()
        .isAlpha()
        .isLength({ min: 10, max: 25 })
        .withMessage('Name must be between 2 - 25 letters long'),
    body('unit')
        .trim()
        .isAlpha()
        .isLength({ min: 10, max: 25 })
        .withMessage('Unit must be between 2 - 25 letters long'),
    body('quantity')
        .trim()
        .isNumeric()
        .withMessage('Quantity must be a number')
], shoppingListController.postShoppingList);

router.put('/shopping-list/:id', [
    body('name')
        .trim()
        .isAlpha()
        .isLength({ min: 10, max: 25 })
        .withMessage('Name must be between 2 - 25 letters long'),
    body('unit')
        .trim()
        .isAlpha()
        .isLength({ min: 10, max: 25 })
        .withMessage('Unit must be between 2 - 25 letters long'),
    body('quantity')
        .trim()
        .isNumeric()
        .withMessage('Quantity must be a number')
], shoppingListController.editeShoppingList);

router.delete('/shopping-list/:id', shoppingListController.deleteShoppingList);

module.exports = router;
