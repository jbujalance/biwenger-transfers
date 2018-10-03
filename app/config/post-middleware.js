module.exports.configure = function (app) {
    // Error handling for wrong JWT
    app.use(function (err, req, res, next) {
        if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.send({ message: err.message });
        }
    });

    // Error handling for unauthorized access
    app.use(function (err, req, res, next) {
        if (err.code === 'permission_denied') {
        res.status(403);
        res.send({ message: err.message });
        }
    });
}