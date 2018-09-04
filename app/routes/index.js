const router = require('express').Router();
const jwt = require('express-jwt');
const authController = require('../controllers/auth-controller');
const balanceController = require('../controllers/balance-controller');
const paymentController = require('../controllers/payments-controller');

var auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'jwtPayload'
});

// Home page
router.get('/', (req, res) => {
    res.send('Up and runnig :)');
});

// Authentication
router.post('/api/user/register', authController.register);
router.post('/api/user/login', authController.login);

// Balances
router.get('/api/balances', balanceController.getBalances);

// Payments
router.get('/api/payments', auth, paymentController.getPayments);

module.exports = router;