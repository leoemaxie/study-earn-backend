import {Request, Response, NextFunction} from 'express';
import {BadRequest, NotFound} from '@utils/error';
import PaymentMethod from '@models/payment-method.model';
import { validateQuery } from '@utils/query';

export async function addPaymentMethod(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {accountNumber, accountName, bankName} = req.body;

    if (!accountNumber || !accountName || !bankName) {
      throw new BadRequest(
        'Account number, account name, and bank name are required'
      );
    }

    const existingPaymentMethod = await PaymentMethod.findOne({
      where: {accountNumber, userId: req.user.id},
    });

    if (existingPaymentMethod) {
      throw new BadRequest('Payment method already exists');
    }

    const paymentMethodData = {
      ...req.body,
      userId: req.user.id,
    };
    const paymentMethod = await PaymentMethod.create(paymentMethodData);
    return res.status(201).json({data: paymentMethod});
  } catch (error) {
    return next(error);
  }
}

export async function getPaymentMethod(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {id} = req.query;
    let paymentMethod;

    validateQuery(req, {id: 'string'});

    if (!id) {
      paymentMethod = await PaymentMethod.findAll({
        where: {userId: req.user.id},
      });
    } else {
      paymentMethod = await PaymentMethod.findOne({
        where: {id: String(id), userId: req.user.id},
        raw: true,
      });
    }
    if (!paymentMethod) {
      throw new NotFound('Payment method not found');
    }
    return res.status(200).json({data: paymentMethod});
  } catch (error) {
    return next(error);
  }
}

export async function updatePaymentMethod(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {id} = req.params;

    if (!id) {
      throw new BadRequest('Payment method ID is required');
    }

    Object.keys(req.body).forEach((key) => {
      if (!['accountNumber', 'accountName', 'bankName'].includes(key)) {
        throw new BadRequest('Invalid field');
      }
    });

    const paymentMethod = await PaymentMethod.findOne({
      where: {id: String(id), userId: req.user.id},
    });
    if (!paymentMethod) {
      throw new NotFound('Payment method not found');
    }
    await paymentMethod.update(req.body);
    return res.status(200).json({data: paymentMethod});
  } catch (error) {
    return next(error);
  }
}

export async function deletePaymentMethod(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {id} = req.query;

    validateQuery(req, {id: 'string'});

    if (id) {
      const paymentMethod = await PaymentMethod.findOne({
        where: {id: String(id), userId: req.user.id},
      });
      if (!paymentMethod) {
        throw new NotFound('Payment method not found');
      }
    } else {
      await PaymentMethod.destroy({where: {userId: req.user.id}});
    }

    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
}
