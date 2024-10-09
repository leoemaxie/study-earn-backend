import { Request, Response, NextFunction } from 'express';

export const sessionMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    
  console.log('Session middleware');
  next();
};