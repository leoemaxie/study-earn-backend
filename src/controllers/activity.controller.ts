import {Request, Response, NextFunction} from 'express';
import {computeMetadata} from '@utils/pagination';
import Activity from '@models/activity.model';

export async function getActivities(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {limit = 50, offset = 0, type = ''} = req.query;
    const queryOptions: any = {
      limit: Number(limit),
      offset: Number(offset),
      raw: true,
      where: {},
      order: [['createdAt', 'DESC']],
    };

    queryOptions.where.userId = req.user.id;
    if (type) queryOptions.where.type = type;

    const {rows, count} = await Activity.findAndCountAll(...queryOptions);
    const metadata = computeMetadata(req, count, Number(limit), Number(offset));

    return res.status(200).json({metadata, data: rows});
  } catch (error: unknown) {
    return next(error);
  }
}
