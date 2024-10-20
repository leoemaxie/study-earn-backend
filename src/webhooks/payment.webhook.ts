import 'dotenv/config';
import {Request, Response, NextFunction} from 'express';
import Payment from '@models/payment.model';
import crypto from 'crypto';
import {Unauthorized} from '@utils/error';

const SECRET = process.env.MONNIFY_SECRET!;

export async function handleSuccessfulPayment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.ip !== process.env.MONNIFY_IP) {
      throw new Unauthorized('Unauthorized IP address');
    }
    const hash = crypto
      .createHmac('sha512', SECRET)
      .update(req.body)
      .digest('hex');

    if (hash !== req.headers['monnify-signature']) {
      return res.status(400).json({message: 'Invalid signature'});
    }

    if (
      await Payment.findOne({
        where: {transactionReference: req.body.transactionReference},
      })
    ) {
      return res.status(200).json({message: 'Payment already received'});
    }

    await Payment.create({
      userId: req.body.customer.customerId,
      amount: req.body.amountPaid,
      status: req.body.paymentStatus,
      transactionReference: req.body.transactionReference,
      paymentReference: req.body.paymentReference,
      paidOn: req.body.paidOn,
    });
    return res.status(200).json({message: 'Payment received'});
  } catch (error) {
    return next(error);
  }
}
