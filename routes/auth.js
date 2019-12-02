const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.post('/login', authController.postLogin);
router.post('/singup', authController.postSingup);
router.post('/logout', authController.postLogout);

module.exports = router;
