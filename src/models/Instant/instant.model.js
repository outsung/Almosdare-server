// require
const Mongoose = require('mongoose');

// Schema
const Schema = Mongoose.Schema;
const instantSchema = new Schema({
    pending: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    invited: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]
},
{
    timestamps: true,
});


// Func
async function getInstantByUser(user_idx){

    const find_res = await Instant.Schema.find({invited: {$in : user_idx}});
    // res.status(200).json({result: 1, data: find_res});
    return find_res;
}
async function getPendingInstantByUser(user_idx){

    const find_res = await Instant.Schema.find({pending: {$in : user_idx}});
    // res.status(200).json({result: 1, data: find_res});
    return find_res;
}



// exports
const Instant = {
    Schema: Mongoose.model("Instant", instantSchema),
    Func: {
        getInstantByUser: getInstantByUser,
        getPendingInstantByUser: getPendingInstantByUser,
    }
}
module.exports = Instant;