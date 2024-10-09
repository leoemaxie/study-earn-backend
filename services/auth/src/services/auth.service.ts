import crypto from 'crypto';
import { sendToQueue } from './queue.service';
import {User} from '../db/schema/user.schema';
import {NotFound} from '../errors/error';

const resetPassword = async (email: string) => {
  const user = await User.findOne({email});
  if (!user) throw new NotFound('User not found');

  const token = crypto.randomBytes(20).toString('hex');
  // const emailServiceUrl = process.env.EMAIL_SERVICE_URL || 'http://email-service/send-email';

  const message = {
    to: email,
    subject: 'Password Reset',
    body: `Your password reset token is: ${token}`,
  };

  await sendToQueue('email', message.toString());
};

export {resetPassword};
