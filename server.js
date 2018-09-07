// PROD
process.env.BIWENGER_BEARER = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOjI1NzA2OTE0LCJpYXQiOjE1MzQ0NDM2MTB9.9dmiHLTluMpoq8ZXorWZarsPa_r-i7hsGBg1I9IMdOA';
process.env.BIWENGER_LEAGUE_ID = 504434;
process.env.BIWENGER_X_VERSION = 553;
process.env.DB_URI = 'mongodb+srv://biwenger:vg9kKsNFfcmkfNJa5Rm4@biwengercluster-pjbg7.gcp.mongodb.net/biwenger';
process.env.PORT = 8080;
process.env.JWT_SECRET = 'secret';


const express = require('express');
const app = express();
const expressConfig = require('./app/config/express-config');
require('./app/config/db-config');
require('./app/config/passport');
const routes = require('./app/routes/index');
const postMiddlewareConfigurator = require('./app/config/post-middleware');

// Express config
expressConfig.configure(app);

// Routes
app.use('/', routes);

postMiddlewareConfigurator.configure(app);

// Listen on port provided by environment
console.log('Server listening');
app.listen(process.env.PORT);
