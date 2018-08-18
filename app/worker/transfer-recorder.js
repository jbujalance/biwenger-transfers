const BiwengerTransferClient = require('../rest/biwenger-transfer-client');
const Transfer = require('../model/transfer');

class TransferRecorder {
    
    constructor() {
        this.restClient = new BiwengerTransferClient();
        this.transferDao = Transfer;
    };

    recordNewTransfers() {
        var self = this;
        self.restClient.getMostRecentMovements(0, 10).then((response) => {
            console.log('Found ' + response.data.length + ' recent transfer movements in Biwenger');
            self.transferDao.getMostRecentDate().then((date) => {
                console.log('Last recorded date is ' + date);
                self._saveTransfersAfterDate(response.data, date);
            });
        }).catch((error) => {
            console.log('Error while retrieving the transfer data from Biwenger: ' + error);
        });
    }

    _saveTransfersAfterDate(pTransferData, pAfterDate) {
        let saveableObjs = this._buildSaveableObjects(this._filterTransferDataAfterDate(pTransferData, pAfterDate));
        console.log(saveableObjs.length + ' transfer movements to save');
        saveableObjs.forEach(saveableObj => {
            this.transferDao.create(saveableObj, (err, newDoc) => {
                if (err) {
                    console.log('Error while creating document: ' + err);
                } else {
                    console.log('successfully created document with id: ' + newDoc.id);
                }
            });
        });
    }

    _filterTransferDataAfterDate(pTransferData, pDate) {
        return pTransferData.filter((transfer) => transfer.date * 1000 > pDate.getTime());
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
                date: new Date(pBiwengerObj.date * 1000)
            };
            modelObjs.push(modelObj);
        });
        return modelObjs;
    }
}

module.exports = TransferRecorder;