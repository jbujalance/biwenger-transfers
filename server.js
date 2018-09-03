const express = require('express');
const app = express();
const passport = require('passport');
const balanceRoutes = require('./app/routes/balance-route');
const paymentRoutes = require('./app/routes/payment-route');
require('./app/config/db-config');
require('./app/config/passport');

// Express configuration
//// CORS configuration
app.use(function(req, res, next) {
    let domain = process.env.CORS_DOMAIN || '*';
    res.header('Access-Control-Allow-Origin', domain);
    next();
});
//// Passport configuration
app.use(passport.initialize());

// Root page
app.get('/', (req, res) => {
    res.send('Up and runnig :)');
});

// Routes
app.use('/', balanceRoutes);
app.use('/', paymentRoutes);

// Listen on port provided by environment
console.log('Server listening');
app.listen(process.env.PORT);
