// require
const Mongoose = require('mongoose');

// Schema
const Schema = Mongoose.Schema;
const dareSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    
    place: {
        type: {
            name: {
                type: String,
                required: true
            },
            latitude: {
                type: String,
                required: true
            },
            longitude: {
                type: String,
                required: true
            },
        },
    },
    date: {
        type: Date,
        required: true
    },

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
async function getDareByUser(user_idx){
    const find_res = await Dare.Schema.find({$or: [{creator: user_idx}, {invited: {$in : user_idx}}]}).sort({updatedAt: -1});

    return find_res.map(d => {
        return {
            idx: d._id,
            creator: d.creator,
            place: d.place,
            date: d.date,
            invited: d.invited,
            pending: d.pending
        }
    });
}
async function getPendingDareByUser(user_idx){
    const find_res = await Dare.Schema.find({pending: {$in : user_idx}}).sort({updatedAt: -1});

    return find_res.map(d => {
        return {
            idx: d._id,
            creator: d.creator,
            place: d.place,
            date: d.date,
            invited: d.invited,
            pending: d.pending
        }
    });
}


// exports
const Dare = {
    Schema: Mongoose.model("Dare", dareSchema),
    Func: {
        getDareByUser: getDareByUser,
        getPendingDareByUser: getPendingDareByUser,
    }
}
module.exports = Dare;