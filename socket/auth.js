
// Require
const Jwt = require("jsonwebtoken");

function include_jwt_info(socket, next){
    const authorization = socket.handshake.query.auth;

    if(!authorization || authorization.indexOf("Bearer ") === -1){ socket.jwt_user_idx = null; return next(); }

    const token = authorization.split(" ")[1];
    
    console.log("token: ", token);
    Jwt.verify(token, process.env.AUTH_SALT, (err, jwt_user) => {
        if(err){ socket.jwt_user_idx = null; return next(); }
        
        socket.jwt_user_idx = jwt_user.idx || null;
        console.log("token_user: ", jwt_user);
        next();
    });
}


module.exports = include_jwt_info;