require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const socketIo = require('socket.io');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// mogoDB connect
mongoose.connect(process.env.ATLAS_URL, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database donnection establisehd successfully");
})

// server start
const server = app.listen(port, () => {
    console.log('Server is running on port : ' + port);
});
// socket start
const io = socketIo(server);
require('./src/socket/socket')(io);

// server routes   
app.use('/api', require('./src/routes/route'));