import jwt from 'jsonwebtoken';
import bycrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../db/models/user.model';
import redisClient from '../db/config/redis';
import crypto from 'crypto';
import {NotFound} from '../utils/error';

dotenv.config();

const generateToken = (user: User, time: string, secret: string) => {
  try {
    const {id, role} = user;

    return jwt.sign({id, role}, secret, {expiresIn: time, subject: id});
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

  user.refreshTokens = {...user.refreshTokens, tokenHash};
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

const generateAccessToken = (user: User) => {
  const token = generateToken(
    user,
    '15m',
    process.env.ACCESS_TOKEN_SECRET || ''
  );

  if (!token) throw new Error('Error generating access token');

  return token;
};

const generateRefreshToken = async (user: User) => {
  const refreshToken = generateToken(
    user,
    '7d',
    process.env.REFRESH_TOKEN_SECRET || ''
  );

  if (!refreshToken) throw new Error('Error generating refresh token');

  if (!(await saveRefreshToken(user.id, refreshToken))) {
    throw new Error('Error saving refresh token');
  }
};

const resetPassword = async (email: string) => {
  try {
    const user = await User.findOne({where: {email}});
    if (!user) throw new NotFound('User not found');

    const token = crypto.randomBytes(20).toString('hex');
    // const emailServiceUrl = process.env.EMAIL_SERVICE_URL || 'http://email-service/send-email';

    const message = {
      to: email,
      subject: 'Password Reset',
      body: `Your password reset token is: ${token}`,
    };

    redisClient.publish('email-service', JSON.stringify(message));
  } catch (error) {
    throw error;
  }
};

export {generateAccessToken, generateRefreshToken, getUserData, resetPassword};
