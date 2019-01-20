const BiwengerClient = require('../rest/biwenger-client');
const Transfer = require('../model/transfer');

class TransferRecorder {
    
    constructor() {
        this.restClient = new BiwengerClient();
        this.transferDao = Transfer;
    };

    recordNewTransfers(pCallback) {
        var self = this;
        self.restClient.getMostRecentMovements(0, process.env.TRANSFER_RETRIEVAL_LIMIT || 5).then(response => {
            console.log('Found ' + response.data.length + ' recent transfer movements in Biwenger');
            self.transferDao.getMostRecentDate().then(date => {
                console.log('Last recorded date is ' + date);
                self._saveTransfersAfterDate(response.data, date, pCallback);
            });
        }).catch(error => {
            console.log('Error while retrieving the transfer data from Biwenger: ' + error);
            pCallback(error);
        });
    }

    _saveTransfersAfterDate(pTransferData, pAfterDate, pCallback) {
        let saveableObjs = this._buildSaveableObjects(this._filterTransferDataAfterDate(pTransferData, pAfterDate));
        console.log(saveableObjs.length + ' transfer movements to save');
        this.transferDao.create(saveableObjs, (err, newDocs) => {
            if (err) {
                console.log('Error while creating transfer documents: ' + err);
                pCallback(err);
            } else {
                if (newDocs) console.log('Successfully created following transfer documents: ' + newDocs);
                pCallback(newDocs);
            }
        });
    }

    _filterTransferDataAfterDate(pTransferData, pDate) {
        return pTransferData.filter(transfer => transfer.date * 1000 > pDate.getTime());
    }

    _buildSaveableObjects(pTransferData) {
        let saveableObjects = [];
        pTransferData.forEach(element => {
            saveableObjects = saveableObjects.concat(this._convertBiwengerObjToModelObjs(element));
        });
        return saveableObjects;
    }

    _convertBiwengerObjToModelObjs(pBiwengerObj) {
        let modelObjs = [];
        pBiwengerObj.content.forEach(unitTransfer => {
            let modelObj = {
                type: pBiwengerObj.type,
                from: unitTransfer.from ? unitTransfer.from.id : undefined,
                to: unitTransfer.to ? unitTransfer.to.id : undefined,
                amount: unitTransfer.amount,
                date: new Date(pBiwengerObj.date * 1000),
                seasonKey: process.env.CURRENT_SEASON_KEY
            };
            modelObjs.push(modelObj);
        });
        return modelObjs;
    }
}

module.exports = TransferRecorder;