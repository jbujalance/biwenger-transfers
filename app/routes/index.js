const router = require('express').Router();
const jwt = require('express-jwt');
const jwtPermissions = require('express-jwt-permissions');
const authController = require('../controllers/auth-controller');
const balanceController = require('../controllers/balance-controller');
const paymentController = require('../controllers/payments-controller');
const standingController = require('../controllers/standings-controller');

var auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'jwtPayload'
});

var guard = jwtPermissions({
    requestProperty: 'jwtPayload',
    permissionsProperty: 'roles'
});

// Home page
router.get('/', (req, res) => {
    res.send('Up and runnig :)');
});

// Authentication
router.post('/api/user/register', authController.register);
router.post('/api/user/login', authController.login);

// Balances
router.get('/api/balances', auth, guard.check('balances'), balanceController.getBalances);

// Payments
router.get('/api/payments', auth, paymentController.getPayments);

// Standings
router.get('/api/rounds', auth, standingController.getStandings);

module.exports = router;