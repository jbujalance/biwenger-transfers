const express = require('express');
const mongoose = require('mongoose');
const app = express();
const balanceRoutes = require('./app/routes/balance-route');
const paymentRoutes = require('./app/routes/payment-route');

// Server connection to database
console.log('Server connecting to database...');
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });

// Express configuration
app.use(function(req, res, next) {
    // TODO restrict the CORS once I'll know the frontend domain
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

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
