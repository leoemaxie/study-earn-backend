import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {IUser} from '../db/schema/user.schema';
import {saveRefreshToken} from './redis.service';
import { Unauthorized } from '../errors/error';

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

const verifyToken = async (token: string) : Promise<IUser> => {
  let user: IUser | null = null;
  
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_PUBLIC_KEY || '',
    {algorithms: ['RS256']},
    (error: unknown, decoded: any) => {
      if (error) throw new Unauthorized('Invalid token');
      user = decoded;
    }
  );

  if (!user) throw new Unauthorized('Invalid token');
  return user;
};

export {generateAccessToken, generateRefreshToken, verifyToken};
