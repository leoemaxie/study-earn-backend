import 'dotenv/config';
import {Server} from 'socket.io';
import {connect} from 'mongoose';
import socketAuthentication from '@middlewares/socket.auth.middleware';
import Chat from '@schemas/chat.schema';
import Message from '@schemas/message.schema';
import User from '@schemas/user.schema';
import Room from '@schemas/room.schema';
import {formatError} from '@utils/format';
import Activity from '@models/activity.model';

const URL = process.env.MONGO_URI || 'mongodb://localhost:27017/chat';
const path = `api/${process.env.VERSION || 'v1'}/chat`;

(async () => {
  connect(URL)
    .then(e => console.log('Successfully connected to MongoDB'))
    .catch(e => console.error(e));
})();

export async function connectIO(io: Server) {
  const chat = io.of(path);
  chat.use(socketAuthentication);

  chat.on('connection', socket => {
    const user = socket.request.user;

    User.findOneAndUpdate({_id: user._id}, {online: true}).catch(e =>
      console.error(e)
    );

    socket.on('joinRoom', async r => {
      Room.findOne({name: r})
        .then(room => {
          if (!room) {
            return socket.emit('error', 'Room not found');
          }
          socket.join(r);
          return chat.to(r).emit('roomJoined', room);
        })
        .catch(e => socket.emit('error', formatError(e)));
    });

    socket.on('adUserToRoom', async name => {
      await Room.findOne({name})
        .then(room => {
          if (!room) {
            return socket.emit('error', 'Room not found');
          }
          if (room.users.includes(user._id)) {
            return socket.emit('error', 'User already in room');
          }

          room.users.push(user._id);
          return room
            .save()
            .then(_ => {
              Activity.create({
                userId: user.id,
                type: 'chat',
                description: `You just joined the room ${name}`,
                metadata: {room: name},
              }).catch(e => console.error(e));
            })
            .catch(e => socket.emit('error', formatError(e)));
        })
        .catch(e => socket.emit('error', formatError(e)));
    });

    socket.on('removeUserFromRoom', async name => {
      await Room.findOne({name})
        .then(room => {
          if (!room) {
            return socket.emit('error', 'Room not found');
          }
          if (!room.users.includes(user._id)) {
            return socket.emit('error', 'User not in room');
          }
          room.users = room.users.filter(u => u !== user._id) as any;
          return room
            .save()
            .then(_ => {
              Activity.create({
                userId: user.id,
                type: 'chat',
                description: `You just left the room ${name}`,
                metadata: {room: name},
              }).catch(e => console.error(e));
            })
            .catch(e => socket.emit('error', formatError(e)));
        })
        .catch(e => socket.emit('error', formatError(e)));
    });

    socket.on('createRoom', async data => {
      const {name, description} = data;
      await new Room({name, description, users: [user._id]})
        .save()
        .then(room => {
          socket.join(name);
          chat.emit('roomCreated', {id: room._id, name});
          Activity.create({
            userId: user.id,
            type: 'chat',
            description: `You just created the room ${name}`,
            metadata: {name, room},
          }).catch(e => console.error(e));
        })
        .catch(e => socket.emit('error', formatError(e)));
    });

    socket.on('deleteRoom', async name => {
      await Room.findOneAndDelete({name}, {projection: {_id: 0, __v: 0}})
        .populate('users', 'name')
        .then(room => {
          if (!room) {
            return socket.emit('error', 'Room not found');
          }
          chat.emit('roomDeleted', room);
          Activity.create({
            userId: user.id,
            type: 'chat',
            description: `You just deleted the room ${name}`,
            metadata: {name, room},
          }).catch(e => console.error(e));
          return;
        })
        .catch(e => socket.emit('error', formatError(e)));
    });

    socket.on('leaveRoom', room => {
      socket.leave(room);
      chat.to(room).emit('roomLeft', `${user.name} has left the room`);
    });

    socket.on('messageToRoom', async data => {
      await new Message({
        message: data.message,
        senderId: user._id,
        chatId: data.room,
        readBy: [],
        isRead: false,
      })
        .save()
        .then(_ => {
          chat.to(data.room).emit('message', {
            id: socket.id,
            message: data.message,
            user: user.name,
          });
        })
        .catch(e => socket.emit('error', formatError(e)));
    });

    socket.on('message', async data => {
      await new Message({
        message: data.message,
        senderId: user._id,
        readBy: [],
        isRead: false,
      })
        .save()
        .then(_ => {
          chat.emit('message', {
            id: user._id,
            message: data.message,
            user: user.name,
          });
        })
        .catch(e => socket.emit('error', formatError(e)));
    });

    socket.on('newChat', async data => {
      const {recipientId, room} = data;
      await User.findOne({id: recipientId})
        .then(recipient => {
          if (!recipient) {
            return socket.emit('error', 'Recipient not found');
          }
          new Chat({
            message: [],
            sender: user._id,
            recipient: recipientId,
            room,
          })
            .save()
            .catch(e => socket.emit('error', formatError(e)));

          if (recipient.online) {
            return chat.to(recipientId).emit('newChat', chat);
          }
          return;
        })
        .catch(e => socket.emit('error', formatError(e)));
    });

    socket.on('delteteMessage', async id => {
      await Message.findOneAndDelete({_id: id})
        .then(_ => {
          chat.emit('messageDeleted', id);
        })
        .catch(e => socket.emit('error', formatError(e)));
    });

    socket.on('privateMessage', async (msg, recipientId) => {
      const recipientSocket = chat.sockets.get(recipientId);
      if (recipientSocket) {
        recipientSocket.emit('privateMessage', {
          id: socket.id,
          message: msg,
          user: user.name,
        });
      } else {
      }
    });

    socket.on('disconnect', () => {
      User.findOneAndUpdate({id: user.id}, {online: false}).catch(e =>
        console.error(e)
      );
    });
  });
}
