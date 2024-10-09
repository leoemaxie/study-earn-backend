"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
const io = new socket_io_1.Server(httpServer);
const PORT = process.env.PORT || 3001;
io.on('connection', socket => {
    console.log('A user connected');
    socket.on('joinRoom', room => {
        console.log(`${socket.id} just joined room ${room}`);
        socket.join(room);
        io.to(room).emit('roomJoined', `${socket.id} just joined the room`);
    });
    socket.on('leaveRoom', room => {
        console.log(`${socket.id} has left room ${room}`);
        socket.leave(room);
        io.to(room).emit('roomLeft', `${socket.id} has left the room`);
    });
    socket.on('messageToRoom', data => {
        console.log(`${socket.id} posted a message to room ${data.room}: ${data.message}`);
        io.to(data.room).emit('message', {
            id: socket.id,
            message: data.message,
        });
    });
    socket.on('messageToAll', data => {
        console.log(`${socket.id} sent a message to all clients: ${data.message}`);
        io.emit('message', {
            id: socket.id,
            message: data.message,
        });
    });
    socket.on('privateMessage', (msg, recepientId) => {
        console.log(`${socket.id} sent a private message to ${recepientId}`);
    });
    socket.on('typing', () => {
        console.log(`${socket.id} is typing...`);
    });
    socket.on('chatHistory', () => {
        console.log(`${socket.id} requested chat history`);
    });
    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
    });
});
httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map