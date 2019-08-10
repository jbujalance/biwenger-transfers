const StandingsAggregator = require('../aggregators/standings-aggregator');
const aggregator = new StandingsAggregator();

module.exports.getStandings = function (req, res) {
    aggregator.getRoundStandings(req.query.season)
    .then(standings => {
        console.log('Serving request: ' + req.url + ' to user ' + req.jwtPayload.email);
        res.send(standings);
    })
    .catch(err => {
        console.log(err);
        res.send({
            status: 'error',
            message: err
        });
    })
}