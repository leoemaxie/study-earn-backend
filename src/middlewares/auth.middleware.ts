import {NextFunction, Request, Response} from 'express';
import {Forbidden, NotFound, Unauthorized} from '@utils/error';
import jwt from 'jsonwebtoken';
import User from '@models/user.model';
import Role from '@models/enum/role.model';

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) throw new Unauthorized();
    if (!authHeader.startsWith('Bearer')) throw new Unauthorized();

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_PUBLIC_KEY || '',
      {algorithms: ['RS256']},
      async (error: unknown, decoded: any) => {
        if (error) return next(new Unauthorized('Invalid token'));
        const {role, sub} = decoded;

        const user = await User.findOne({
          where: {id: sub},
          include: [
            {
              model: Role[role],
              as: role,
              attributes: {exclude: ['id', 'userId', 'createdAt']},
            },
          ],
          raw: true,
        });

        if (!user) return next(new NotFound('User not found'));
        if (user.isBlockedUntil && user.isBlockedUntil > new Date()) {
          return next(new Forbidden('User is blocked'));
        }
        req.user = user as User;
        next();
      }
    );
  } catch (error) {
    return next(new Unauthorized());
  }
}
