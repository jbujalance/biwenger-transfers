const balanceRoutes = require('./balance-route');
const paymentRoutes = require('./payment-route');
const authRoutes = require('./auth-route');

module.exports.configureRoutes = function (app) {
    // Root page
    app.get('/', (req, res) => {
        res.send('Up and runnig :)');
    });

    app.use('/', balanceRoutes);
    app.use('/', paymentRoutes);
    app.use('/', authRoutes);
};