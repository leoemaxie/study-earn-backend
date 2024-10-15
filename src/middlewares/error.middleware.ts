import {Request, Response, NextFunction} from 'express';
import {Error as MongooseError} from 'mongoose';
import {MulterError} from 'multer';
import CustomError from '@utils/error';

export default function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof CustomError) {
    return res
      .status(error.status)
      .json({error: {name: error.name, message: error.message}});
  }

  if (
    error instanceof MongooseError.ValidatorError ||
    error instanceof MongooseError.ValidationError
  ) {
    return res
      .status(400)
      .json({error: {name: 'ValidationError', message: error.message}});
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
      .json({error: {name: 'ValidationError', message: formattedError}});
  }

  if (error instanceof MulterError) {
    return res
      .status(400)
      .json({error: {name: 'BadRequest', message: error.message}});
  }

  console.error(error);

  return res.status(500).json({
    error: {
      name: 'ServerError',
      message: 'An error occurred, Please try again later',
    },
  });
}
