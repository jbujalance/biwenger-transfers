db.getCollection('biwengerusers').aggregate([
    {
        $match: { 
            'biwengerId': {
                $ne: -1
            },
            'seasons': 2018
        }
    },{
        $lookup: {
            from: 'roundstandings',
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
])