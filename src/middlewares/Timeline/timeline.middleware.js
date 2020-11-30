// require
const TimelineModel = require('../../models/Timeline/timeline.model');


// middleware
function getByTimeVerify(req, res, next){
    const user_idx = req.jwt_user_idx;
    const before = req.params.time;
    const limit = req.params.limit;

    if(!user_idx) return res.status(401).json("Available after login");
    if(!limit) return res.status(200).json({result: -1, message: "limit : Field is empty"})
    if(!Number(limit)) return res.status(200).json({result: -1, message: "limit : Field is not Number"});
    
    next();
}
async function getByTime(req, res, next){
    const user_idx = req.jwt_user_idx;
    const before = req.params.before;
    const limit = req.params.limit;
    
    const find_res = await TimelineModel.Schema.find({$and: [{createdAt: {$lte: before || Date.now()}}, {user: user_idx}]}).limit(Number(limit));

    res.status(200).json({result: 1, data: find_res.map(t => {return {
        idx: t._id,
        user: t.user,
        message: t.message,
    }})});
}

// test
async function allDelete(req, res, next){
    const deleteMany_res = await TimelineModel.Schema.deleteMany({});
    
    res.status(200).json({result: 1, message : `deletedCount : ${deleteMany_res.deletedCount}`});
}
async function allGet(req, res, next){
    const find_res = await TimelineModel.Schema.find();

    res.status(200).json(find_res);
}


// exports
const Timeline = {
    getByTime: [getByTimeVerify, getByTime],

    allDelete: [allDelete],
    allGet: [allGet]
}
module.exports = Timeline;