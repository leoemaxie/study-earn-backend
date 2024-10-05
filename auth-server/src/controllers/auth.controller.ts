import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import redisClient from '../db/config/redis';
import User from '../db/models/user.model';
import {NextFunction, Request, Response} from 'express';
import {
  generateAccessToken,
  generateRefreshToken,
  getUserData,
  resetPassword as resetPasswordService,
} from '../services/auth.service';
import {BadRequest, Conflict, NotFound, Unauthorized} from '../utils/error';
import { access } from 'fs';

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const length = Object.keys(req.body || {}).length;

    if (!length || length != 3) {
      throw new BadRequest('Invalid number of fields');
    }

    const {email, password, role} = req.body;

    if (!email || !password || !role) {
      throw new BadRequest('Missing fields');
    }

    if (await User.findOne({where: {email}})) {
      throw new Conflict('User already exists');
    }

    await User.create({...req.body});
    res.status(201).json({message: 'User created successfully'});
  } catch (error: unknown) {
    return next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const length = Object.keys(req.body || {}).length;
    if (length != 2) throw new BadRequest('Invalid number of fields');

    const {email, password} = req.body;
    if (!email || !password) throw new BadRequest('Missing email or password');

    const user = await User.findOne({where: {email}});
    if (!user) throw new NotFound('User not found');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Unauthorized('Invalid Credentials');

    return res.status(200).json({
      accessToken: generateAccessToken(user),
      refreshToken: generateRefreshToken(user),
    });
  } catch (error: unknown) {
    return next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshToken = req.body.token;
    const {email} = req.user as User;

    if (!refreshToken || !email) return res.sendStatus(401);

    const userData = await getUserData(email);
    const refreshTokens = userData.refreshTokens;

    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

    userData.refreshTokens = refreshTokens.filter((token: string) =>
      bcrypt.compare(refreshToken, token)
    );

    await redisClient.set(email, JSON.stringify(userData), {
      EX: 60 * 60 * 24 * 7,
    });

    return res.sendStatus(204);
  } catch (error: unknown) {
    return next(error);
  }
}

export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const refreshToken = req.body.token;
    if (!refreshToken) return next(new Unauthorized());

    return jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || '',
      async (error: any, user: any) => {
        if (error) return next(new Unauthorized());

        // const userData = await getUserData(user.id);
        // const refreshTokens = userData.refreshTokens;

        // if (!refreshTokens.includes(refreshToken)) return next(new Unauthorized());

        return res.status(200).json({ accessToken: generateAccessToken(user)});
      })
  } catch (error: unknown) {
    next(error);
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {email} = req.body;
    if (!email) throw new BadRequest('Missing email');

    await resetPasswordService(email);
    return res.status(200).json({message: 'Password reset link sent'});
  } catch (error: unknown) {
    return next(error);
  }
}