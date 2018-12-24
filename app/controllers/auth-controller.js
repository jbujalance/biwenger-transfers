const passport = require('passport');
const User = require('../model/user');

function sendJsonResponse(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.register = function (req, res) {
    if (!req.body.name || !req.body.email || !req.body.password) {
        sendJsonResponse(res, 400, { 'message': 'name, email and password fields required' });
        return;
    }

    let user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.lastActivity = new Date();
    user.setPassword(req.body.password);
    user.save(function(err) {
        if (err) {
            sendJsonResponse(res, 500, { 'message': 'Error while trying to register user: ' + err });
            return;
        }
        let token = user.generateJwt();
        sendJsonResponse(res, 200, { 'token': token });
    });
};

module.exports.login = function (req, res) {
    if (!req.body.email || !req.body.password) {
        sendJsonResponse(res, 400, { 'message': 'email and password fields required' });
        return;
    }

    passport.authenticate('local', function (err, user, info) {
        if (err) {
            // Passport authentication error
            sendJsonResponse(res, 404, err);
            return;
        }
        if (user) {
            // Successfuly retrieved user
            let token = user.generateJwt();
            sendJsonResponse(res, 200, { 'token': token });
        } else {
            // User not found
            sendJsonResponse(res, 401, info);
        }
    })(req, res);
 
};