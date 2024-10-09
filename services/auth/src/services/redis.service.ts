import bcrypt from 'bcrypt';
import redisClient from '../db/config/redis';

const getUserData = async (userId: string) => {
  redisClient.on('error', _ => {
    return null;
  });
  const userData = await redisClient.get(userId);

  if (!userData) return {refreshTokens: []};

  return JSON.parse(userData);
};

const saveRefreshToken = async (userId: string, refreshToken: string) => {
  redisClient.on('error', _ => {
    return false;
  });
  const user = await getUserData(userId);
  const tokenHash = await bcrypt.hash(refreshToken, 10);

  user.refreshTokens = [...user.refreshTokens, tokenHash];
  await redisClient.set(userId, JSON.stringify(user), {EX: 60 * 60 * 24 * 7});
  return true;
};

export {getUserData, saveRefreshToken};
