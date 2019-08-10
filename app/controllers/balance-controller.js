const BalanceAggregator = require('../aggregators/balance-aggregator');
const aggregator = new BalanceAggregator();

module.exports.getBalances = function (req, res) {
    aggregator.getUsersBalance(req.query.season)
    .then(balances => {
        console.log('Serving request: ' + req.url + ' to user ' + req.jwtPayload.email);
        res.send(balances);
    })
    .catch(err => {
        console.log(err);
        res.send({
            status: 'error',
            message: error
        });
    })
};