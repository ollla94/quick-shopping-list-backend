const express = require('express');
const { body } = require('express-validator');

const shoppingListController = require('../controllers/shoppingList');

const router = express.Router();

router.get('/shopping-list/:id', shoppingListController.getShoppingList);

router.post('/shopping-list/:id', shoppingListController.postShoppingList);

router.put('/shopping-list/:id', shoppingListController.editShoppingList);

router.delete('/shopping-list/:id', shoppingListController.deleteShoppingListIngredient);

module.exports = router;
