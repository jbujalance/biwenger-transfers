const BiwengerClient = require('../rest/biwenger-client');
const RoundStanding = require('../model/round-standing');
const PositionDecorator = require('../decorator/position-decorator');
const PaymentDecorator = require('../decorator/payment-decorator');

class StandingRecorder {

    constructor() {
        this.restClient = new BiwengerClient();
        this.standingDao = RoundStanding;
        this.positionDecorator = new PositionDecorator();
        this.paymentDecorator = new PaymentDecorator();
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
                        if (newDocs) console.log('Successfully created following transfer documents: ' + newDocs);
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
                    date: new Date(pBiwengerData.date * 1000)
                }
                saveableObjs.push(saveableObj);
            });
            this.positionDecorator.decorate(saveableObjs);
            this.paymentDecorator.decorate(saveableObjs);
            return saveableObjs;
        });
    }
}

module.exports = StandingRecorder;
