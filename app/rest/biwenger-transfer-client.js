const axios = require('axios');

class BiwengerTransferClient {

    constructor() {
        this.client = axios.create({
            baseURL: 'https://biwenger.as.com/api/v2/',
            timeout: 1000,
            headers: {
                'content-type': 'application/json; charset=utf-8',
                'accept': 'application/json, text/plain, */*',
                'authorization': process.env.BIWENGER_BEARER,
                'x-version': process.env.BIWENGER_X_VERSION,
                'x-league': process.env.BIWENGER_LEAGUE_ID
            }
        });
    }

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
};

module.exports = BiwengerTransferClient;