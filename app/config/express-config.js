const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');

var corsOptions = {
    origin: process.env.CORS_DOMAIN || '*',
    methods: 'GET,POST'
}

module.exports.configure = function (app) {
    // CORS
    app.use(cors(corsOptions));
    app.options('*', cors(corsOptions));

    // Passport configuration
    app.use(passport.initialize());

    // Body-parser
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
}