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
function createVerif(req, res, next){
    const creator = req.jwt_user_idx;
    const place = req.body.place;
    const date = req.body.date;

    if(!creator) return res.status(401).json("Available after login");
    if(!place) return res.status(200).json({result: -1, message: "place : is_false"});
    if(!date) return res.status(200).json({result: -1, message: "date : is_false"});
    if(!Mongoose.Types.ObjectId.isValid(creator)) return res.status(200).json({result: -1, message: "creator : is_not_idx"});


    next();
}
async function create(req, res, next){
    const creator = req.jwt_user_idx;
    const place = req.body.place;
    const date = req.body.date;

    const newDare = new Dare.Schema({
        creator,
        place,
        date
    });

    await newDare.save();
    console.log(`[log] dare_create : {creator: ${creator}, place: ${place}, date: ${date}}`);          
    res.status(200).json({result: 1, message : "created_dare"});
}

function getDareByUserVerif(req, res, next){
    const user_idx = req.jwt_user_idx;

    if(!user_idx) return res.status(401).json("Available after login");
    if(!Mongoose.Types.ObjectId.isValid(user_idx)) return res.status(200).json({result: -1, message: "user_idx : is_not_idx"});

    next();
}
async function getDareByUser(req, res, next){
    const user_idx = req.jwt_user_idx;

    const find_res = await Dare.Schema.find({$or: [{creator: user_idx}, {invited: {$in : user_idx}}]});
    res.status(200).json(find_res);
}
function getPendingDareByUserVerif(req, res, next){
    const user_idx = req.jwt_user_idx;

    if(!user_idx) return res.status(401).json("Available after login");
    if(!Mongoose.Types.ObjectId.isValid(user_idx)) return res.status(200).json({result: -1, message: "user_idx : is_not_idx"});

    next();
}
async function getPendingDareByUser(req, res, next){
    const user_idx = req.jwt_user_idx;

    const find_res = await Dare.Schema.find({pending: {$in : user_idx}});
    res.status(200).json(find_res);
}

// 초대하기
async function invitingUserVerif(req, res, next){
    const idx = req.params.idx;
    const users = req.body.users;

    if(!idx) return res.status(200).json({result: -1, message: "idx : is_false"});
    if(!users.length) return res.status(200).json({result: -1, message: "users : is_empty"});
    
    if(!Mongoose.Types.ObjectId.isValid(idx)) return res.status(200).json({result: -1, message: "idx : is_not_idx"});
    if(users.filter(u => !Mongoose.Types.ObjectId.isValid(u)).length) return res.status(200).json({result: -1, message: "users : is_not_idx"});
    
    const dare = await Dare.Schema.findById(idx);
    if(!dare) return res.status(200).json({result: -1, message: "idx : dare_is_not_exist"});

    if(users.filter(u => dare.pending.includes(u) || dare.invited.includes(u) || dare.creator === u).length)
        return res.status(200).json({result: -1, message: "already_invited"});

    next();
}
async function invitingUser(req, res, next){
    const idx = req.params.idx;
    const users = req.body.users;
    
    await Dare.Schema.updateOne({_id: idx}, {$push: {pending: {$each: users}}});
    res.status(200).json({result: 1, message: "inviting_user"});
}
// 초대받기
async function responseDareVerif(req, res, next){
    const idx = req.params.idx;
    const user_idx = req.jwt_user_idx;
    const state = req.body.state;

    if(!idx) return res.status(200).json({result: -1, message: "idx : is_false"});
    if(!user_idx) return res.status(401).json("Available after login");
    if(!state) return res.status(200).json({result: -1, message: "state : is_false"});

    if(!Mongoose.Types.ObjectId.isValid(idx)) return res.status(200).json({result: -1, message: "idx : is_not_idx"});
    if(!Mongoose.Types.ObjectId.isValid(user_idx)) return res.status(200).json({result: -1, message: "user_idx : is_not_idx"});

    const dare = await Dare.Schema.findById(idx);
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

    await Dare.Schema.updateOne({_id: idx}, {$pull: {pending: user_idx}});
    if(state === "accept") await Dare.Schema.updateOne({_id: idx}, {$push: {invited: user_idx}});

    res.status(200).json({result: 1, message: "responded_dare"});
}

// test
async function allDelete(req, res, next){
    const deleteMany_res = await Dare.Schema.deleteMany({});
    
    res.status(200).json({result: 1, message : `deletedCount : ${deleteMany_res.deletedCount}`});
}
async function allGet(req, res, next){
    const find_res = await Dare.Schema.find();

    res.status(200).json(find_res);
}

// exports
const Dare = {
    Schema: Mongoose.model("Dare", dareSchema),
    Func: {
        create: [createVerif, create],
        getDareByUser: [getDareByUserVerif, getDareByUser],
        getPendingDareByUser: [getPendingDareByUserVerif, getPendingDareByUser],
        invitingUser: [invitingUserVerif, invitingUser],
        responseDare: [responseDareVerif, responseDare],

        allDelete: [allDelete],
        allGet: [allGet]
    }
}
module.exports = Dare;