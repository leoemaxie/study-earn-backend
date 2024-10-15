import 'dotenv/config';
import {Server} from 'socket.io';
import {connect} from 'mongoose';
import socketAuthentication from '@middlewares/socket.auth.middleware';
import Chat from '@schemas/chat.schema';
import Message from '@schemas/message.schema';
import User from '@schemas/user.schema';
import Room from '@schemas/room.schema';

const URL = process.env.MONGO_URI || 'mongodb://localhost:27017/chat';
const path = `api/${process.env.VERSION || 'v1'}/chat`;

(async () => {
  try {
    await connect(URL);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log('Error connecting to MongoDB:', error);
  }
})();

export async function connectIO(io: Server) {
  const chat = io.of(path);
  chat.use(socketAuthentication);

  chat.on('connection', socket => {
    const user = socket.request.user;
    socket.on('joinRoom', room => {
      console.log(`${socket.id} just joined room ${room}`);

      socket.join(room);

      chat.to(room).emit('roomJoined', `${socket.id} just joined the room`);
    });

    socket.on('leaveRoom', room => {
      console.log(`${socket.id} has left room ${room}`);

      socket.leave(room);

      chat.to(room).emit('roomLeft', `${socket.id} has left the room`);
    });

    socket.on('messageToRoom', data => {
      console.log(
        `${socket.id} posted a message to room ${data.room}: ${data.message}`
      );

      chat.to(data.room).emit('message', {
        id: socket.id,
        message: data.message,
      });
    });

    socket.on('messageToAll', data => {
      console.log(
        `${socket.id} sent a message to all clients: ${data.message}`
      );

      chat.emit('message', {
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

    socket.on('disconnect', () => {
      console.log(`${socket.id} disconnected`);
    });
  });
}
