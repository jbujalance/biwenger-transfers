const PushSubscription = require('../model/push-subscription');

function sendJsonResponse(res, status, content) {
    res.status(status);
    res.json(content);
};

function requestBodyIsNotValid(pBody) {
    return !pBody.userId
        || !pBody.subscription
        || !pBody.subscription.endpoint
        || !pBody.subscription.keys
        || !pBody.subscription.keys.p256dh
        || !pBody.subscription.keys.auth;
};

module.exports.subscribe = function (req, res) {
    if (requestBodyIsNotValid(req.body)) {
        sendJsonResponse(res, 400, {'message': 'The request body is not valid: Missing fields for a valid push subscription'});
        return;
    }

    let pushSubscription = new PushSubscription(req.body);
    pushSubscription.save(err => {
        if (err) {
            sendJsonResponse(res, 500, { 'message': 'Error while trying to register the subscription: ' + err });
        } else {
            sendJsonResponse(res, 200, {'message': 'Subscription successfuly registered'});
        }
    });
};