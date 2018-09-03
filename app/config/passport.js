const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/user');

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },

    function (pEmail, pPassword, done) {
        User.find({email: pEmail}, function(error, user) {
            if (error) {
                return done(error);
            }
            if (!user) {
                return done(null, false, { message: 'User with email ' + pEmail + ' not found.' });
            }
            if (!user.validPassword(pPassword)) {
                return done(null, false, { message: 'Wrong password' });
            }
            return done(null, user);
        });
    }
));
