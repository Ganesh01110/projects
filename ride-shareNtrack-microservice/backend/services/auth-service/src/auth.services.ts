// import { Request, Response } from "express";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { PrismaClient as AuthClient } from "../../../infra/generated/auth-client";
// import { redisClient } from "../redis/redisClient";
// import { sendEmail } from "../utils/sendEmail";  // Assume an email function

// const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// /**
//  * @route POST /auth/register
//  * @desc Register new user
//  */
// export const register = async (req: Request, res: Response) => {
//   try {
//     const { email, password, name } = req.body;

//     if (!email || !password || !name) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const existingUser = await AuthClient.user.findUnique({ where: { email } });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await AuthClient.user.create({
//       data: { email, password: hashedPassword, name },
//     });

//     await sendEmail(email, "Welcome!", "Thanks for signing up!");

//     res.status(201).json({ message: "User registered successfully", userId: user.id });
//   } catch (error) {
//     console.error("Register Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**
//  * @route POST /auth/login
//  * @desc Authenticate user & get token
//  */
// export const login = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "Email and password are required" });
//     }

//     const user = await AuthClient.user.findUnique({ where: { email } });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

//     res.status(200).json({ message: "Login successful", token, user });
//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**
//  * @route POST /auth/forgot-password
//  * @desc Send password reset link
//  */
// export const forgotPassword = async (req: Request, res: Response) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }

//     const user = await AuthClient.user.findUnique({ where: { email } });
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     const resetToken = Math.random().toString(36).substring(2, 15);
//     await redisClient.setex(`reset:${email}`, 600, resetToken); // Expiry 10 min

//     const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;
//     await sendEmail(email, "Password Reset", `Click here to reset: ${resetLink}`);

//     res.status(200).json({ message: "Password reset email sent" });
//   } catch (error) {
//     console.error("Forgot Password Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
