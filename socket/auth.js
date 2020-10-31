
// Require
const Jwt = require("jsonwebtoken");

function include_jwt_info(socket, next){
    console.log(`req.handshake: ${socket.handshake}`);

    // if(socket.handshake["query"])
    const authorization = socket.handshake.query.auth;
    console.log(`auth : ${authorization}`);

    if(!authorization || authorization.indexOf("Bearer ") === -1){ req.jwt_user_idx = null; return next(); }

    const token = authorization.split(" ")[1];
    
    Jwt.verify(token, process.env.AUTH_SALT, (err, jwt_user) => {
        if(err){ req.jwt_user_idx = null; return next(); }
        
        req.jwt_user_idx = jwt_user.idx || null;
        next();
    });
}


module.exports = include_jwt_info;