db.getCollection('biwengerusers').aggregate([
    {
        $match: {
            biwengerId: {
                $ne: -1
            }
        }
    },{
        $lookup: {
            from: 'transfers',
            let: { 'currentBiwengerId': '$biwengerId' },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $or: [
                                { $eq: [ '$$currentBiwengerId', '$to' ] },
                                { $eq: [ '$$currentBiwengerId', '$from' ] },
                            ]
                        }
                    }
                }
            ],
            as: 'userTransfers'
        }
    },{
        $project: {
            _id: 0,
            biwengerId: 1,
            name: 1,
            transferMovs: {
                $size: '$userTransfers'
            }
        }
    },{
        $sort: {
            transferMovs: -1
        }
    }
])