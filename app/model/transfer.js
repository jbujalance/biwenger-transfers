const mongoose = require('mongoose');

var transfer = new mongoose.Schema({
    type: String,
    from: {
        type: Number,
        default: -1
    },
    to: {
        type: Number,
        default: -1
    },
    amount: Number,
    date: Date,
    seasonKey: Number
});

/**
 * @returns a Promise of a date.
 */
transfer.statics.getMostRecentDate = function () {
    return this.find().sort({'date': -1}).limit(1).then(docs => {
        if (docs.length > 0) {
            return docs[0].date ? docs[0].date : new Date(0);
        } else {
            return new Date(0);
        }
    });
};

module.exports = mongoose.model('Transfer', transfer);