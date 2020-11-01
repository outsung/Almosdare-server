const Auth = require('./auth');

// test
const member_location = {};


module.exports = (io) => {
    
    io.use(Auth);
    io.on("connection", (socket) => {

        console.log(`[log] socket_initiated : {idx: ${socket.request.jwt_user_idx}}`);
        
        socket.on("dareJoin", (dare_idx) => {
            socket.join(dare_idx);
            io.to(dare_idx).emit("creat_user", socket.request.jwt_user_idx);
        });
        socket.on("instantJoin", (instant_idx) => {
            socket.join(instant_idx);
            io.to(instant_idx).emit("creat_user", socket.request.jwt_user_idx);
        });

        socket.on("cilentToServerSendMyLocationForRoomByJoin", (data) => {
            console.log(`[log] cilentToServerSendMyLocationByJoin : {idx: ${socket.request.jwt_user_idx}, data: ${data}}`);
            io.to(instant_idx).emit("creat_user", socket.request.jwt_user_idx);
            
            // let _io = io;
            // for(let i = 0; i < rooms; i++){
            //     _io = _io.to(rooms[i]);
            // }
            // _io.emit("sendMemberLocation", data);
        });
        

        // test 
        socket.on("getMemberLocation", (data) => {
            console.log('got request');
            member_location[data.name] = data.location
            io.to('123').emit("sendMemberLocation", member_location);
        });
        socket.on("join", (room) => {
            socket.join(room);
        })
    });
}