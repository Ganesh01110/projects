import { createClient } from "redis";

// Create Redis Client
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => {
  console.error("Redis Error:", err);
});

redisClient.connect(); // Connect asynchronously

/**
 * Cache user profile in Redis with expiration
 */
export const cacheUserProfile = async (userId: string, userData: any, expiry = 3600) => {
  await redisClient.setEx(`user:${userId}`, expiry, JSON.stringify(userData));
};

/**
 * Get cached user profile from Redis
 */
export const getCachedUserProfile = async (userId: string): Promise<any | null> => {
  const cachedData = await redisClient.get(`user:${userId}`);
  return cachedData ? JSON.parse(cachedData) : null;
};

/**
 * Invalidate cached user profile in Redis
 */
export const invalidateCachedUserProfile = async (userId: string) => {
  await redisClient.del(`user:${userId}`);
};

/**
 * Cache ride-related user data in Redis with expiration
 */
export const cacheRideUser = async (rideId: string, userId: string, expiry = 3600) => {
  await redisClient.setEx(`ride:${rideId}`, expiry, userId);
};

/**
 * Get cached ride-related user data from Redis
 */
export const getCachedRideUser = async (rideId: string): Promise<string | null> => {
  return await redisClient.get(`ride:${rideId}`);
};

/**
 * Invalidate cached ride-related user data in Redis
 */
export const invalidateCachedRideUser = async (rideId: string) => {
  await redisClient.del(`ride:${rideId}`);
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


/**
 * Cache Kafka message processing status to avoid duplicate processing
 */
export const cacheKafkaMessage = async (messageId: string, expiry = 300) => {
  await redisClient.setEx(`kafka-msg:${messageId}`, expiry, "processed");
};

/**
 * Check if a Kafka message has already been processed
 */
export const isKafkaMessageProcessed = async (messageId: string): Promise<boolean> => {
  const status = await redisClient.get(`kafka-msg:${messageId}`);
  return status === "processed";
};


export { redisClient };