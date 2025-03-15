import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../../../infra/generated/auth-client";
import rateLimit from "express-rate-limit";
import { isRateLimited } from "./auth.redis";



export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.connection.remoteAddress;
//   const key = `rate:${ip}`;
  
  if (await isRateLimited(ip as string)) {
    return res.status(429).json({ message: "Too many requests, slow down!" });
  }

  next();
};

const authClient = new PrismaClient();

export const dbHealthCheck = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authClient.$queryRaw`SELECT 1`;
    next();
  } catch (error) {
    console.error("Database Connection Error:", error);
    return res.status(503).json({ message: "Database unavailable" });
  }
};



// export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
//   const ip = req.ip || req.connection.remoteAddress;
//   const key = `rate:${ip}`;
  
//   const requests = await redisClient.incr(key);
//   if (requests === 1) {
//     await redisClient.expire(key, 60); // 60 seconds window
//   }

//   if (requests > 10) {
//     return res.status(429).json({ message: "Too many requests, slow down!" });
//   }

//   next();
// };




export const authRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per minute
  message: { message: "Too many attempts, please try again later." },
});

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
