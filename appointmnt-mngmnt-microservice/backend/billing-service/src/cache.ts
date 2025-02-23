import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL;

const redisClient = createClient({ url: REDIS_URL });

redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.connect().then(() => console.log('Connected to Redis'));

export const setCache = async (key: string, value: any, ttl: number = 3600) => {
  await redisClient.set(key, JSON.stringify(value), { EX: ttl });
  console.log(`Cache set for key: ${key}`);
};

export const getCache = async (key: string) => {
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
};

export const invalidateCache = async (key: string) => {
  await redisClient.del(key);
  console.log(`Cache invalidated for key: ${key}`);
};
