// require
const Mongoose = require('mongoose');

// Schema
const Schema = Mongoose.Schema;
const dareSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    place: {
        type: String,
        required: true
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

    const find_res = await Dare.Schema.find({$or: [{creator: user_idx}, {invited: {$in : user_idx}}]});
    // res.status(200).json(find_res);
    return find_res;
}
async function getPendingDareByUser(user_idx){

    const find_res = await Dare.Schema.find({pending: {$in : user_idx}});
    // res.status(200).json(find_res);
    return find_res;
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