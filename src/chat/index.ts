import 'dotenv/config';
import {Server} from 'socket.io';
import { connect } from 'mongoose';

const URL = process.env.MONGO_URL || 'mongodb://localhost:27017/chat';

(async () => {
  try {
    await connect(URL);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log('Error connecting to MongoDB:', error);
  }
})();

export async function connectIO(io: Server) {
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
      console.log(
        `${socket.id} posted a message to room ${data.room}: ${data.message}`
      );

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
}