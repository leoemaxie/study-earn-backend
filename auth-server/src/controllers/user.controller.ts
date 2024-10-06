import {NextFunction, Request, Response} from 'express';
import {IUser, User} from '../db/schema/user.schema';
import redisClient from '../db/config/redis';

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const {sub} = req.user as IUser;
    const {email, role} = (await User.findOne({sub})) as IUser;

    return res.status(200).json({data: {id: sub, email, role}});
  } catch (error) {
    return next(error);
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {sub} = req.user as IUser;
    await User.deleteOne({sub});
    redisClient.del(sub.toString());

    return res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
}
