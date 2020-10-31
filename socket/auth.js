
// Require
const Jwt = require("jsonwebtoken");

function include_jwt_info(req, res, next){
    
    console.log("req : ", req);
    req.jwt_user_idx = null; return next();
    if(!req || !req.keys().includes("authorization")){ req.jwt_user_idx = null; return next(); }

    const authorization = req.keys().includes("authorization");
    console.log(`auth authorization : {authorization: ${authorization}, req: ${req}}`);

    if(!authorization || authorization.indexOf("Bearer ") === -1){ req.jwt_user_idx = null; return next(); }

    const token = authorization.split(" ")[1];
    
    Jwt.verify(token, process.env.AUTH_SALT, (err, jwt_user) => {
        if(err){ req.jwt_user_idx = null; return next(); }
        
        req.jwt_user_idx = jwt_user.idx || null;
        next();
    });
}


module.exports = include_jwt_info;