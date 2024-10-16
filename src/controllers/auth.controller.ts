import jwt from 'jsonwebtoken';
import User from '@models/user.model';
import Role from '@models/enum/role.model';
import {NextFunction, Request, Response} from 'express';
import {generateAccessToken, generateRefreshToken} from '@services/jwt.service';
import {BadRequest, Conflict, NotFound, Unauthorized} from '@utils/error';
import {verifyPassword} from '@utils/password';
import * as service from '@services/auth.service';

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
      'phoneNumber',
    ];

    if (!length || length !== 7) {
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

    await User.sequelize.transaction(async transaction => {
      const user = await User.create({...req.body}, {transaction});
      await Role[user.role].create({userId: user.id}, {transaction});
    });
    return res.status(201).json({message: 'User created successfully'});
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

    if (!(await verifyPassword(password, user.password))) {
      throw new Unauthorized('Invalid email or password');
    }

    return res.status(200).json({
      accessToken: generateAccessToken(user),
      refreshToken: await generateRefreshToken(user),
      expiresIn: 60 * 15,
      tokenType: 'Bearer',
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

export async function sendOTP(req: Request, res: Response, next: NextFunction) {
  try {
    const {email} = req.body;
    if (!email) throw new BadRequest('Missing email');

    await service.sendOTP(email);
    return res
      .status(200)
      .json({message: 'OTP sent successfully. Check your email'});
  } catch (error: unknown) {
    return next(error);
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {token, password, email} = req.body;
    if (!token || !password || !email)
      throw new BadRequest('Missing token or password');

    await service.resetPassword(token as string, email, password);
    return res.status(200).json({message: 'Password reset successful'});
  } catch (error: unknown) {
    return next(error);
  }
}

export async function verifyEmail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {token, email} = req.body;
    if (!token || !email) throw new BadRequest('Missing token or email');

    await service.verifyEmail(email, token as string);
    return res.status(200).json({message: 'Email verified successfully'});
  } catch (error: unknown) {
    return next(error);
  }
}
