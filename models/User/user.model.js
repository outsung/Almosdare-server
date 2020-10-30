// require
const Mongoose = require('mongoose');
const Jwt = require("jsonwebtoken");
const Crypto = require('crypto');

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
        required: true
    },
    nickname: {
        type: String,
        minlength: 2,
        trim: true,
    }
},
{
    timestamps: true,
});

// Func
function getUserByIdVerif(req, res, next){
    const user_idx = req.jwt_user_idx;
    const id = req.params.id;

    if(!user_idx) return res.status(401).json("Available after login");
    // if(!id) return res.status(200).json({result: -1, message: "id : is_not_id"});
    
    next();
}
async function getUserById(req, res, next){
    const user_idx = req.jwt_user_idx;
    const id = req.params.id;

    const user = !id ? await User.Schema.findById(user_idx) : await User.Schema.findOne({id: id});
    if(!user) return res.status(200).json({result: -1, message: "Can't find anyone"});
    res.status(200).json({
        result: 1,
        id: user.id,
        nickname: user.nickname
    });
}


async function signupVerif(req, res, next){
    const id = req.body.id;
    const password = req.body.password;
    const nickname = req.body.nickname;

    if(!id) return res.status(200).json({result: -1, message: "id : is_false"});
    if(!password) return res.status(200).json({result: -1, message: "password : is_false"});
    if(await User.Schema.exists({id : id})) return res.status(200).json({result: -1, message: "id : already_exists"});

    next();
}
function signup(req, res, next){
    const id = req.body.id;
    const raw_password = req.body.password;
    const nickname = req.body.nickname;
            
    Crypto.randomBytes(64, (err, buf) => {
        const salt = buf.toString("base64");
        Crypto.pbkdf2(raw_password, salt, Number(process.env.CRYPTO_COUNT), 12, "sha512", async (err, key) => {
            const password = key.toString("base64");
            const newUser = new User.Schema({
                id,
                password,
                salt,
                nickname
            });

            await newUser.save();
            console.log(`[log] signup : {id: ${id}, nickname: ${nickname}}`);          
            res.status(200).json({result: 1, message : "user_added"});
        });
    })
}

function loginVerif(req, res, next){
    const id = req.body.id;
    const password = req.body.password;

    if(!id) return res.status(200).json({result: -1, message: "id : is_false"});
    if(!password) return res.status(200).json({result: -1, message: "password : is_false"});

    next();
}
async function login(req, res, next){
    const id = req.body.id;
    const password = req.body.password;

    const user = await User.Schema.findOne({id: id});
    if(!user) return res.status(200).json({result: -1, message : "틀렸습니다."});
            
    Crypto.pbkdf2(password, user.salt, Number(process.env.CRYPTO_COUNT), 12, 'sha512', (err, key) => {
        const c_password = key.toString('base64');

        if(!(user.password === c_password)) return res.status(200).json({result: -1, message : "틀렸습니다."});
        

        const token = Jwt.sign({ idx: user._id }, process.env.AUTH_SALT, {
            expiresIn: 86400 // 24 hours
        });

        
        console.log(`[log] login : {id: ${user.id}, nickname: ${user.nickname}}`);
        res.status(200).json({
            result: 1,
            idx: user._id,
            id: user.id,
            nickname: user.nickname,
            accessToken: token,
            tokenType: "Bearer",
        });
    });
}


//test
async function allDelete(req, res, next){
    const deleteMany_res = await User.Schema.deleteMany({});
    
    res.status(200).json({result: 1, message : `deletedCount : ${deleteMany_res.deletedCount}`});
}
async function allGet(req, res, next){
    const find_res = await User.Schema.find();

    res.status(200).json(find_res);
}


// exports
const User = {
    Schema: Mongoose.model("User", userSchema),
    Func: {
        getUserById: [getUserByIdVerif, getUserById],
        signup: [signupVerif, signup],
        login: [loginVerif, login],
        
        allDelete: [allDelete],
        allGet: [allGet]
    }
}
module.exports = User;