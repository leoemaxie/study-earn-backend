import {Request, Response, NextFunction} from 'express';

export default function errorMiddleware(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  return res.status(500).json({message: error.message});
}
