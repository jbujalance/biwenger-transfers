const express = require('express');
const app = express();
const passport = require('passport');
const bodyParser = require('body-parser');
require('./app/config/db-config');
require('./app/config/passport');
const routes = require('./app/routes/index');

// Express configuration
//// CORS configuration
app.use(function(req, res, next) {
    let domain = process.env.CORS_DOMAIN || '*';
    res.header('Access-Control-Allow-Origin', domain);
    next();
});
//// Passport configuration
app.use(passport.initialize());
//// Body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use('/', routes);

// Error handling for wrong JWT
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401);
      res.send({ message: err.message });
    }
});

// Listen on port provided by environment
console.log('Server listening');
app.listen(process.env.PORT);
