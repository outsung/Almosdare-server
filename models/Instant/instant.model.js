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
function createVerif(req, res, next){
    const user_idx = req.jwt_user_idx;

    if(!user_idx) return res.status(401).json("Available after login");

    next();
}
async function create(req, res, next){
    const user_idx = req.jwt_user_idx;

    const newInstant = new Instant.Schema({
        invited: [user_idx]
    });
    
    const instant = await newInstant.save();
    console.log(`[log] instant_create : {creator: ${user_idx}, _id: ${instant._id}}`);          
    res.status(200).json({result: 1, idx: instant._id});
}

function getInstantByUserVerif(req, res, next){
    const user_idx = req.jwt_user_idx;

    if(!user_idx) return res.status(401).json("Available after login");

    next();
}
async function getInstantByUser(req, res, next){
    const user_idx = req.jwt_user_idx;

    const find_res = await Instant.Schema.find({invited: {$in : user_idx}});
    res.status(200).json({result: 1, data: find_res});
}
function getPendingInstantByUserVerif(req, res, next){
    const user_idx = req.jwt_user_idx;

    if(!user_idx) return res.status(401).json("Available after login");

    next();
}
async function getPendingInstantByUser(req, res, next){
    const user_idx = req.jwt_user_idx;

    const find_res = await Instant.Schema.find({pending: {$in : user_idx}});
    res.status(200).json({result: 1, data: find_res});
}

// 초대하기
async function invitingUserVerif(req, res, next){
    const user_idx = req.jwt_user_idx;
    const idx = req.params.idx;
    const users = req.body.users;

    if(!user_idx) return res.status(401).json("Available after login");

    if(!idx) return res.status(200).json({result: -1, message: "idx : is_false"});
    if(!users || !users.length) return res.status(200).json({result: -1, message: "users : is_empty"});
    

    if(users.filter(u => !Mongoose.Types.ObjectId.isValid(u)).length) return res.status(200).json({result: -1, message: "users : is_not_idx"});
    
    const instant = await Instant.Schema.findById(idx);
    if(!instant) return res.status(200).json({result: -1, message: "idx : instant_is_not_exist"});

    if(!instant.invited.includes(user_idx)) return res.status(401).json("No Permission");
    if(users.filter(u => instant.pending.includes(u) || instant.invited.includes(u)).length)
        return res.status(200).json({result: -1, message: "already_invited"});

    next();
}
async function invitingUser(req, res, next){
    const idx = req.params.idx;
    const users = req.body.users;
    
    await Instant.Schema.updateOne({_id: idx}, {$push: {pending: {$each: users}}});
    console.log(`[log] instant_inviting_user : {_id: ${idx}, users: ${users.join(" ")}}`);          
    res.status(200).json({result: 1, message: "inviting_user"});
}
// 초대받기
async function responseInstantVerif(req, res, next){
    const idx = req.params.idx;
    const user_idx = req.jwt_user_idx;
    const state = req.body.state;

    if(!user_idx) return res.status(401).json("Available after login");
    if(!idx) return res.status(200).json({result: -1, message: "idx : is_false"});
    if(!state) return res.status(200).json({result: -1, message: "state : is_false"});

    if(!Mongoose.Types.ObjectId.isValid(idx)) return res.status(200).json({result: -1, message: "idx : is_not_idx"});
    if(!Mongoose.Types.ObjectId.isValid(user_idx)) return res.status(200).json({result: -1, message: "user_idx : is_not_idx"});

    const instant = await Instant.Schema.findById(idx);
    if(!instant) return res.status(200).json({result: -1, message: "idx : instant_is_not_exist"});
    if(!instant.pending.includes(user_idx)) return res.status(200).json({result: -1, message: "user_idx : not_invited"});
    if(instant.invited.includes(user_idx)) return res.status(200).json({result: -1, message: "already_invited"});

    if(state !== "accept" && state !== "reject") return res.status(200).json({result: -1, message: `state is only "accept" or "reject"`});

    next();
}
async function responseInstant(req, res, next){
    const user_idx = req.jwt_user_idx;
    const idx = req.params.idx;
    const state = req.body.state;

    await Instant.Schema.updateOne({_id: idx}, {$pull: {pending: user_idx}});
    if(state === "accept") await Instant.Schema.updateOne({_id: idx}, {$push: {invited: user_idx}});

    res.status(200).json({result: 1, message: "responded_instant"});
}

// test
async function allDelete(req, res, next){
    const deleteMany_res = await Instant.Schema.deleteMany({});
    
    res.status(200).json({result: 1, message : `deletedCount : ${deleteMany_res.deletedCount}`});
}
async function allGet(req, res, next){
    const find_res = await Instant.Schema.find();

    res.status(200).json(find_res);
}

// exports
const Instant = {
    Schema: Mongoose.model("Instant", instantSchema),
    Func: {
        create: [createVerif, create],
        getInstantByUser: [getInstantByUserVerif, getInstantByUser],
        getPendingInstantByUser: [getPendingInstantByUserVerif, getPendingInstantByUser],
        invitingUser: [invitingUserVerif, invitingUser],
        responseInstant: [responseInstantVerif, responseInstant],

        allDelete: [allDelete],
        allGet: [allGet]
    }
}
module.exports = Instant;