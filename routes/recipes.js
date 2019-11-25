const express = require('express');
const { body } = require('express-validator');

const recipesController = require('../controllers/recipes');

const router = express.Router();

router.get('/recipes', recipesController.getRecipes);
router.get('/recipe/:id', recipesController.getRecipe);

router.post('/recipe',
    [
        body('recipeName')
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Name must be between 2 - 50 letters long')
    ],
    recipesController.postRecipe);

router.put('/recipe/:id', [
    body('recipeName')
        .trim()
        .isString()
        .isLength({ min: 10, max: 50 })
        .withMessage('Name must be between 2 - 50 letters long')
], recipesController.editeRecipe);

router.delete('/recipe/:id', recipesController.deleteRecipe);

module.exports = router;
