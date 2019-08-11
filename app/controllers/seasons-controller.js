const Season = require('../model/season');

module.exports.getSeasons = function (req, res) {
    Season.find({}).exec()
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

module.exports.getCurrentSeason = function (req, res) {
    Season.getCurrentSeason().exec()
    .then(season => {
        console.log('Serving request: ' + req.url + ' to user ' + req.jwtPayload.email);
        res.send(season);
    })
    .catch(err => {
        console.error(err);
        res.send({
            status: 'error',
            message: err
        });
    });
}
