import jwt from 'jsonwebtoken';
import bycrypt from 'bcrypt';
import dotenv from 'dotenv';
import redisClient from '../db/config/redis';
import crypto from 'crypto';
import {IUser, User} from '../db/schema/user.schema';
import {NotFound} from '../errors/error';

dotenv.config();

const generateToken = (user: IUser, time: string, secret: string) => {
  try {
    const payload = {
      sub: user.sub,
      role: user.role,
    };

    return jwt.sign(payload, secret, {
      expiresIn: time,
      algorithm: 'RS256',
    });
  } catch (error) {
    return null;
  }
};

const saveRefreshToken = async (userId: string, refreshToken: string) => {
  redisClient.on('error', _ => {
    return false;
  });
  const user = await getUserData(userId);
  const tokenHash = await bycrypt.hash(refreshToken, 10);

  user.refreshTokens = [...user.refreshTokens, tokenHash];
  await redisClient.set(userId, JSON.stringify(user), {EX: 60 * 60 * 24 * 7});
  return true;
};

const getUserData = async (userId: string) => {
  redisClient.on('error', _ => {
    return null;
  });
  const userData = await redisClient.get(userId);

  if (!userData) return {refreshTokens: []};

  return JSON.parse(userData);
};

const generateAccessToken = (user: IUser) => {
  const token = generateToken(
    user,
    '15m',
    process.env.ACCESS_TOKEN_SECRET || ''
  );

  if (!token) throw new Error('Error generating access token');

  return token;
};

const generateRefreshToken = async (user: IUser) => {
  const refreshToken = generateToken(
    user,
    '7d',
    process.env.REFRESH_TOKEN_SECRET || ''
  );

  if (!refreshToken) throw new Error('Error generating refresh token');

  if (!(await saveRefreshToken(user.sub.toString(), refreshToken))) {
    throw new Error('Error saving refresh token');
  }

  return refreshToken;
};

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

  redisClient.publish('email-service', JSON.stringify(message));
};

export {generateAccessToken, generateRefreshToken, getUserData, resetPassword};
