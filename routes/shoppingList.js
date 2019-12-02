const express = require('express');

const shoppingListController = require('../controllers/shoppingList');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/shopping-list/:userId', isAuth, shoppingListController.getShoppingList);

router.post('/shopping-list/:userId', isAuth, shoppingListController.postShoppingList);

router.put('/shopping-list/:id', isAuth, shoppingListController.editShoppingList);

router.delete('/shopping-list/:id', isAuth, shoppingListController.deleteShoppingListIngredient);

module.exports = router;
