const User = require('../model/user');

class BalanceAggregator {

    constructor() {
    }

    getUsersBalance() {
        return User.aggregate([
            {
                $match: {
                    'biwengerId': {
                        $ne: -1
                    }
                }
            },{
                $lookup: {
                    from: "transfers",
                    localField: "biwengerId",
                    foreignField: "from",
                    as: "gainTransfers"
                }
            },{
                $lookup: {
                    from: "transfers",
                    localField: "biwengerId",
                    foreignField: "to",
                    as: "spendingTransfers"
                }
            },{
                $lookup: {
                    from: "roundstandings",
                    localField: "biwengerId",
                    foreignField: "biwengerUserId",
                    as: "roundBonuses"
                }
            },{
                $project: {
                    "_id": 0,
                    "biwengerId": 1,
                    "name": 1,
                    "gain": {
                        $reduce: {
                            input: "$gainTransfers",
                            initialValue: 0,
                            in: { $add: ["$$value", "$$this.amount"] }
                        }
                    },
                    "spend": {
                        $reduce: {
                            input: "$spendingTransfers",
                            initialValue: 0,
                            in: { $subtract: ["$$value", "$$this.amount"] }
                        }
                    },
                    "roundsBonus": {
                        $reduce: {
                            input: "$roundBonuses",
                            initialValue: 0,
                            in: { $add: ["$$value", "$$this.bonus"] }
                        }
                    }
                }
            },{
                $addFields: {
                    "balance": { $add: ["$gain", "$spend", "$roundsBonus"] }
                }
            }
        ], (err, res) => {
            if (err) console.log('Error while calculating the balance aggregation: ' + err);
            else return res;
        });
    }

}

module.exports = BalanceAggregator;