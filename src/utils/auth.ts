import jwt from 'jsonwebtoken';
import bycrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/User.model';
import redisClient from '../db/config/redis';

dotenv.config();

const generateToken = async (
  user: User,
  time: string,
  secret: string,
  cb: (token: string) => Promise<void>
) => {
  jwt.sign({user}, secret, {expiresIn: time}, (err, token) => {
    if (err) {
      throw err;
    }
    cb(token as string);
  });
};

const saveRefreshToken = async (userId: string, refreshToken: string) => {
  const user = await getUserData(userId);
  const tokenHash = await bycrypt.hash(refreshToken, 10);

  user.refreshTokens = {...user.refreshTokens, tokenHash};
  await redisClient.set(userId, JSON.stringify(user), {EX: 60 * 60 * 24 * 7});
};

const getUserData = async (userId: string) => {
  const userData = await redisClient.get(userId);

  if (!userData) {
    throw new Error('User not found');
  }

  return JSON.parse(userData);
};

const generateAccessToken = async (
  user: User,
  cb: (accessToken: string) => Promise<void>
) => {
  generateToken(
    user,
    '15m',
    process.env.ACCESS_TOKEN_SECRET || '',
    async accessToken => {
      await cb(accessToken);
    }
  );
};

const generateRefreshToken = async (
  user: User,
  cb: (refreshToken: string) => Promise<void>
) => {
  await generateToken(
    user,
    '7d',
    process.env.REFRESH_TOKEN_SECRET || '',
    async refreshToken => {
      await saveRefreshToken(user.matricNo, refreshToken);
      await cb(refreshToken);
    }
  );
};

export {generateAccessToken, generateRefreshToken, getUserData};
