import {Request, Response, NextFunction} from 'express';
import {Error as MongooseError} from 'mongoose';
import CustomError from '../utils/error';

export default function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof CustomError) {
    return res.status(error.status).json({error: error.message});
  }

  if (
    error instanceof MongooseError.ValidatorError ||
    error instanceof MongooseError.ValidationError
  ) {
    return res.status(400).json({error: error.message});
  }

  if (
    error.name === 'SequelizeUniqueConstraintError' ||
    error.name === 'SequelizeValidationError'
  ) {
    const formattedError = error.message
      .split('\n')
      .map(err => err.replace('Validation error: ', ''));
    return res
      .status(400)
      .json({error: {msg: 'Validation Error', validations: formattedError}});
  }

  console.log(error);
  return res.status(500).json({error: error.name});
}
