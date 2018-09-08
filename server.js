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
