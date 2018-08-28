const router = require('express').Router();
const BalanceAggregator = require('../db/balance-aggregator');
const aggregator = new BalanceAggregator();

router.get('/api/balances', (req, res) => {
    aggregator.getUsersBalance()
    .then(balances => {
        console.log('Serving request: ' + req.url);
        res.send(balances);
    })
    .catch(err => {
        console.log(err);
        res.send({
            status: 'error',
            message: error
        });
    })
});

module.exports = router;