const BiwengerClient = require('../rest/biwenger-client');
const RoundStanding = require('../model/round-standing');
const PositionDecorator = require('../decorator/position-decorator');
const PaymentDecorator = require('../decorator/payment-decorator');
const BonusAdjuster = require('../decorator/bonus-adjustment');

class StandingRecorder {

    constructor() {
        this.restClient = new BiwengerClient();
        this.standingDao = RoundStanding;
        this.positionDecorator = new PositionDecorator();
        this.paymentDecorator = new PaymentDecorator();
        this.bonusAdjuster = new BonusAdjuster();
    }

    recordLastRound(pCallback) {
        this.restClient.getLastFinishedRound().then(res => {
            this._buildSaveableObjects(res).then(saveableObjs => {
                if (saveableObjs.length > 0) {
                    console.log(saveableObjs.length + ' new standings to save.');
                    this._saveInDatabase(saveableObjs, pCallback);
                } else {
                    console.log('There are not new standings to record.');
                    pCallback();
                }
            });
        }).catch(err => {
            console.error('Error while retrieving last finished round from Biwenger: ' + err);
            pCallback(err);
        });
    }

    _buildSaveableObjects(pBiwengerData) {
        let saveableObjs = [];
        return this.standingDao.getMostRecentDate().then(date => {
            if (pBiwengerData.date * 1000 <= date.getTime()) return saveableObjs;
            pBiwengerData.content.results.forEach((unitResult, index) => {
                let saveableObj = {
                    roundId: pBiwengerData.content.round.id,
                    roundName: pBiwengerData.content.round.name,
                    biwengerUserId: unitResult.user.id,
                    points: unitResult.points,
                    position: index + 1,
                    payment: 0,
                    bonus: unitResult.bonus,
                    date: new Date(pBiwengerData.date * 1000),
                    // The value 'bonusReasons' is not mapped in the Mongoose RoundStanding schema, but it is needed for the bonus adjustment.
                    // As long as the Mongoose schema is in 'strict' mode, this value will not be saved in the database.
                    bonusReasons: unitResult.reason,
                    seasonKey: process.env.CURRENT_SEASON_KEY
                }
                saveableObjs.push(saveableObj);
            });
            this.positionDecorator.decorate(saveableObjs);
            this.paymentDecorator.decorate(saveableObjs);
            this.bonusAdjuster.adjustBonuses(saveableObjs);
            return saveableObjs;
        });
    }

    _saveInDatabase(pSaveableObjs, pCallback) {
        this.standingDao.create(pSaveableObjs, (err, newDocs) => {
            if (err) {
                console.error('Error while creating standings documents: ' + err);
                pCallback(err);
            } else {
                console.log('Successfully created following transfer documents: ' + newDocs);
                // TODO call the PaymentAggregator here to retrieve the global payments and post them in the league board, then call the callback to close the db connection
                pCallback(newDocs);
            }
        });
    }

    /**
     * Retrieves the global payments of the users and post them in the league board.
     * @param {Function} pFinishCallback The final callback, commonly the database disconnection.
     */
    _retrieveAndPostPaymentsOnLeagueBoard(pFinishCallback) {

    }
}

module.exports = StandingRecorder;
