import express from "express";
import http from "http";
import { Server } from 'socket.io';
import { formatMessage } from "./utils/message.js";

const app  = express();
const server = http.createServer(app)
const io = new Server(server);

const botName = "PixelBot"

// Set static folder
app.use(express.static("public"))

// Run when a client connects
io.on('connection', socket => {

    //Welcome The Current User
    socket.emit('message', formatMessage(botName, 'Welcome To JustChat!'));

    // Broadcast when a user connects
    socket.broadcast.emit('message', formatMessage(botName,'A user has joined the chat'))

    // Runs when a client disconnects
    socket.on('disconnect', () => {
        // Broadcast when a user disconnects
        socket.broadcast.emit('message', formatMessage(botName,'A user has left the chat'))
    })

    //Listen for chatMessage from frontend
    socket.on('chatMessage', msg => {
        io.emit('message', formatMessage('USER', msg));
    });

});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

