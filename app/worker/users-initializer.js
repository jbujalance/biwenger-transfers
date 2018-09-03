const BiwengerUser = require('../model/user');
const BiwengerClient = require('../rest/biwenger-client');

class UsersInitializer {
    
    constructor() {
        this.userDao = BiwengerUser;
        this.biwengerClient = new BiwengerClient();
    }

    initializeUsersCollection() {
        this.biwengerClient.getLeagueUsers().then(usersDetails => {
            this._repopulateUserCollection(usersDetails);
        }).catch(err => {
            console.log('Error while retrieving the users data from Biwenger: ' + err);
        });
    }

    _repopulateUserCollection(pDataArray) {
        this.userDao.deleteMany({}, err => {
            if (err) {
                console.log('An error occurred while deleting all the documents in the users collection: ' + err);
            } else {
                console.log('Deleted all documents in users collection. Repopulating the collection...');
                this._saveUsers(pDataArray);
            }
        });
    }

    _saveUsers(pDataArray) {
        let saveableObjs = this._convertDataArrayToSaveableObjs(pDataArray);
        saveableObjs.forEach(saveableObj => {
            this.userDao.create(saveableObj, (err, newDoc) => {
                if (err) {
                    console.log('Error while creating user document: ' + err);
                } else {
                    console.log('Successfully created user document for user: ' + newDoc.name);
                }
            });
        });
    }

    _convertDataArrayToSaveableObjs(pDataArray) {
        let saveableObjs = [];
        pDataArray.forEach(dataObj => {
            let saveable = {
                biwengerId: dataObj.id,
                name: dataObj.name
            };
            saveableObjs.push(saveable);
        });
        // Add 'Computer' user
        saveableObjs.push({
            biwengerId: -1,
            name: 'Computer'
        });
        return saveableObjs;
    }
}

module.exports = UsersInitializer;