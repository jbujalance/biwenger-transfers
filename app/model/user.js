const mongoose = require('mongoose');

var user = new mongoose.Schema({
    biwengerId: Number,
    name: String
});

module.exports = mongoose.model('User', user);
