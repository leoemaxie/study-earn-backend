import {Request, Response, NextFunction} from 'express';
import {BadRequest} from '@utils/error';
import Student from '@models/student.model';

export async function updatePoints(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {minutes, score, units} = req.body;
    let points = req.user['student.points'];

    if (!minutes || !score || !units) {
      throw new BadRequest('Invalid fields');
    }
    if (
      typeof minutes !== 'number' ||
      typeof score !== 'number' ||
      typeof units !== 'number'
    ) {
      throw new BadRequest('Invalid type');
    }
    if (minutes < 0 || score < 0 || units < 0) {
      throw new BadRequest('Invalid values');
    }

    points += Math.floor((minutes / 60) * score * units);
    await Student.update({points}, {where: {userId: req.user.id}});
    res.status(200).json({data: {points}});
  } catch (error) {
    next(error);
  }
}
