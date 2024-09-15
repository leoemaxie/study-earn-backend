import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/User';
import {NextFunction, Request, Response} from 'express';
import {
  generateAccessToken,
  generateRefreshToken,
  getUserData,
} from '../utils/auth';
import redisClient from '../db/redis';

dotenv.config();

export async function register(req: Request, res: Response) {
  try {
    const {matricNo, password} = req.body;

    if (!matricNo || !password) {
      return res.status(400).json({message: 'Missing Matric No or Password'});
    }

    const userExists = await User.findOne({where: {matricNo}});
    if (userExists) {
      res.status(409).json({message: 'User already exists'});
      return;
    }

    const passwordRegex = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
    );
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({matricNo, password: passwordHash});
    return res.status(201).json({user});
  } catch (error: any) {
    return res.sendStatus(500);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const {matricNo, password} = req.body;
    if (!matricNo || !password) {
      return res.status(400).json({message: 'Missing Matric No or Password'});
    }

    const user = await User.findOne({where: {matricNo}});
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({message: 'Invalid credentials'});
    }

    return generateAccessToken(user, async (accessToken: string) => {
      await generateRefreshToken(user, async (refreshToken: string) => {
        res.status(200).json({accessToken, refreshToken});
      });
    });
  } catch (error: any) {
    return next(error);
  }
}

export async function authenticateToken(
  req: Request,
  res: Response,
  next: any
) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  return jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET || '',
    (error: any, user: any) => {
      if (error) return res.sendStatus(403);
      req.user = user;
      return next();
    }
  );
}

export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const refreshToken = req.body.token;
    if (!refreshToken) return res.sendStatus(401);

    return jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || '',
      async (error: any, user: any) => {
        if (error) return res.sendStatus(403);

        const userData = await getUserData(user.matricNo);
        const refreshTokens = userData.refreshTokens;

        if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

        return generateAccessToken(user, async (accessToken: string) => {
          res.status(200).json({accessToken});
        });
      }
    );
  } catch (error: any) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshToken = req.body.token;
    const {matricNo} = req.user as User;

    if (!refreshToken || !matricNo) return res.sendStatus(401);

    const userData = await getUserData(matricNo);
    const refreshTokens = userData.refreshTokens;

    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

    userData.refreshTokens = refreshTokens.filter(
      (token: string) => bcrypt.compare(refreshToken, token)
    );

    await redisClient.set(matricNo, JSON.stringify(userData), {
      EX: 60 * 60 * 24 * 7,
    });

    return res.sendStatus(204);
  } catch (error: any) {
    return next(error);
  }
}
