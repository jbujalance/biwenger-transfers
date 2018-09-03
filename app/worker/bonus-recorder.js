const BiwengerClient = require('../rest/biwenger-client');
const Bonus = require('../model/bonus');

class BonusRecorder {
    
    constructor() {
        this.restClient = new BiwengerClient();
        this.bonusDao = Bonus;
    }

    recordNewBonuses(pCallback) {
        let self = this;
        this.restClient.getBonuses(0, process.env.BONUS_RETRIEVAL_LIMIT || 5).then(res => {
            console.log('Found ' + res.length + ' recent bonuses entries in Biwenger');
            self.bonusDao.getMostRecentDate().then(date => {
                console.log('Last recorded date is ' + date);
                self._saveBonusesAfterDate(res, date, pCallback);
            });
        }).catch(err => {
            console.log('Error while retrieving the bonuses from Biwenger: ' + err);
            pCallback(err);
        });
    }

    _saveBonusesAfterDate(pBonusArray, pAfterDate, pCallback) {
        let saveableObjs = this._buildSaveableObjs(this._filterTransferDataAfterDate(pBonusArray, pAfterDate));
        console.log(saveableObjs.length + ' bonuses to save');
        this.bonusDao.create(saveableObjs, (err, newDocs) => {
            if (err) {
                console.log('Error while creating bonus documents: ' + err);
                pCallback(err);
            } else {
                if (newDocs) console.log('Successfully created following bonus documents: ' + newDocs);
                pCallback(newDocs);
            }
        });
    }

    _filterTransferDataAfterDate(pBonusArray, pDate) {
        return pBonusArray.filter(bonusBlock => bonusBlock.date * 1000 > pDate.getTime());
    }

    _buildSaveableObjs(pBonusArray) {
        let saveableObjects = [];
        pBonusArray.forEach(element => {
            saveableObjects = saveableObjects.concat(this._convertBiwengerObjToModelObjs(element));
        });
        return saveableObjects;
    }

    _convertBiwengerObjToModelObjs(pBiwengerBonusObj) {
        let modelObjs = [];
        pBiwengerBonusObj.content.forEach(unitBonus => {
            let modelObj = {
                userId: unitBonus.user.id,
                amount: unitBonus.amount,
                reason: unitBonus.reason,
                date: new Date(pBiwengerBonusObj.date * 1000)
            };
            modelObjs.push(modelObj);
        });
        return modelObjs;
    }
}

module.exports = BonusRecorder;
