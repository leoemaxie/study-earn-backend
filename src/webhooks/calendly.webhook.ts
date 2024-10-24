import 'dotenv/config';
import crypto from 'crypto';
import {Request, Response, NextFunction} from 'express';
import {BadRequest} from '@utils/error';

const WEBHOOK_SIGNATURE = process.env.CALENDLY_WEBHOOK_SIGNATURE as string;

export function calendlyWebhook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const calendlySignature = req.get('Calendly-Webhook-Signature') || '';
    const {t, signature} = calendlySignature.split(',').reduce(
      (acc, currentValue) => {
        const [key, value] = currentValue.split('=');
        if (key === 't') acc.t = value;
        if (key === 'v1') acc.signature = value;
        return acc;
      },
      {
        t: '',
        signature: '',
      }
    );

    if (!t || !signature) throw new BadRequest('Invalid Signature');

    const data = t + '.' + JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', WEBHOOK_SIGNATURE)
      .update(data, 'utf8')
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new BadRequest('Invalid Signature');
    }

    const threeMinutes = 180000;
    const tolerance = threeMinutes;
    const timestampMilliseconds = Number(t) * 1000;

    if (timestampMilliseconds < Date.now() - tolerance) {
      throw new BadRequest(
        "Invalid Signature. The signature's timestamp is outside of the tolerance zone."
      );
    }
    return res.status(200).end();
  } catch (error: unknown) {
    return next(error);
  }
}
