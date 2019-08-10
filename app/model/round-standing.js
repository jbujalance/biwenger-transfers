const mongoose = require('mongoose');

var roundStanding = new mongoose.Schema({
    roundId: Number,
    roundName: String,
    biwengerUserId: Number,
    points: Number,
    position: Number,
    payment: Number,
    bonus: {
        type: Number,
        default: 0
    },
    date: Date,
    seasonKey: Number
});

/**
 * @returns the date of the last saved document
 */
roundStanding.statics.getMostRecentDate = function () {
    return this.find().sort({'date': -1}).limit(1).then(docs => {
        if (docs.length > 0) {
            return docs[0].date ? docs[0].date : new Date(0);
        } else {
            return new Date(0);
        }
    });
}

module.exports = mongoose.model('RoundStanding', roundStanding);
