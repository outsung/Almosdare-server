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
async function addTimeline(user_idx, message){
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

// exports
const Timeline = {
    Schema: Mongoose.model("Timeline", timelineSchema),
    Func: {
        addTimeline: addTimeline,
    }
}
module.exports = Timeline;