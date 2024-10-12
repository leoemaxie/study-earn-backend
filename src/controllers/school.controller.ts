import Department from '../db/postgres/models/department.model';
import { Request, Response, NextFunction } from 'express';

export async function getDepartments(req: Request, res: Response, next: NextFunction) {
  try {
    const { limit = 10, offset = 0, faculty } = req.query;
    const queryOptions = {
      limit: Number(limit),
      offset: Number(offset),
      raw: true,
      ...(faculty && { where: { facultyId: String(faculty) } }),
    };

    const departments = await Department.findAndCountAll(queryOptions);

    const totalPages = Math.ceil(departments.count / Number(limit));
    const currentPage = Math.floor(Number(offset) / Number(limit)) + 1;

    return res.status(200).json({
      data: departments.rows,
      pagination: {
        totalItems: departments.count,
        totalPages,
        currentPage,
        itemsPerPage: Number(limit),
      },
    });
  } catch (error) {
    return next(error);
  }
}



