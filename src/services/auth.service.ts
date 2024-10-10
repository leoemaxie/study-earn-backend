import dotenv from 'dotenv';
import crypto from 'crypto';
import User from '../db/postgres/models/user.model';
import {NotFound} from '../utils/error';
import {sendSMS} from './sms.service'

dotenv.config();

const resetPassword = async (email: string) => {
  try {
    const user = await User.findOne({where: {email}});
    if (!user) throw new NotFound('User not found');

    const token = crypto.randomBytes(20).toString('hex');
    const message = {
      to: email,
      subject: 'Password Reset',
      body: `Your password reset token is: ${token}`,
    };

    await sendSMS(message);
  } catch (error) {
    throw error;
  }
};

export {resetPassword};
