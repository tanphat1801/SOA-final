const express = require('express');
const router = express.Router();

const { authController } = require('../controllers');

// Current path: /auth
router.post('/login', authController.login);
router.post(
    '/change-password',
    authController.changePassword,
    authController.logout
);
router.get('/logout', authController.logout);

module.exports = router;
