import bycrypt from 'bcrypt';

export async function hashPassword(password: string) {
  return await bycrypt.hash(password, 10);
}
