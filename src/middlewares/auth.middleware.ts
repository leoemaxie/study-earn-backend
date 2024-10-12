import {NextFunction, Request, Response} from 'express';
import {NotFound, Unauthorized} from '../utils/error';
import jwt from 'jsonwebtoken';
import User from '../db/postgres/models/user.model';

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) throw new Unauthorized();

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_PUBLIC_KEY || '',
      {algorithms: ['RS256']},
      async (error: unknown, decoded: any) => {
        if (error) return next(new Unauthorized());

        const user = await User.findByPk(decoded.sub, {raw: true});
        
        if (!user) return next(new NotFound('User not found'));
        req.user = user as User;
        next();
      }
    );
  } catch (error) {
    return next(new Unauthorized());
  }
}
