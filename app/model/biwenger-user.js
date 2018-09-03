const mongoose = require('mongoose');

var biwengerUser = new mongoose.Schema({
    biwengerId: Number,
    name: String
});

module.exports = mongoose.model('BiwengerUser', biwengerUser);
