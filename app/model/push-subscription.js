const mongoose = require('mongoose');

var pushSubscription = new mongoose.Schema({
    userId: Number,
    endpoint: String,
    expirationTime: Number,
    keys: {
        p256dh: String,
        auth: String
    }
});

module.exports = mongoose.model('PushSubscription', pushSubscription);
