import {NextFunction, Request, Response} from 'express';
import {BadRequest} from '@utils/error';
import {Role} from '@models/enum';
import {formatUser} from '@utils/format';
import RoleModel from '@models/enum/role.model';
import ALLOWED_FIELDS, {CUSTOM_FIELDS} from '@utils/fields';
import User from '@models/user.model';

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

    User.sequelize?.transaction(async transaction => {
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
    await User.destroy({where: {id: req.user?.id}});
    return res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
}

export async function getMates(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const mates = await User.findAll({
      where: {department: req.user?.department, role: Role.STUDENT},
      attributes: ['firstName', 'lastName', 'phoneNumber'],
      raw: true,
    });

    return res.status(200).json({data: mates});
  } catch (error) {
    return next(error);
  }
}
