const BiwengerClient = require('../rest/biwenger-client');
const client = new BiwengerClient();

module.exports.getMarketSalesAggregation = function () {
    return client.getMarketSales().then(sales => {
        return completeSalesData(sales);
    });
}

/**
 * Completes the sales data with the player's name and number of bids
 * @param {Object[]} pSales an array of sales objects to be completed
 * @returns {Promise<Object[]>} a promise of an array of completed sales objects
 */
function completeSalesData(pSales) {
    let promises = [];
    pSales.forEach(sale => {
        promises.push(addNameAndBidsToSale(sale));
    });
    return Promise.all(promises).then(completedSales => {
        return completedSales;
    });
}

/**
 * Adds to a sale object the player's name and number of bids.
 * @param {Object} pSale The sale object to complete with the player name and number of bids.
 * @returns {Promise<Object>} A promise of a completed sale object.
 */
async function addNameAndBidsToSale(pSale) {
    let playerId = pSale.player.id;
    return Promise.all([
        client.getPlayerNameById(playerId),
        client.getPlayerNumberOfBids(playerId)
    ]).then(results => {
        pSale.player.name = results[0];
        pSale.player.bids = results[1];
        return pSale;
    });
}