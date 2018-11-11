const BiwengerClient = require('../rest/biwenger-client');
const client = new BiwengerClient();

module.exports.getMarketSalesAggregation = function () {
    client.getMarketSales()
    .then(sales => {
        completeSalesData(sales);
        return sales;
    })
    .catch(err => console.log('Something went wrong while retrieving the market sales: ' + err));
}

function completeSalesData(pSales) {
    pSales.forEach(sale => {
        addNameAndBidsToSale(sale);
    });
}

function addNameAndBidsToSale(pSale) {
    let playerId = pSale.player.id;
    Promise.all([
        client.getPlayerNameById(playerId),
        client.getPlayerNumberOfBids(playerId)
    ]).then(results => {
        pSale.player.name = results[0];
        pSale.player.bids = results[1];
    });
}