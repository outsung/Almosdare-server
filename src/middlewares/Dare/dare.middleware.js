// require
const Mongoose = require('mongoose');
const DareModel = require('../../models/Dare/dare.model');
const TimelineModel = require('../../models/Timeline/timeline.model');


// middleware
function createVerify(req, res, next){
    const creator = req.jwt_user_idx;
    const place = req.body.place;
    const date = req.body.date;

    if(!creator) return res.status(401).json("Available after login");
    if(!place) return res.status(200).json({result: -1, message: "place : is_false"});
    if(!date) return res.status(200).json({result: -1, message: "date : is_false"});

    next();
}
async function create(req, res, next){
    const creator = req.jwt_user_idx;
    const place = req.body.place;
    const date = req.body.date;

    const newDare = new DareModel.Schema({
        creator,
        place,
        date
    });

    const dare = await newDare.save();
    TimelineModel.Func.add(creator, `[log] dare_create : {creator: ${creator}, place: ${place}, date: ${date}, _id: ${dare._id}}`);
    console.log(`[log] dare_create : {creator: ${creator}, place: ${place}, date: ${date}}`);          
    
    res.status(200).json({result: 1, idx: dare._id});
}

async function invitingUserVerify(req, res, next){
    const user_idx = req.jwt_user_idx;
    const idx = req.params.idx;
    const users = req.body.users;

    if(!user_idx) return res.status(401).json("Available after login");

    if(!idx) return res.status(200).json({result: -1, message: "idx : is_false"});
    if(!users || !users.length) return res.status(200).json({result: -1, message: "users : is_empty"});
    

    if(users.filter(u => !Mongoose.Types.ObjectId.isValid(u.idx)).length) return res.status(200).json({result: -1, message: "users : is_not_idx"});

    const dare = await DareModel.Schema.findById(idx);
    if(!dare) return res.status(200).json({result: -1, message: "idx : dare_is_not_exist"});

    if(!dare.invited.includes(user_idx) && dare.creator !== user_idx) return res.status(401).json("No Permission");
    if(users.filter(u => dare.pending.includes(u.idx) || dare.invited.includes(u.idx) || dare.creator === u.idx).length)
        return res.status(200).json({result: -1, message: "already_invited"});

    next();
}
async function invitingUser(req, res, next){
    const user_idx = req.jwt_user_idx;
    const idx = req.params.idx;
    const users = req.body.users.map(u => u.idx);
    
    const dare = await DareModel.Schema.findByIdAndUpdate(idx, {$push: {pending: {$each: users}}}, {new: true});

    TimelineModel.Func.add(user_idx, `[log] dare_inviting_user : {_id: ${idx}, users: ${users.join(" ")}}`);
    console.log(`[log] dare_inviting_user : {_id: ${idx}, users: ${users.join(" ")}}`);          

    {
        const user = await UserModel.Schema.findById(dare.creator);
        dare.creator = {
            idx: user._id,
            id: user.id,
            nickname: user.nickname,
            profileImageUrl: user.profileImageUrl
        }
    }
    for(let i = 0; i < dare.invited.length; i++){
        const user = await UserModel.Schema.findById(dare.invited[i]);
        dare.invited[i] = {
            idx: user._id,
            id: user.id,
            nickname: user.nickname,
            profileImageUrl: user.profileImageUrl
        }
    }
    for(let i = 0; i < dare.pending.length; i++){
        const user = await UserModel.Schema.findById(dare.pending[i]);
        dare.pending[i] = {
            idx: user._id,
            id: user.id,
            nickname: user.nickname,
            profileImageUrl: user.profileImageUrl
        }
    }

    res.status(200).json({
        result: 1,
        data: {
            idx: dare._id,
            creator: dare.creator,

            date: dare.date,
            place: dare.place,

            invited: dare.invited,
            pending: dare.pending
        }
    });
}

async function responseDareVerify(req, res, next){
    const idx = req.params.idx;
    const user_idx = req.jwt_user_idx;
    const state = req.body.state;

    if(!idx) return res.status(200).json({result: -1, message: "idx : is_false"});
    if(!user_idx) return res.status(401).json("Available after login");
    if(!state) return res.status(200).json({result: -1, message: "state : is_false"});

    if(!Mongoose.Types.ObjectId.isValid(idx)) return res.status(200).json({result: -1, message: "idx : is_not_idx"});
    if(!Mongoose.Types.ObjectId.isValid(user_idx)) return res.status(200).json({result: -1, message: "user_idx : is_not_idx"});

    const dare = await DareModel.Schema.findById(idx);
    if(!dare) return res.status(200).json({result: -1, message: "idx : dare_is_not_exist"});
    if(!dare.pending.includes(user_idx)) return res.status(200).json({result: -1, message: "user_idx : not_invited"});
    if(dare.invited.includes(user_idx) || dare.creator === user_idx) return res.status(200).json({result: -1, message: "already_invited"});

    if(state !== "accept" && state !== "reject") return res.status(200).json({result: -1, message: `state is only "accept" or "reject"`});

    next();
}
async function responseDare(req, res, next){
    const idx = req.params.idx;
    const user_idx = req.jwt_user_idx;
    const state = req.body.state;

    await DareModel.Schema.updateOne({_id: idx}, {$pull: {pending: user_idx}});
    if(state === "accept") await DareModel.Schema.updateOne({_id: idx}, {$push: {invited: user_idx}});

    res.status(200).json({result: 1, message: "responded_dare"});
}


// test
async function allDelete(req, res, next){
    const deleteMany_res = await DareModel.Schema.deleteMany({});
    
    res.status(200).json({result: 1, message : `deletedCount : ${deleteMany_res.deletedCount}`});
}
async function allGet(req, res, next){
    const find_res = await DareModel.Schema.find();

    res.status(200).json(find_res);
}



// exports
const Dare = {
    create: [createVerify, create],
    invitingUser: [invitingUserVerify, invitingUser],
    responseDare: [responseDareVerify, responseDare],

    allDelete: [allDelete],
    allGet: [allGet]
}
module.exports = Dare;