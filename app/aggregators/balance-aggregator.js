const BiwengerUser = require('../model/biwenger-user');

class BalanceAggregator {

    constructor() {
    }

    getUsersBalance(season) {
        return BiwengerUser.aggregate([
            {
                $match: {
                    'biwengerId': {
                        $ne: -1
                    },
                    'seasons': season
                }
            },{
                $lookup: {
                    from: "transfers",
                    let: { biwengerUserId: "$biwengerId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$from", "$$biwengerUserId"] },
                                        { $eq: ["$seasonKey", season] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "gainTransfers"
                }
            },{
                $lookup: {
                    from: "transfers",
                    let: { biwengerUserId: "$biwengerId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$to", "$$biwengerUserId"] },
                                        { $eq: ["$seasonKey", season] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "spendingTransfers"
                }
            },{
                $lookup: {
                    from: "roundstandings",
                    let: { userId: "$biwengerId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$biwengerUserId", "$$userId"] },
                                        { $eq: ["$seasonKey", season] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "roundBonuses"
                }
            },{
                $lookup: {
                    from: "bonus",
                    let: { userId: "$biwengerId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$biwengerUserId", "$$userId"] },
                                        { $eq: ["$seasonKey", season] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "bonuses"
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
                    },
                    "adminBonus": {
                        $reduce: {
                            input: "$bonuses",
                            initialValue: 0,
                            in: { $add: ["$$value", "$$this.amount"] }
                        }
                    }
                }
            },{
                $addFields: {
                    "balance": { $add: ["$gain", "$spend", "$roundsBonus", "$adminBonus"] }
                }
            },{
                $sort: {
                    balance: -1
                }
            }
        ], (err, res) => {
            if (err) console.log('Error while calculating the balance aggregation: ' + err);
            else return res;
        });
    }

}

module.exports = BalanceAggregator;