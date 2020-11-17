// require
const Jwt = require("jsonwebtoken");
const Crypto = require("crypto");

const UserModel = require("../../models/User/user.model");
const TimelineModel = require("../../models/Timeline/timeline.model");

const UploadMiddleware = require("../S3/upload.middleware");

// middleware
function getUserByJwtVerify(req, res, next){
    const user_idx = req.jwt_user_idx;

    if(!user_idx) return res.status(401).json("Available after login");
    
    next();
}
async function getUserByJwt(req, res, next){
    const user_idx = req.jwt_user_idx;
    
    const user = await UserModel.Schema.findById(user_idx);
    if(!user) return res.status(200).json({result: -1, message: "Can't find anyone"});
    res.status(200).json({
        result: 1,
        idx: user._id,
        id: user.id,
        nickname: user.nickname,
        profileImageUrl: user.profileImageUrl
    });
}

function getUserByIdVerify(req, res, next){
    const user_idx = req.jwt_user_idx;
    const id = req.params.id;

    if(!user_idx) return res.status(401).json("Available after login");
    if(!id) return res.status(200).json({result: -1, message: "id : Field is empty"});
    
    next();
}
async function getUserById(req, res, next){
    const user_idx = req.jwt_user_idx;
    const id = req.params.id;

    const user = await UserModel.Schema.findOne({id: id});
    if(!user) return res.status(200).json({result: -1, message: "Can't find anyone"});
    res.status(200).json({
        result: 1,
        idx: user._id,
        id: user.id,
        nickname: user.nickname,
        profileImageUrl: user.profileImageUrl
    });
}

function getUserByIdxVerify(req, res, next){
    const user_idx = req.jwt_user_idx;
    const idx = req.params.idx;

    if(!user_idx) return res.status(401).json("Available after login");
    if(!idx) return res.status(200).json({result: -1, message: "idx : Field is empty"});
    
    next();
}
async function getUserByIdx(req, res, next){
    const user_idx = req.jwt_user_idx;
    const idx = req.params.idx;

    const user = await UserModel.Schema.findById(idx);
    if(!user) return res.status(200).json({result: -1, message: "Can't find anyone"});
    res.status(200).json({
        result: 1,
        idx: user._id,
        id: user.id,
        nickname: user.nickname,
        profileImageUrl: user.profileImageUrl
    });
}

async function signupVerify(req, res, next){
    const id = req.body.id;
    const password = req.body.password;
    const nickname = req.body.nickname;

    if(!id) return res.status(200).json({result: -1, message: "id : is_false"});
    if(!password) return res.status(200).json({result: -1, message: "password : is_false"});
    if(await UserModel.Schema.exists({id : id})) return res.status(200).json({result: -1, message: "id : already_exists"});

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
            const newUser = new UserModel.Schema({
                id,
                password,
                salt,
                nickname
            });

            const user = await newUser.save();
            TimelineModel.Func.add(user._id, `[log] signup : {id: ${user.id}, nickname: ${user.nickname}}`);
            console.log(`[log] signup : {id: ${user.id}, nickname: ${user.nickname}}`);
                      
            res.status(200).json({result: 1, message : "user_added"});
        });
    })
}

function loginVerify(req, res, next){
    const id = req.body.id;
    const password = req.body.password;

    if(!id) return res.status(200).json({result: -1, message: "id : is_false"});
    if(!password) return res.status(200).json({result: -1, message: "password : is_false"});

    next();
}
async function login(req, res, next){
    const id = req.body.id;
    const password = req.body.password;

    const user = await UserModel.Schema.findOne({id: id});
    if(!user) return res.status(200).json({result: -1, message : "틀렸습니다."});
            
    Crypto.pbkdf2(password, user.salt, Number(process.env.CRYPTO_COUNT), 12, 'sha512', (err, key) => {
        const c_password = key.toString('base64');

        if(!(user.password === c_password)) return res.status(200).json({result: -1, message : "틀렸습니다."});
        

        const token = Jwt.sign({ idx: user._id }, process.env.AUTH_SALT, {
            expiresIn: 86400 // 24 hours
        });

        
        TimelineModel.Func.add(user._id, `[log] login : {id: ${user.id}, nickname: ${user.nickname}}`);
        console.log(`[log] login : {id: ${user.id}, nickname: ${user.nickname}}`);
        res.status(200).json({
            result: 1,
            idx: user._id,
            id: user.id,
            nickname: user.nickname,
            profileImageUrl: user.profileImageUrl,
            accessToken: token,
            tokenType: "Bearer",
        });
    });
}


function patchProfileImageVerify(req, res, next){
    const user_idx = req.jwt_user_idx;
    const profileImage = req.body.profileImage;
    
    console.log("patchProfileImageVerify");

    if(!user_idx) return res.status(401).json("Available after login");
    if(!profileImage) return res.status(200).json({result: -1, message: "profileImage : Field is empty"});
    
    next();
};
async function patchProfileImage(req, res, next){
    console.log("patchProfileImage");
    const user_idx = req.jwt_user_idx;

    if(!(req.file && req.file.location)) return res.status(500).json({result: -1, message: "server error!!"});
    const url = req.file.location;

    const user = await UserModel.Schema.findByIdAndUpdate(user_idx, {profileImageUrl : url}, {new: true});
    
    TimelineModel.Func.add(user._id, `[log] patchProfileImage : {id: ${user.id}, nickname: ${user.nickname}}, profileImageUrl: ${user.profileImageUrl}`);
    console.log(`[log] patchProfileImage : {id: ${user.id}, nickname: ${user.nickname}}, profileImageUrl: ${user.profileImageUrl}`);

    return res.status(200).json({
        result: 1,
        idx: user._id,
        id: user.id,
        nickname: user.nickname,
        profileImageUrl: user.profileImageUrl
    });
};


//test
async function allDelete(req, res, next){
    const deleteMany_res = await UserModel.Schema.deleteMany({});
    
    res.status(200).json({result: 1, message : `deletedCount : ${deleteMany_res.deletedCount}`});
}
async function allGet(req, res, next){
    const find_res = await UserModel.Schema.find();

    res.status(200).json(find_res);
}

const User = {
    getUserByJwt: [getUserByJwtVerify, getUserByJwt],
    getUserById: [getUserByIdVerify, getUserById],
    getUserByIdx: [getUserByIdxVerify, getUserByIdx],
    signup: [signupVerify, signup],
    login: [loginVerify, login],

    patchProfileImage: [patchProfileImageVerify, UploadMiddleware, patchProfileImage],

    allDelete: [allDelete],
    allGet: [allGet]
}

module.exports = User;
