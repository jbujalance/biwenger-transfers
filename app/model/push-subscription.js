const mongoose = require('mongoose');

var pushSubscription = new mongoose.Schema({
    userId: String,
    subscription: {
        endpoint: String,
        keys: {
            p256dh: String,
            auth: String
        }
    },
    device: {
        userAgent: String,
        os: String,
        browser: String,
        device: String,
        os_version: String,
        browser_version: String,
    }
});

module.exports = mongoose.model('PushSubscription', pushSubscription);
