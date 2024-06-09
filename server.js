import express from "express";
import http from "http";
import { Server } from 'socket.io';

const app  = express();
const server = http.createServer(app)
const io = new Server(server);

// Set static folder
app.use(express.static("public"))

// Run when a client connects

io.on('connection', socket => {
    console.log("New WebSocket Connection");
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

