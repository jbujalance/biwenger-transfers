db.getCollection('biwengerusers').aggregate([
    {
        $match: {
            'seasons': 2018
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
                                { $eq: ["$seasonKey", 2018] }
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
                                { $eq: ["$seasonKey", 2018] }
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
                                { $eq: ["$seasonKey", 2018] }
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
                                { $eq: ["$seasonKey", 2018] }
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
    }
])