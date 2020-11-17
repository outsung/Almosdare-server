// require
const Mongoose = require("mongoose");


// Schema
const Schema = Mongoose.Schema;
const userSchema = new Schema({
    id: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    salt: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        required: true,
        minlength: 2,
        trim: true,
    },
    profileImageUrl: {
        type: String,
        trim: true,
    }
},
{
    timestamps: true,
});



// exports
const User = {
    Schema: Mongoose.model("User", userSchema),
    Func: {
    }
}
module.exports = User;