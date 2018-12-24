const PushSubscription = require('../model/push-subscription');

function sendJsonResponse(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.subscribe = function (req, res) {
    if (!req.body.userId || !req.body.endpoint || !req.body.keys || !req.body.keys.p256dh || !req.body.keys.auth) {
        sendJsonResponse(res, 400, {'message': 'The request body is not valid: Missing fields for a valid push subscription'});
        return;
    }

    let pushSubscription = new PushSubscription(req.body);
    pushSubscription.save(err => {
        if (err) {
            sendJsonResponse(res, 500, { 'message': 'Error while trying to register the subscription: ' + err });
        }
        sendJsonResponse(res, 200, {'message': 'Subscription successfuly registered'});
    });
};