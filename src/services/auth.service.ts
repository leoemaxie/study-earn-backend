import 'dotenv/config';
import {Conflict, Forbidden, NotFound, Unauthorized} from '@utils/error';
import {totp} from 'otplib';
import {sendEmail} from './email.service';
import User from '@models/user.model';
import Activity from '@models/activity.model';

const OTP_SECRETS = process.env.OTP_SECRETS;

const generateOTP = (email: string) => {
  const secret = OTP_SECRETS + email;
  totp.options = {step: 60};
  let otp = totp.generate(secret);

  if (totp.timeRemaining() <= 10) {
    let newTotp = totp.create(totp.allOptions());
    newTotp.options = {step: 60};
    otp = newTotp.generate(secret);
  }

  return otp;
};

const verifyOTP = (email: string, token: string) => {
  const secret = OTP_SECRETS + email;
  return totp.check(token, secret);
};

const sendOTP = async (email: string) => {
  const user = await User.findOne({where: {email}});

  if (!user) throw new NotFound('User not found');
  if (user.isBlockedUntil && user.isBlockedUntil > new Date()) {
    await Activity.create({
      userId: user.id,
      type: 'otp',
      description: 'OTP failed',
      metadata: {status: 'blocked'},
    });
    throw new Forbidden('User is blocked');
  }
  if (user.otpAttempts >= 5) {
    user.isBlockedUntil = new Date(Date.now() + 1000 * 60 * 60);
    user.otpAttempts = 0;
    await user.save();
    throw new Forbidden('Too many attempts. Please try again in 1 hour');
  }

  const message = {
    to: email,
    subject: 'One Time Password (OTP)',
    body: `Your One Time Password (OTP) is: ${generateOTP(email)}\nPlease use this OTP to verify your email address on the Study Earn Platform.\nExpires in 30 seconds. Do not share this OTP with anyone.`,
  };

  await user.increment('otpAttempts');
  await sendEmail(message);
};

const resetPassword = async (otp: string, email: string, password: string) => {
  // if (!verifyOTP(email, otp)) throw new Unauthorized('Invalid OTP');

  const user = await User.findOne({where: {email}});
  if (!user) throw new NotFound('User not found');

  await user.update({password});
  await Activity.create({
    userId: user.id,
    type: 'password',
    description: 'Password reset',
    metadata: {status: 'success'},
  });
};

const verifyEmail = async (email: string, token: string) => {
  if (!verifyOTP(email, token)) throw new Unauthorized('Invalid OTP');

  const user = await User.findOne({where: {email}});
  if (!user) throw new NotFound('User not found');
  if (user.isVerified) throw new Conflict("User's email is already verified");

  await user.update({isVerified: true});
  await Activity.create({
    userId: user.id,
    type: 'email',
    description: 'Email verified',
    metadata: {status: 'success'},
  });
};

export {resetPassword, sendOTP, verifyEmail};
