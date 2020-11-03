// require
const Mongoose = require('mongoose');

// Schema
const Schema = Mongoose.Schema;
const timelineSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true,
    }
},
{
    timestamps: true,
});

// Func
async function add(user_idx, message){
    if(!user_idx) return;
    if(!message) return;
    
    if(!Mongoose.Types.ObjectId.isValid(user_idx)) return;

    const newTimeline = new Timeline.Schema({
        user: user_idx,
        message: message
    });
    
    const timeline = await newTimeline.save();
    return;
}

function getByTimeVerif(req, res, next){
    const user_idx = req.jwt_user_idx;
    const before = req.params.time;
    const limit = req.params.limit;

    if(!user_idx) return res.status(401).json("Available after login");
    if(!limit) return res.status(401).json("limit : is_false");
    if(!Number(limit)) return res.status(401).json("limit : is_not_number");
    
    next();
}
async function getByTime(req, res, next){
    const user_idx = req.jwt_user_idx;
    const before = req.params.before;
    const limit = req.params.limit;
    
    const find_res = await Timeline.Schema.find({$and: [{createdAt: {$lte: before || Date.now()}}, {user: user_idx}]}).limit(limit);
    
    res.status(200).json({result: 1, data: find_res});
}

// test
async function allDelete(req, res, next){
    const deleteMany_res = await Timeline.Schema.deleteMany({});
    
    res.status(200).json({result: 1, message : `deletedCount : ${deleteMany_res.deletedCount}`});
}
async function allGet(req, res, next){
    const find_res = await Timeline.Schema.find();

    res.status(200).json(find_res);
}

// exports
const Timeline = {
    Schema: Mongoose.model("Timeline", timelineSchema),
    add: add,
    Func: {
        getByTime: [getByTimeVerif, getByTime],
        allDelete: [allDelete],
        allGet: [allGet]
    }
}
module.exports = Timeline;