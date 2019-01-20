const axios = require('axios');

class BiwengerClient {

    constructor() {
        this.client = axios.create({
            baseURL: 'https://biwenger.as.com/api/v2/',
            timeout: 10000,
            headers: {
                'content-type': 'application/json; charset=utf-8',
                'accept': 'application/json, text/plain, */*',
                'authorization': process.env.BIWENGER_BEARER,
                'x-version': process.env.BIWENGER_X_VERSION || '',
                'x-league': process.env.BIWENGER_LEAGUE_ID,
                'x-user': process.env.BIWENGER_X_USER,
                'x-lang': 'es'
            }
        });
    }

    /**
     * Returns the most recent transfers.
     * @param {Integer} pOffset the offset. Set to 0 to get the most recent transfers.
     * @param {Integer} pLimit the number of transfers to return.
     */
    getMostRecentMovements(pOffset, pLimit) {
        return this.client.get(`league/${process.env.BIWENGER_LEAGUE_ID}/board`, {
            params: {
                type: 'transfer,market,exchange,loan,loanReturn,clauseIncrement',
                offset: pOffset,
                limit: pLimit
            }
        })
        .then(response => {
           return response.data;
        });
    }

    /**
     * @returns Promise of Object Array containing the details of the users of the league
     */
    getLeagueUsers() {
        return this.client.get('league', {
            params: {
                fields: 'standings'
            }
        })
        .then(response => {
            return response.data.data.standings;
        });
    }

    /**
     * @param {Integer} pOffset the offset
     * @param {Integer} pLimit the number of entries to retrieve
     * @returns a Promise of an array of bonus entries
     */
    getBonuses(pOffset, pLimit) {
        return this.client.get(`league/${process.env.BIWENGER_LEAGUE_ID}/board`, {
            params: {
                type: 'bonus',
                offset: pOffset,
                limit: pLimit
            }
        })
        .then(res => {
            return res.data.data;
        });
    }

    /**
     * Retrieve the given number of finished rounds.
     * @param {Integer} pOffset the offset at which to start retrieving finished rounds
     * @param {Integer} pLimit the number of finished rounds to retrieve
     * @returns a Promise of an array of finished rounds
     */
    getRecentRounds(pOffset, pLimit) {
        return this.client.get(`league/${process.env.BIWENGER_LEAGUE_ID}/board`, {
            params: {
                type: 'roundFinished',
                offset: pOffset,
                limit: pLimit
            }
        })
        .then(res => {
            return res.data.data;
        });
    }

    /**
     * @returns the last finished round.
     */
    getLastFinishedRound() {
        return this.getRecentRounds(0, 1).then(res => {
            return res[0];
        });
    }

    /**
     * Posts admin bonus.
     * @param {String} pReason The bonus reason
     * @param {Object} pAmounts The map of Biwenger user Ids and quantity to set as a bonus to each player
     * @returns {Promise<Oject>} a Promise of the result of the request, something like 200 OK.
     */
    postBonus(pReason, pAmounts) {
        let postObj = {
            'reason': pReason,
            'amount': pAmounts
        }
        return this.client.post(`league/${process.env.BIWENGER_LEAGUE_ID}/bonus`, postObj).then(res => {
            return res;
        });
    }

    /**
     * Posts a message on the league board.
     * @param {Object} pMessage The message to be posted. This object is expected to have two properties:
     * @property {String} pMessage.title The post title
     * @property {String} pMessage.content The post content
     * @returns {Promise<Object>} a Promise of the posted message
     */
    postBoardMessage(pMessage) {
        return this.client.post('league/board', pMessage).then(response => {
            return response;
        });
    }

    /**
     * Returns the name of the player whose Id is given.
     * @param {Integer} pId The player Id whose name is to be returned.
     * @returns {Promise<String>} a Promise of the name of the player with the given Id.
     */
    getPlayerNameById(pId) {
        return this.client.get('players/la-liga/' + pId, {
            params: {
                fields: 'name'
            }
        }).then(res => {
            return res.data.data.name;
        });
    }

    /**
     * Consult the number of bids on a given player.
     * @param {Integer} pPlayerId The Id of the playere for which to consult the number of bids.
     * @returns {Promise<Integer>} The number of bids to the given player.
     */
    getPlayerNumberOfBids(pPlayerId) {
        return this.client.get('market/bids', {
            params: {
                player: pPlayerId
            }
        }).then(res => {
            return res.data.data;
        });
    }

    /**
     * Consults the players that are available for sale in the market.
     * @returns {Promise<Object[]>} An array of objects containing some information about the players for sale in the market.
     */
    getMarketSales() {
        return this.client.get('market').then(res => {
            return res.data.data.sales;
        });
    }
};

module.exports = BiwengerClient;