const express = require('express');
const router = express.Router();

const { authController } = require('../controllers');

// Current path: /auth
router.get('/', (req, res) => {
    res.redirect('auth/login');
});
router.get('/login', authController.loginView);
router.post('/login', authController.login);
router.get('/change-password', authController.changePasswordView);
router.post(
    '/change-password',
    authController.changePassword,
    authController.logout
);
router.get('/logout', authController.logout);

module.exports = router;
