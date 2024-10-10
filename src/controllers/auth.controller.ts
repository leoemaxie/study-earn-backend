import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../db/postgres/models/user.model';
import {NextFunction, Request, Response} from 'express';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../services/jwt.service';
import {resetPassword as resetPasswordService} from '../services/auth.service';
import {BadRequest, Conflict, NotFound, Unauthorized} from '../utils/error';

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const length = Object.keys(req.body || {}).length;
    const allowedFields = [
      'email',
      'password',
      'role',
      'firstName',
      'lastName',
      'department',
      // 'phoneNumber',
    ];

    if (!length || length !== 6) {
      throw new BadRequest('Invalid number of fields');
    }

    for (const field in req.body) {
      if (!allowedFields.includes(field)) {
        throw new BadRequest('Invalid field');
      }
    }

    if (await User.findOne({where: {email: req.body.email}})) {
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

    const user = await User.findOne({where: {email}});
    if (!user) throw new NotFound('User not found');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Unauthorized('Invalid credentials');

    return res.status(200).json({
      accessToken: generateAccessToken(user),
      refreshToken: await generateRefreshToken(user),
    });
  } catch (error: unknown) {
    return next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshToken = req.body.token;
    const email = req.body.email;

    if (!refreshToken || !email) throw new BadRequest('Missing token or email');

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

        return res.status(200).json({
          accessToken: generateAccessToken(user),
          expiresIn: 60 * 15,
          tokenType: 'Bearer',
        });
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
