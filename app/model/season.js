const mongoose = require('mongoose');

var season = new mongoose.Schema({
    // The key of the season is the start year. For example, for the season 2019/2020, the key is 2019
    key: Number,
    // The name of the season, in a human-readable format: 2019/2020
    name: String
});

/**
 * @returns A query returning the current season, ie, the season that has the greatest key.
 */
season.statics.getCurrentSeason = function() {
    return this.findOne({}).sort({'key': -1});
}

module.exports = mongoose.model('Season', season);
