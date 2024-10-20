import {Request, Response, NextFunction} from 'express';
import {Forbidden, UnprocessableEntity} from '@utils/error';
import {PaymentStatus, Role} from '@models/enum';
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
    const points = req.user['student.points'];

    if (role !== Role.STUDENT) throw new Forbidden('Access denied');

    console.log(req.user);

    if (points < 1000) {
      throw new UnprocessableEntity('Insufficient points');
    }

    let payment: Payment | null = null;
    Payment.sequelize.transaction(async t => {
      payment = await Payment.create(
        {
          userId: id,
          amount: points / 100,
          status: PaymentStatus.PENDING,
          transactionReference: '',
          paymentReference: '',
          paidOn: new Date(),
        },
        {transaction: t}
      );

      await Student.update({points: 0}, {where: {userId: id}, transaction: t});
    });

    return res.status(201).json({data: payment});
  } catch (error) {
    return next(error);
  }
}

export async function getPaymentHistory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user as User;
    const {id} = user;

    const payments = await Payment.findAll({where: {userId: id}});

    return res.status(200).json({data: payments});
  } catch (error) {
    return next(error);
  }
}
