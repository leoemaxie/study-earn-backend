import {CUSTOM_FIELDS} from './fields';
import {Error as MongooseError} from 'mongoose';
import User from '@models/user.model';

export function formatUser(user: User) {
  const {password, isBlockedUntil, loginAttempts, otpAttempts, ...userData} =
    user;
  const formattedData = Object.keys(userData).reduce(
    (acc, key) => {
      if (key.startsWith(`${user.role}.`)) {
        acc[key.replace(`${user.role}.`, '')] = userData[key];
      } else {
        acc[key] = userData[key];
      }
      return acc;
    },
    {} as Record<string, any>
  );

  formattedData.updatedAt = new Date(
    Math.max(
      new Date(user.updatedAt).getTime(),
      new Date(user[`${user.role}.updatedAt`]).getTime()
    )
  );

  return formattedData;
}

export function transformFields(role: string, data: Record<string, any>) {
  const customFields = CUSTOM_FIELDS[role];

  return Object.keys(data).reduce(
    (acc, key) => {
      if (customFields.includes(key)) {
        acc[`${role}.${key}`] = data[key];
      } else {
        acc[key] = data[key];
      }
      return acc;
    },
    {} as Record<string, any>
  );
}

export function formatError(error: MongooseError) {
  if (error instanceof MongooseError.ValidationError) {
    const errors = Object.values(error.errors);
    const length = errors.length;
    return {
      error: {
        name: 'validationError',
        message: `You have ${length} errors in your request`,
        details: errors.map(({message}) => message),
      },
    };
  }

  if (error instanceof MongooseError.CastError) {
    return {error: {name: 'CastError', message: 'Invalid value provided'}};
  }

  if (error.message.includes('duplicate key error collection')) {
    const match = error.message.match(/: (.+)$/);
    return {
      error: {
        name: 'DuplicateError',
        message: 'Duplicate value provided',
        details: match ? match[1] : 'No details available',
      },
    };
  }

  return error.message;
}
