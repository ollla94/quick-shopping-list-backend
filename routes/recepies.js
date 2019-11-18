const express = require('express');
const { body } = require('express-validator');

const recepiesController = require('../controllers/recepies');

const router = express.Router();

router.get('/recepies', recepiesController.getRecepies);
router.get('/recepie/:id', recepiesController.getRecepie);

router.post('/recepie',
    [
        body('recepieName')
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Name must be between 2 - 50 letters long')
    ],
    recepiesController.postRecepie);

router.put('/recepie/:id', [
    body('recepieName')
        .trim()
        .isString()
        .isLength({ min: 10, max: 50 })
        .withMessage('Name must be between 2 - 50 letters long')
], recepiesController.editeRecepie);

router.delete('/recepie/:id', recepiesController.deleteRecepie);

module.exports = router;
