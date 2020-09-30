
// Require
const Jwt = require("jsonwebtoken");

function include_jwt_info(req, res, next){
    const authorization = req.headers.authorization;
    console.log("authorization => ", authorization);

    if(!authorization || authorization.indexOf("Bearer ") === -1){ req.jwt_user_idx = null; return next(); }

    const token = authorization.split(" ")[1];
    console.log("token => ", token);
    
    Jwt.verify(token, process.env.AUTH_SALT, (err, jwt_user) => {
        console.log("Jwt.verify", err, jwt_user.idx);
        if(err){ req.jwt_user_idx = null; return next(); }
        
        req.jwt_user_idx = jwt_user.idx | null;
        next();
    });
}


module.exports = [include_jwt_info];