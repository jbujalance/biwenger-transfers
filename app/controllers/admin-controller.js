const User = require('../model/user');

module.exports.getUsers = function (req, res) {
    User.find({}).select('name email lastActivity').exec()
    .then(docs => {
        console.log('Serving request: ' + req.url + ' to user ' + req.jwtPayload.email);
        res.send(docs);
    })
    .catch(err => {
        console.error(err);
        res.send({
            status: 'error',
            message: err
        });
    });
}