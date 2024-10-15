import jwt from 'jsonwebtoken';
import User from '@models/user.model';
import ChatUser from '@schemas/user.schema';
import {Unauthorized, NotFound, Forbidden} from '@utils/error';
import {Socket} from 'socket.io';

export default function socketAuthentication(
  socket: Socket,
  next: (err?: Error) => void
) {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Unauthorized('No token provided'));
    }

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_PUBLIC_KEY || '',
      {algorithms: ['RS256']},
      async (error: unknown, decoded: any) => {
        if (error) {
          return next(new Unauthorized('Invalid token'));
        }

        const user = await User.findByPk(decoded.sub);

        if (!user) {
          return next(new NotFound('User not found'));
        }
        if (user.isBlockedUntil && user.isBlockedUntil > new Date()) {
          return next(new Forbidden('User is blocked'));
        }

        const {firstName, lastName, email, id, role} = user;
        const chatUser = await ChatUser.findOneAndUpdate(
          {id},
          {$setOnInsert: {name: `${firstName} ${lastName}`, email, role}},
          {upsert: true, new: true}
        );

        socket.request.user = chatUser;
        next();
      }
    );
  } catch (error) {
    next(new Unauthorized());
  }
}
