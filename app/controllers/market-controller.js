const marketSalesAggregator = require('../aggregators/market-sales-aggregator');

module.exports.getMarketSales = function (req, res) {
    marketSalesAggregator.getMarketSalesAggregation().then(sales => {
        console.log('Serving request: ' + req.url + ' to user ' + req.jwtPayload.email);
        res.send(sales);
    }).catch(err => {
        console.error(err);
        res.send({
            status: 'error',
            message: err
        });
    });
}