const router = require('express').Router();
const jwt = require('express-jwt');
const jwtPermissions = require('express-jwt-permissions');
const User = require('../model/user');
const authController = require('../controllers/auth-controller');
const balanceController = require('../controllers/balance-controller');
const paymentController = require('../controllers/payments-controller');
const standingController = require('../controllers/standings-controller');

// Decodes the Authorization header and set the payload of the JWT to the request.
var auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'jwtPayload'
});

// Checks if the current user has a specific role, based on its JWT payload
var guard = jwtPermissions({
    requestProperty: 'jwtPayload',
    permissionsProperty: 'roles'
});

// Updates the lastActivity date of the current user
var trackActivity = function (req, res, next) {
    User.update({ _id : req.jwtPayload._id }, { $set: { lastActivity : new Date() } }, (err) => {
        if (err) console.log('Error while updating last activity of user ' + req.jwtPayload.email + ': ' + err);
    });
    next();
}

// Home page
router.get('/', (req, res) => {
    res.send('Up and runnig :)');
});

// Authentication
router.post('/api/user/register', authController.register);
router.post('/api/user/login', authController.login);

// Balances
router.get('/api/balances', auth, guard.check('balances'), trackActivity, balanceController.getBalances);

// Payments
router.get('/api/payments', auth, trackActivity, paymentController.getPayments);

// Standings
router.get('/api/rounds', auth, trackActivity, standingController.getStandings);

module.exports = router;