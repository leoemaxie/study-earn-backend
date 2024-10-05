import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {NextFunction, Request, Response} from 'express';
import {Unauthorized} from '../utils/error';

dotenv.config();

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return next(new Unauthorized());

  return jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET || '',
    (error: any, user: any) => {
      if (error) return next(new Unauthorized());
      req.user = user;
      return res.json(user);
    }
  );
}
