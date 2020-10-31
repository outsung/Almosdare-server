
// const member_location = {};

// module.exports = (io) => {
//     io.on("connection", (socket) => {
//         console.log("Socket initiated!");
//         socket.on("getMemberLocation", (data) => {
//             console.log('got request');
//             member_location[data.name] = data.location
//             io.to('123').emit("sendMemberLocation", member_location);
//         });
//         socket.on("join", (room) => {
//             socket.join(room);
//         })
//     });
// }

const Auth = require('./auth');

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

module.exports = (io) => {
    io.use(wrap(Auth));
    io.on("connection", (socket) => {
        console.log(`[log] socket_initiated : {idx: ${socket.request.jwt_user_idx}}`);
        socket.on("dare_init", (dare_idx) => {
            socket.join(dare_idx);
            io.to(dare_idx).emit("creat_user", socket.request.jwt_user_idx);
        });
        socket.on("instant_init", (instant_idx) => {
            socket.join(instant_idx);
            io.to(instant_idx).emit("creat_user", socket.request.jwt_user_idx);
        });

        socket.on("getMemberLocation", (data) => {
            console.log(`[log] socket_getMemberLocation : {idx: ${socket.request.jwt_user_idx}, data: ${data}}`);
            let _io = io;
            for(let i = 0; i < rooms; i++){
                _io = _io.to(rooms[i]);
            }
            _io.emit("sendMemberLocation", data);
        });
    });
}