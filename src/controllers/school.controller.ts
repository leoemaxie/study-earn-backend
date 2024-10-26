import {Request, Response, NextFunction} from 'express';
import {download} from '@services/file.service';
import {computeMetadata} from '@utils/pagination';
import {validateQuery} from '@utils/query';
import {DEFAULT_QUERY_FIELDS} from '@utils/fields';
import Department from '@models/department.model';
import Faculty from '@models/faculty.model';

export async function getDepartments(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let {limit = 50, offset = 0, faculty, page} = req.query;

    validateQuery(req, {
      ...DEFAULT_QUERY_FIELDS,
      faculty: 'string',
    });

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

    validateQuery(req, {
      semester: 'string',
      session: 'string',
      markdown: 'boolean',
    });

    const url = await download('calendar', '', query);
    return res.status(200).json({data: {url}});
  } catch (error) {
    return next(error);
  }
}
