import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import redisClient from '../db/config/redis';
import {User} from '../db/schema/user.schema';
import {NextFunction, Request, Response} from 'express';
import {
  generateAccessToken,
  generateRefreshToken,
  getUserData,
  resetPassword as resetPasswordService,
} from '../services/auth.service';
import {BadRequest, Conflict, NotFound, Unauthorized} from '../errors/error';

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const length = Object.keys(req.body || {}).length;

    if (!length || length !== 3) {
      throw new BadRequest('Invalid number of fields');
    }

    const {email, password, role} = req.body;

    if (!email || !password || !role) {
      throw new BadRequest('Missing fields');
    }

    if (await User.findOne({email})) {
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
    if (length !== 2) throw new BadRequest('Invalid number of fields');

    const {email, password} = req.body;
    if (!email || !password) throw new BadRequest('Missing email or password');

    const user = await User.findOne({email});
    if (!user) throw new NotFound('User not found');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Unauthorized('Invalid credentials');

    return res.status(200).json({
      access_token: generateAccessToken(user),
      refresh_token: await generateRefreshToken(user),
    });
  } catch (error: unknown) {
    return next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshToken = req.body.token;
    const email = req.body.email;

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
      process.env.REFRESH_TOKEN_PUBLIC_KEY || '',
      async (error: any, user: any) => {
        if (error) return next(new Unauthorized());

        const userData = await getUserData(user.sub);
        const refreshTokens = userData.refreshTokens;

        for (const token of refreshTokens) {
          if (await bcrypt.compare(refreshToken, token)) {
            return res.status(200).json({
              access_token: generateAccessToken(user),
              expires_in: 60 * 15,
              token_type: 'Bearer',
            });
          }
        }

        return next(new Unauthorized());
      }
    );
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
