import {NextFunction, Request, Response} from 'express';
import {BadRequest, NotFound} from '../utils/error';
import {Role} from '../db/postgres/models/enum/role';
import {USER_FIELDS, STUDENT_FIELDS} from '../utils/allowedFields';
import User from '../db/postgres/models/user.model';
import Student from '../db/postgres/models/student.model';

export async function getUserData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {id} = req.user as User;
    const user = await User.findByPk(id);

    return res.status(200).json({data: user});
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
    const {id, role} = req.user as User;

    Object.keys(req.body).forEach(key => {
      if (role === Role.STUDENT && !STUDENT_FIELDS.includes(key)) {
        throw new BadRequest('Invalid field');
      }
      if (!USER_FIELDS.includes(key)) {
        throw new BadRequest('Invalid field');
      }
    });

    const user = await User.findByPk(id);
    if (!user) {
      throw new NotFound('User not found');
    }

    await user.update(req.body);

    return res.status(200).json({message: 'User updated successfully'});
  } catch (error) {
    return next(error);
  }
}

export async function deleteUserData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {id} = req.user as User;
    const user = await User.findByPk(id);
    if (!user) {
      throw new NotFound('User not found');
    }

    await user.destroy();

    return res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
}

export async function getStudents (req: Request, res: Response, next: NextFunction) {
  try {
    const {id} = req.user as User;
    const user = await Student.findByPk(id);
    if (!user) {
      throw new NotFound('User not found');
    }

    const mates = await Student.findAll({
      where: {id: 'user.department'},
    });

    return res.status(200).json({data: mates});
  } catch (error) {
    return next(error);
  }
}