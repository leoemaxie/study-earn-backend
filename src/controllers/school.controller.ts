import Department from '../db/postgres/models/department.model';
import {Request, Response, NextFunction} from 'express';

export async function getDepartments(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {limit = 10, offset = 0, faculty} = req.query;
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
