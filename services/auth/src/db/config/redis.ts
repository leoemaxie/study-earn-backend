import {createClient} from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('connect', () => {
  console.log('Redis connected');
});

redisClient.on('error', error => {
  console.error(error);
});

(async () => {
  await redisClient.connect();
})();

export default redisClient;
