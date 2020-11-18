// require
const Mongoose = require('mongoose');

// Schema
const Schema = Mongoose.Schema;
const instantSchema = new Schema({
    pending: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }]
    },
    invited: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "User",
        }],
        validate: v => v.length >= 1,
    }

},
{
    timestamps: true,
});


// Func
async function getInstantByUser(user_idx){
    const find_res = await Instant.Schema.find({invited: {$in : user_idx}});

    return find_res.map(i => {
        return {
            idx: i._id,
            invited: i.invited,
            pending: i.pending
        }
    });
}
async function getPendingInstantByUser(user_idx){
    const find_res = await Instant.Schema.find({pending: {$in : user_idx}});
    
    return find_res.map(i => {
        return {
            idx: i._id,
            invited: i.invited,
            pending: i.pending
        }
    });
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