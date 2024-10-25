import {Request, Response, NextFunction} from 'express';
import {download} from '@services/file.service';
import {computeMetadata} from '@utils/pagination';
import Department from '@models/department.model';
import Faculty from '@models/faculty.model';
import {where} from 'sequelize';
import Sequelize from '@sequelize/core';

export async function getDepartments(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let {limit = 50, offset = 0, faculty, page} = req.query;

    if (page) {
      offset = (Number(page) - 1) * Number(limit);
    }

    const departments = await Department.findAndCountAll({
      limit: Number(limit),
      offset: Number(offset),
      raw: true,
      include: [
        {
          model: Faculty,
          attributes: ['name'],
          ...(faculty && {where: {name: String(faculty)}}),
        },
      ],
      order: [['name', 'ASC']],
    });

    return res.status(200).json({
      metadata: computeMetadata(
        req,
        departments.count,
        Number(limit),
        Number(offset)
      ),
      data: departments.rows,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getFaculty(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const faculties = await Faculty.findAll({raw: true});
    return res.status(200).json({data: faculties});
  } catch (error) {
    return next(error);
  }
}

export async function getCalendar(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {semester, session, markdown} = req.query;
    const list = !semester || !session;
    const query = {
      semester: semester as string,
      session: session as string,
      markdown: markdown === 'true',
      list,
    };
    const data = await download('calendar', '', query);
    return res.status(200).json({data: {url: data}});
  } catch (error) {
    return next(error);
  }
}
