import Department from '../db/postgres/models/department.model';
import { Request, Response, NextFunction } from 'express';

export async function getDepartments(req: Request, res: Response, next: NextFunction) {
  try {
    const { limit, offset, faculty } = req.query;

    const departments = await Department.findAndCountAll({
      limit: Number(limit),
      offset: Number(offset),
      where: { faculty: faculty as string },
      raw: true,
    });
    
    return res.status(200).json({ data: departments });
  } catch (error) {
    return next(error);
  }
}



