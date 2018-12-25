const mongoose = require('mongoose');

var pushSubscription = new mongoose.Schema({
    userId: String,
    subscription: {
        endpoint: String,
        keys: {
            p256dh: String,
            auth: String
        }
    }
});

module.exports = mongoose.model('PushSubscription', pushSubscription);
