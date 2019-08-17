const mongoose = require('mongoose');

var bonus = new mongoose.Schema({
    biwengerUserId: Number,
    amount: Number,
    reason: String,
    date: Date,
    seasonKey: Number
});

/**
 * @returns a Promise of a date.
 */
bonus.statics.getMostRecentDate = function () {
    return this.find().sort({'date': -1}).limit(1).then(docs => {
        if (docs.length > 0) return docs[0].date ? docs[0].date : new Date(0);
        else return new Date(0);
    });
};

module.exports = mongoose.model('Bonus', bonus);
