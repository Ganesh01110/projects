import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../../../infra/generated/auth-client";

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
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await authClient.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
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
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @route POST /auth/login
 * @desc Authenticate user & get token
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await authClient.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id);

    // Store refreshttoken in Redis
    await redisClient.setEx(`refresh:${user.id}`, 604800, refreshToken); // Expires in 7 days

    res.status(200).json({ message: "Login successful", token, refreshToken, user });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @route POST /auth/forgot-password
 * @desc Send password reset link
 */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await authClient.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const resetToken = Math.random().toString(36).substring(2, 15);
    // await redisClient.setex(`reset:${email}`, 600, resetToken); // Expiry 10 min
    await storeResetToken(email, resetToken); // ✅ Using helper function

    // const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;
    // await sendEmail(email, "Password Reset", `Click here to reset: ${resetLink}`);

    // ✅ Publish event to Kafka for notification service
    await publishForgotPassword({ email, resetToken });

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


  