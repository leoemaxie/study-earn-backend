import {createClient} from 'redis';

const redisClient = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
  },
});

redisClient.on('connect', () => {
  console.log('Redis connected');
});

redisClient.on('error', error => {
  console.log(`Error: ${error}`);
  throw error;
});

export default redisClient;
