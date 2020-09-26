
const member_location = [];

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("Socket initiated!");
        socket.on("getMemberLocation", (data) => {
            console.log('got request');
            io.emit("sendMemberLocation", data);
        });
    });
}
