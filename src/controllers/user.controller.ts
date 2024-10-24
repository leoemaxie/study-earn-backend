import {NextFunction, Request, Response} from 'express';
import {BadRequest, ServerError} from '@utils/error';
import {del} from '@services/user.file.service';
import {formatUser} from '@utils/format';
import {computeMetadata} from '@utils/pagination';
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
    const userData = {};
    const roleData = {};

    Object.keys(req.body).forEach(key => {
      if (!fields.includes(key)) {
        throw new BadRequest('Invalid field');
      }
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
      id,
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
    if (id) queryOptions.where.id = String(id);
    if (department) queryOptions.where.department = String(department);
    if (role) queryOptions.where.role = String(role);

    const users = await User.findAndCountAll({
      ...queryOptions,
      attributes: [
        'firstName',
        'lastName',
        'phoneNumber',
        'email',
        'role',
        'department',
      ],
    });

    return res.status(200).json({
      metadata: computeMetadata(
        req,
        users.count,
        Number(limit),
        Number(offset)
      ),
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
    const sent = await sns.sendNotification({
      title,
      body,
    });
    if (!sent) return next(new ServerError('Failed to send notification'));
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
