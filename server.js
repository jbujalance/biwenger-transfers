const express = require('express');
const app = express();
const passport = require('passport');
const bodyParser = require('body-parser');
require('./app/config/db-config');
require('./app/config/passport');
const routes = require('./app/routes/index');
const postMiddlewareConfigurator = require('./app/config/post-middleware');

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

postMiddlewareConfigurator.configure(app);

// Listen on port provided by environment
console.log('Server listening');
app.listen(process.env.PORT);
