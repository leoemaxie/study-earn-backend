import {Request, Response, NextFunction} from 'express';
import {computeMetadata} from '@utils/pagination';
import {NotFound} from '@utils/error';
import {validateQuery} from '@utils/query';
import {DEFAULT_QUERY_FIELDS} from '@utils/fields';
import Activity from '@models/activity.model';

export async function getActivities(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {limit = 50, offset = 0, type, page, id} = req.query;
    const queryOptions: any = {
      limit: Number(limit),
      offset: Number(offset),
      raw: true,
      where: {},
      order: [['createdAt', 'DESC']],
      attributes: {exclude: ['userId']},
    };

    validateQuery(req, {
      ...DEFAULT_QUERY_FIELDS,
      type: 'string',
      id: 'number',
    });
    queryOptions.where.userId = req.user.id;
    if (page) queryOptions.offset = (Number(page) - 1) * Number(limit);
    if (type) queryOptions.where.type = type;
    if (id) queryOptions.where.id = id;

    const {rows, count} = await Activity.findAndCountAll(queryOptions);
    const metadata = computeMetadata(req, count, Number(limit), Number(offset));

    return res.status(200).json({metadata, data: rows});
  } catch (error: unknown) {
    return next(error);
  }
}

export async function deleteActivity(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {id} = req.query;

    if (!id) {
      await Activity.destroy({where: {userId: req.user.id}});
      return res.status(204).end();
    }

    const activity = await Activity.findOne({where: {id: Number(id)}});

    if (!activity) {
      throw new NotFound('Activity not found');
    }

    return res.status(204).end();
  } catch (error: unknown) {
    return next(error);
  }
}
