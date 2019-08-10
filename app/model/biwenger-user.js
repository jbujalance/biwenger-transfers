const mongoose = require('mongoose');

var biwengerUser = new mongoose.Schema({
    biwengerId: Number,
    name: String,
    seasons: [Number]
});

module.exports = mongoose.model('BiwengerUser', biwengerUser);
