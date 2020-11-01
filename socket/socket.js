const Auth = require('./auth');

// test
const member_location = {};


module.exports = (io) => {
    
    io.use(Auth);
    io.on("connection", (socket) => {
        socket.jwt_user_idx
        console.log(`[log] socket_initiated : {idx: ${socket.jwt_user_idx}}`);
        
        // room to send
        socket.on("joinRoomToSend", (idx) => socket.join(`send_${idx}`));
        socket.on("leaveRoomToSend", (idx) => socket.leave(`send_${idx}`));

        // room to recv
        socket.on("joinRoomToRecv", (idx) => socket.join(`recv_${idx}`));
        socket.on("leaveRoomToRecv", (idx) => socket.leave(`recv_${idx}`));


        socket.on("memberLocation", (location) => {
            console.log(`[log] memberLocation : {idx: ${socket.jwt_user_idx}, location: ${location}, rooms: ${socket.rooms}}`);
            const roomsToSend = socket.rooms.filter(room => room.indexOf("send_") !== -1);
            const roomsToRecv = roomsToSend.map(room => room.replace("send_", "recv_"));

            let _io = io;
            for(let i = roomsToRecv.length; i--; _io = _io.to(roomsToRecv[i - 1])); 
            
            _io.broadcast.emit("changedOtherMemberLocation", {idx: socket.jwt_user_idx, location: location});
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