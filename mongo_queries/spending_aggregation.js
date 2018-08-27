db.getCollection('transfers').aggregate([
    { 
        $match: {}
    },{ 
        $group: {_id: "$to", minus: {$sum: "$amount"}}
    },{ 
        $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "biwengerId",
            as: "user"
        }
    },{
        $replaceRoot: {
            newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$user", 0 ] }, "$$ROOT" ] }
        }
    },{
        $project: { user: 0, _id: 0, __v: 0}
    }
])