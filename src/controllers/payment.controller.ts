import {Request, Response, NextFunction} from 'express';
import {BadRequest, Forbidden} from '@utils/error';
import {Role} from '@models/enum';
import Payment from '@models/payment.model';
import Student from '@models/student.model';
import User from '@models/user.model';

export async function redeemPoints(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user as User;
    const {id, role} = user;

    if (role !== Role.STUDENT) throw new Forbidden('Access denied');

    const {points} = req.user.student;

    if (points < 1000) {
      throw new BadRequest('Insufficient points');
    }

    let payment: Payment | null = null;
    Payment.sequelize.transaction(async (t) => {
      payment = await Payment.create({
      userId: id,
      amount: points / 100,
      status: 'pending',
      }, { transaction: t });

      await Student.update({points: 0}, {where: {userId: id}, transaction: t});
    });

    return res.status(201).json({data: payment});
    
    } catch (error) {
    return next(error);
  }
}
