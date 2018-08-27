const axios = require('axios');

class BiwengerClient {

    constructor() {
        this.client = axios.create({
            baseURL: 'https://biwenger.as.com/api/v2/',
            timeout: 1000,
            headers: {
                'content-type': 'application/json; charset=utf-8',
                'accept': 'application/json, text/plain, */*',
                'authorization': process.env.BIWENGER_BEARER,
                'x-version': process.env.BIWENGER_X_VERSION,
                'x-league': process.env.BIWENGER_LEAGUE_ID,
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
        return this.client.get('league/board', {
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
        return this.client.get('league/board', {
            params: {
                type: 'bonus',
                offset: pOffset,
                limit: pLimit
            }
        })
        .then(res => {
            return res.data.data
        });
    }

    /**
     * Retrieve the given number of finished rounds.
     * @param {Integer} pOffset the offset at which to start retrieving finished rounds
     * @param {Integer} pLimit the number of finished rounds to retrieve
     * @returns a Promies of an array of finished rounds
     */
    getRecentRounds(pOffset, pLimit) {
        return this.client.get('league/board', {
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
        })
    }
};

module.exports = BiwengerClient;