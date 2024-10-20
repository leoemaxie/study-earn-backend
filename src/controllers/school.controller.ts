import Department from '@models/department.model';
import Faculty from '@models/faculty.model';
import {download} from '@services/file.service';
import {Request, Response, NextFunction} from 'express';

export async function getDepartments(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {limit = 20, offset = 0, faculty} = req.query;
    const queryOptions = {
      limit: Number(limit),
      offset: Number(offset),
      raw: true,
      ...(faculty && {where: {facultyId: String(faculty)}}),
    };

    const departments = await Department.findAndCountAll(queryOptions);
    const totalPages = Math.ceil(departments.count / Number(limit));
    const currentPage = Math.floor(Number(offset) / Number(limit)) + 1;
    const url = req.protocol + '://' + req.get('host') + req.originalUrl;

    return res.status(200).json({
      metadata: {
        totalItems: departments.count,
        totalPages,
        currentPage,
        itemsPerPage: Number(limit),
        links: {
          self: `${url}?page=${currentPage}&limit=${limit}`,
          first: `${url}?page=1&limit=${limit}`,
          last: `${url}?page=${totalPages}&limit=${limit}`,
          ...(currentPage > 1 && {
            prev: `${url}?page=${currentPage - 1}&limit=${limit}`,
          }),
          ...(currentPage < totalPages && {
            next: `${url}?page=${currentPage + 1}&limit=${limit}`,
          }),
        },
      },
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
