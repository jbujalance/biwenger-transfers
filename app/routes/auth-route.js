const router = require('express').Router();
const authController = require('../controllers/auth-controller');

// Registration route
router.post('/api/user/register', authController.register);

// Login route
router.post('/api/user/login', authController.login);

module.exports = router;