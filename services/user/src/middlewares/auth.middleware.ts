import {NextFunction, Request, Response} from 'express';
import {Unauthorized} from '../utils/error';
import requestTokenValidation from '../queues/auth.producer.queue';

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return next(new Unauthorized());

    requestTokenValidation(token, user => {
      req.user = user;
      return next();
    });
  } catch (error: unknown) {
    return next(error);
  }
}
