import { Request, Response ,RequestHandler  } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../../../infra/generated/auth-client";
import { logger } from "./auth.logger";
// import { sendEmail } from "../utils/sendEmail";  

import { redisClient, storeResetToken } from "./auth.redis";
import { publishForgotPassword, publishUserRegistered } from "./auth.kafkaClient";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your_refresh_secret_key";
const authClient = new PrismaClient();
//AuthClient is a class, not an instance.
// You need to instantiate it before using it

// Utility function for creating tokens
const generateToken = (userId: string, email: string) => {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: "1h" });
};

const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

/**
 * @route POST /auth/register
 * @desc Register a new user
 */
export const register   = async (req: Request, res: Response): Promise<void> => {
// export const register : RequestHandler  = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        logger.warn("All fields are required for registration.");
       res.status(400).json({ message: "All fields are required" });
       return;
    }

    const existingUser = await authClient.user.findUnique({ where: { email } });
    if (existingUser) {
       res.status(400).json({ message: "User already exists" });
       return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await authClient.user.create({
      data: { email, password: hashedPassword, name },
    });

    // Send welcome email
    // await sendEmail(email, "Welcome!", "Thanks for signing up!");
    // ✅ Publish event to Kafka for notification service
    await publishUserRegistered({ email, name });

     res.status(201).json({ message: "User registered successfully", userId: user.id });
  } catch (error:any) {
    // console.error("Register Error:", error);
    // return res.status(500).json({ message: "Server error" });
    if (error instanceof Error) {
      logger.error("Registration Error:", error.message);
       res.status(400).json({ error: error.message });
    } else {
      logger.error("Registration Error:", error);
       res.status(500).json({ message: "Server error" });
    } 
  }
};

/**
 * @route POST /auth/login
 * @desc Authenticate user & get token
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
        logger.warn("Email and password are required for login.");
       res.status(400).json({ message: "Email and password are required" });
       return;
    }

    const user = await authClient.user.findUnique({ where: { email } });
    if (!user) {
        logger.warn("Invalid credentials: User not found.");
       res.status(400).json({ message: "Invalid credentials" });
       return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        logger.warn("Invalid credentials: Password mismatch.");
       res.status(400).json({ message: "Invalid credentials" });
       return;
    }

    const token = generateToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id);

    // Store refreshttoken in Redis
    await redisClient.setEx(`refresh:${user.id}`, 604800, refreshToken); // Expires in 7 days

    res.status(200).json({ message: "Login successful", token, refreshToken, user });
  } catch (error:any) {
    // console.error("Login Error:", error);
    // res.status(500).json({ message: "Server error" });
    if (error instanceof Error) {
      logger.error("Login Error:", error.message);
       res.status(400).json({ error: error.message });
    } else {
      logger.error("Login Error:", error);
       res.status(500).json({ message: "Server error" });
    }
  }
};

/**
 * @route POST /auth/forgot-password
 * @desc Send password reset link
 */
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
        logger.warn("Email is required for password reset.");
       res.status(400).json({ message: "Email is required" });
       return;
    }

    const user = await authClient.user.findUnique({ where: { email } });
    if (!user) {
        logger.warn("User not found for password reset.");
       res.status(400).json({ message: "User not found" });
       return;
    }

    const resetToken = Math.random().toString(36).substring(2, 15);
    // await redisClient.setex(`reset:${email}`, 600, resetToken); // Expiry 10 min
    await storeResetToken(email, resetToken); // ✅ Using helper function

    // const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;
    // await sendEmail(email, "Password Reset", `Click here to reset: ${resetLink}`);

    // ✅ Publish event to Kafka for notification service
    await publishForgotPassword({ email, resetToken });

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error:any) {
    // console.error("Forgot Password Error:", error);
    // res.status(500).json({ message: "Server error" });
    if (error instanceof Error) {
      logger.error("Forgot Password Error:", error.message);
       res.status(400).json({ error: error.message });
    } else {
      logger.error("Forgot Password Error:", error);
       res.status(500).json({ message: "Server error" });
    }
  }
};


  