db.getCollection('roundstandings').aggregate([
    {
        $match: { }
    },{
        $lookup: {
            from: "biwengerusers",
            localField: "biwengerUserId",
            foreignField: "biwengerId",
            as: "biwengerUser"
        }
    },{
        $unwind: "$biwengerUser"
    },{
        $sort: {
            date: 1,
            position: 1
        }
    },{
        $group: {
            _id: "$roundId",
            roundName: {
                $first: "$roundName"
            },
            date: {
                $first: "$date"
            },
            standings: {
                $push: {
                    biwengerUserId: "$biwengerUserId",
                    biwengerUserName: "$biwengerUser.name",
                    position: "$position",
                    points: "$points",
                    payment: "$payment"
                }
            }
        }
    },{
        $sort: {
            date: -1
        }
    }
])