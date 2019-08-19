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
                console.log(saveableObjs.length + ' new standings to save.');
                this.standingDao.create(saveableObjs, (err, newDocs) => {
                    if (err) {
                        console.log('Error while creating standings documents: ' + err);
                        pCallback(err);
                    } else {
                        if (newDocs) console.log('Successfully created following standing documents: ' + newDocs);
                        pCallback(newDocs);
                    }
                });
            });
        }).catch(err => {
            console.log('Error while retrieving last finished round from Biwenger: ' + err);
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
}

module.exports = StandingRecorder;
