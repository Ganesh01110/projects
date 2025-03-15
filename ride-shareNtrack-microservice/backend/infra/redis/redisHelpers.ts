import { redisClient } from "./redisClient";

/**
 * Store password reset token in Redis with expiration
 */
export const storeResetToken = async (email: string, token: string, expiry = 600) => {
  await redisClient.setEx(`reset:${email}`, expiry, token);
};

/**
 * Get password reset token from Redis
 */
export const getResetToken = async (email: string) => {
  return await redisClient.get(`reset:${email}`);
};

/**
 * Implement Rate Limiting (returns true if rate limit exceeded)
 */
export const isRateLimited = async (ip: string, limit = 10, window = 60): Promise<boolean> => {
  const key = `rate:${ip}`;
  const requests = await redisClient.incr(key);
  
  if (requests === 1) {
    await redisClient.expire(key, window);
  }

  return requests > limit;
};
