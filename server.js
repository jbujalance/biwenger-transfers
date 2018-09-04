process.env.BIWENGER_BEARER = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOjI1NzA2OTE0LCJpYXQiOjE1MzQ0NDM2MTB9.9dmiHLTluMpoq8ZXorWZarsPa_r-i7hsGBg1I9IMdOA';
process.env.BIWENGER_LEAGUE_ID = 504434;
process.env.BIWENGER_X_VERSION = 553;
process.env.DB_URI = 'mongodb+srv://biwenger:vg9kKsNFfcmkfNJa5Rm4@biwengercluster-pjbg7.gcp.mongodb.net/biwenger';
process.env.PORT = 8080;
process.env.JWT_SECRET = 'secret';


const express = require('express');
const app = express();
const passport = require('passport');
const bodyParser = require('body-parser');
require('./app/config/db-config');
require('./app/config/passport');
const routeConfigurator = require('./app/routes/configure-routes');

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
routeConfigurator.configureRoutes(app);

// Listen on port provided by environment
console.log('Server listening');
app.listen(process.env.PORT);
