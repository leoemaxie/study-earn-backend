import 'dotenv/config';
import User from '@models/user.model';
import {NotFound} from '@utils/error';
import {totp} from 'otplib';
import {sendEmail} from './email.service';

const OTP_SECRETS = process.env.OTP_SECRETS;

const generateOTP = (email: string) => {
  const secret = OTP_SECRETS + email;
  return totp.generate(secret);
};

const verifyOTP = (email: string, token: string) => {
  const secret = OTP_SECRETS + email;
  return totp.check(token, secret);
};

const sendOTP = async (email: string) => {
  const user = await User.findOne({where: {email}});
  if (!user) throw new NotFound('User not found');

  const message = {
    to: email,
    subject: 'One Time Password (OTP)',
    body: `Your One Time Password (OTP) is: ${generateOTP(email)}\nPlease use this OTP to verify your email address on the Study Earn Platform.\nExpires in 30 seconds. Do not share this OTP with anyone.`,
  };

  await sendEmail(message);
};

const resetPassword = async (otp: string, email: string, password: string) => {
  if (!verifyOTP(email, otp)) throw new NotFound('Invalid OTP');

  const user = await User.findOne({where: {email}});
  if (!user) throw new NotFound('User not found');

  await user.update({password});
};

const verifyEmail = async (email: string, token: string) => {
  if (!verifyOTP(email, token)) throw new NotFound('Invalid OTP');

  const user = await User.findOne({where: {email}});
  if (!user) throw new NotFound('User not found');

  await user.update({isVerified: true});
};

export {resetPassword, sendOTP, verifyEmail};
