import {NextFunction, Request, Response} from 'express';
import {Unauthorized} from '../errors/error';
import { verifyToken } from '../services/jwt.service';

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return next(new Unauthorized());

  req.user = await verifyToken(token);
  return next();
} catch (error: unknown) {
  return next(error);
}
}
