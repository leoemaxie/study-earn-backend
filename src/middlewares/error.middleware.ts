import {Request, Response, NextFunction} from 'express';
import {MulterError} from 'multer';
import CustomError, {Unauthorized} from '@utils/error';
import Activity from '@models/activity.model';

export default async function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof CustomError) {
    if (error instanceof Unauthorized) {
      if (req.user) {
        await Activity.create({
          userId: req.user.id,
          type: 'unauthorized',
          description:
            'Unauthorized access: You recently tried to access your account with invalid credentials',
          metadata: {ip: req.ip},
        });
      }
    }
    return res
      .status(error.status)
      .json({error: {name: error.name, message: error.message}});
  }

  if (
    error.name === 'SequelizeUniqueConstraintError' ||
    error.name === 'SequelizeValidationError'
  ) {
    const formattedError = error.message
      .split('\n')
      .map(err => err.replace('Validation error: ', ''));
    return res.status(400).json({
      error: {
        name: 'ValidationError',
        message: `There are ${formattedError.length} errors in your request. Correct the errors and try again later`,
        details: formattedError,
      },
    });
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
