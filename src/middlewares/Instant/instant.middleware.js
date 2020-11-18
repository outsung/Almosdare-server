// require
const Mongoose = require('mongoose');
const InstantModel = require('../../models/Instant/instant.model');
const TimelineModel = require('../../models/Timeline/timeline.model');


// middleware
function createVerify(req, res, next){
    const user_idx = req.jwt_user_idx;

    if(!user_idx) return res.status(401).json("Available after login");

    next();
}
async function create(req, res, next){
    const user_idx = req.jwt_user_idx;

    const newInstant = new InstantModel.Schema({
        invited: [user_idx]
    });
    
    const instant = await newInstant.save();
    TimelineModel.Func.add(user_idx, `[log] instant_create : {creator: ${user_idx}, _id: ${instant._id}}`);
    console.log(`[log] instant_create : {creator: ${user_idx}, _id: ${instant._id}}`);          
    res.status(200).json({result: 1, idx: instant._id});
}

async function invitingUserVerify(req, res, next){
    const user_idx = req.jwt_user_idx;
    const idx = req.params.idx;
    const users = req.body.users;

    if(!user_idx) return res.status(401).json("Available after login");

    if(!idx) return res.status(200).json({result: -1, message: "idx : is_false"});
    if(!users || !users.length) return res.status(200).json({result: -1, message: "users : is_empty"});
    

    if(users.filter(u => !Mongoose.Types.ObjectId.isValid(u.idx)).length) return res.status(200).json({result: -1, message: "users : is_not_idx"});
    
    const instant = await InstantModel.Schema.findById(idx);
    if(!instant) return res.status(200).json({result: -1, message: "idx : instant_is_not_exist"});

    if(!instant.invited.includes(user_idx)) return res.status(401).json("No Permission");
    if(users.filter(u => instant.pending.includes(u.idx) || instant.invited.includes(u.idx)).length)
        return res.status(200).json({result: -1, message: "already_invited"});

    next();
}
async function invitingUser(req, res, next){
    const user_idx = req.jwt_user_idx;
    const idx = req.params.idx;
    const users = req.body.users.map(u => u.idx);
    
    const instant = await InstantModel.Schema.findByIdAndUpdate(idx, {$push: {pending: {$each: users}}}, {new: true});
    
    TimelineModel.Func.add(user_idx, `[log] instant_inviting_user : {_id: ${idx}, users: ${users.join(" ")}}`);
    console.log(`[log] instant_inviting_user : {_id: ${idx}, users: ${users.join(" ")}}`);          
    
    res.status(200).json({
        result: 1,
        data: {
            idx: instant._id,
            invited: instant.invited,
            pending: instant.pending
        }
    });
}

// 수정예정
async function responseInstantVerify(req, res, next){
    const idx = req.params.idx;
    const user_idx = req.jwt_user_idx;
    const state = req.body.state;

    if(!user_idx) return res.status(401).json("Available after login");
    if(!idx) return res.status(200).json({result: -1, message: "idx : is_false"});
    if(!state) return res.status(200).json({result: -1, message: "state : is_false"});

    if(!Mongoose.Types.ObjectId.isValid(idx)) return res.status(200).json({result: -1, message: "idx : is_not_idx"});
    if(!Mongoose.Types.ObjectId.isValid(user_idx)) return res.status(200).json({result: -1, message: "user_idx : is_not_idx"});

    const instant = await InstantModel.Schema.findById(idx);
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

    await InstantModel.Schema.updateOne({_id: idx}, {$pull: {pending: user_idx}});
    if(state === "accept") await InstantModel.Schema.updateOne({_id: idx}, {$push: {invited: user_idx}});

    res.status(200).json({result: 1, message: "responded_instant"});
}


// test
async function allDelete(req, res, next){
    const deleteMany_res = await InstantModel.Schema.deleteMany({});
    
    res.status(200).json({result: 1, message : `deletedCount : ${deleteMany_res.deletedCount}`});
}
async function allGet(req, res, next){
    const find_res = await InstantModel.Schema.find();

    res.status(200).json(find_res);
}



// exports
const Instant = {
    create: [createVerify, create],
    invitingUser: [invitingUserVerify, invitingUser],
    responseInstant: [responseInstantVerify, responseInstant],

    allDelete: [allDelete],
    allGet: [allGet]
}
module.exports = Instant;