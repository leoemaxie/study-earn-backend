import 'dotenv/config';
import jwt from 'jsonwebtoken';
import User from '@models/user.model';

const generateToken = (user: User, time: string, secret: string) => {
  try {
    const payload = {
      sub: user.id,
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

const generateAccessToken = (user: User) => {
  const token = generateToken(
    user,
    '60d',
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

  return refreshToken;
};

export {generateAccessToken, generateRefreshToken};
