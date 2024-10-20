import {NextFunction, Request, Response} from 'express';
import {BadRequest} from '@utils/error';
import {del} from '@services/user.file.service';
import {formatUser} from '@utils/format';
import RoleModel from '@models/enum/role.model';
import ALLOWED_FIELDS, {CUSTOM_FIELDS} from '@utils/fields';
import User from '@models/user.model';
import Course from '@models/course.model';
import * as sns from '@services/notification.service';
import Department from '@models/department.model';

export function getUserData(req: Request, res: Response, next: NextFunction) {
  try {
    return res.status(200).json({data: formatUser(req.user as User)});
  } catch (error) {
    return next(error);
  }
}

export async function updateUserData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {password, ...user} = req.user as User;
    const {id, role} = user;
    const fields = ALLOWED_FIELDS[role];
    const customFields = CUSTOM_FIELDS[role];

    Object.keys(req.body).forEach(key => {
      if (!fields.includes(key)) {
        throw new BadRequest('Invalid field');
      }
    });

    const userData = {};
    const roleData = {};

    Object.keys(req.body).forEach(key => {
      if (customFields.includes(key)) {
        roleData[key] = req.body[key];
      } else {
        userData[key] = req.body[key];
      }
    });

    await User.sequelize.transaction(async transaction => {
      await User.update(userData, {where: {id}, transaction});
      await RoleModel[role].update(roleData, {
        where: {userId: id},
        transaction,
      });
    });

    const updated = await User.findOne({
      where: {id},
      include: [{model: RoleModel[role], as: role}],
      raw: true,
    });

    return res.status(200).json({data: formatUser(updated as User)});
  } catch (error) {
    return next(error);
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await del(req.user, 'picture');
    await User.destroy({where: {id: req.user?.id}});
    return res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
}

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      limit = 50,
      offset = 0,
      role,
      department,
      faculty,
      order,
    } = req.query;
    const queryOptions: any = {
      limit: Number(limit),
      offset: Number(offset),
      raw: true,
      where: {},
      order:
        typeof order === 'string'
          ? [order.split(',')]
          : [['department', 'DESC']],
    };

    if (faculty) queryOptions.where.facultyId = String(faculty);
    if (department) queryOptions.where.department = String(department);
    if (role) queryOptions.where.role = String(role);

    const users = await User.findAndCountAll({
      ...queryOptions,
      attributes: ['firstName', 'lastName', 'phoneNumber', 'email'],
    });
    const totalPages = Math.ceil(users.count / Number(limit));
    const currentPage = Math.floor(Number(offset) / Number(limit)) + 1;
    const url = req.protocol + '://' + req.get('host') + req.originalUrl;

    return res.status(200).json({
      metadata: {
        totalItems: users.count,
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
      data: users.rows,
    });
  } catch (error) {
    return next(error);
  }
}

export async function sendNotification(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {title, body} = req.body;

    await sns.sendNotification({
      title,
      body,
    });
    return res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
}

export async function getCourses(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const courses = await Course.findAll({
      include: [
        {
          model: Department,
          where: {name: req.user.department},
          attributes: [],
        },
      ],
      attributes: ['id', 'name', 'code', 'unit', 'description'],
      raw: true,
    });

    return res.status(200).json({data: courses});
  } catch (error) {
    return next(error);
  }
}
