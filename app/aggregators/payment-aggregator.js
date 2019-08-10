const BiwengerUser = require('../model/biwenger-user');

class PaymentAggregator {
    constructor() {
    }

    getUsersPayment(season) {
        return BiwengerUser.aggregate([
            {
                $match: { 
                    'biwengerId': {
                        $ne: -1
                    },
                    'seasons' : season
                }
            },{
                $lookup: {
                    from: 'roundstandings',
                    localField: 'biwengerId',
                    foreignField: 'biwengerUserId',
                    as: 'payments'
                }
            },{
                $project: {
                    '_id': 0,
                    'biwengerId': 1,
                    'name': 1,
                    'payment': {
                        $reduce: {
                            input: '$payments',
                            initialValue: 0,
                            in: { $add: ['$$value', '$$this.payment'] }
                        }
                    }
                }
            },{
                $sort: {
                    payment: 1
                }
            }
        ]);
    }
}

module.exports = PaymentAggregator;