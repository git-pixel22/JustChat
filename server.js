import express from "express";
import http from "http";
import { Server } from 'socket.io';
import { formatMessage } from "./utils/message.js";
import { userJoin, getCurrentUser, userLeave, getRoomUsers } from "./utils/users.js";

const app  = express();
const server = http.createServer(app)
const io = new Server(server);

const botName = "PixelBot"

// Set static folder
app.use(express.static("public"))

// Run when a client connects
io.on('connection', socket => {

    socket.on("joinRoom", ({username, room}) => {

        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        //Welcome The Current User
        socket.emit('message', formatMessage(botName, 'Welcome To JustChat!'));

        // Broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botName,`${user.username} has joined the chat`))

        // Send user's and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })

    })

    //Listen for chatMessage from frontend
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Runs when a client disconnects
    socket.on('disconnect', () => {
        
        const user = userLeave(socket.id);

        if(user) {
            
            io.to(user.room).emit('message', formatMessage(botName,`${user.username} has left the chat`))

            // Send user's and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })

});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

