
// Require
const Jwt = require("jsonwebtoken");

function include_jwt_info(req, res, next){
    const authorization = req.headers.authorization;
    if(!authorization || authorization.indexOf("Bearer ") === -1){ req.jwt_user_idx = null; return next(); }

    const token = authorization.split(" ")[1];
    
    console.log(authorization);

    Jwt.verify(token, process.env.AUTH_SALT, (err, jwt_user) => {
        if(err){ req.jwt_user_idx = null; return next(); }
        if(!jwt_user.idx){ req.jwt_user_idx = null; return next(); }
        req.jwt_user_idx = jwt_user.idx;
        next();
    });
}


module.exports = [include_jwt_info];