import {CUSTOM_FIELDS} from './fields';
import User from '@models/user.model';

export function formatUser(user: User) {
  const {password, isBlockedUntil, loginAttempts, otpAttempts, ...userData} = user;
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
