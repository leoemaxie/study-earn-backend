import {Request, Response, NextFunction} from 'express';
import {BadRequest} from '@utils/error';
import scholarships from '@data/scholarship.json';
import Student from '@models/student.model';
import Activity from '@models/activity.model';

export async function updatePoints(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {minutes, score, units} = req.body;
    const {id} = req.user;
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

    await Student.sequelize.transaction(t => {
      Student.update({points}, {where: {userId: id}, transaction: t});
      Activity.create(
        {
          userId: id,
          type: 'study',
          description: 'You have completed a course',
          metadata: {score, minutes, units},
        },
        {transaction: t}
      );
    });
    res.status(200).json({data: {points}});
  } catch (error) {
    next(error);
  }
}

export function getScholarship(req: Request, res: Response) {
  return res.status(200).json({data: scholarships});
}