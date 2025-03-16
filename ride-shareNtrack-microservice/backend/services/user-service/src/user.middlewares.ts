import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request Type to include "user"
export interface AuthRequest extends Request {
  user?: { id: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const validateUserUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { name, bio } = req.body;

  if (name && typeof name !== "string") {
    return res.status(400).json({ message: "Invalid name format" });
  }

  if (bio && typeof bio !== "string") {
    return res.status(400).json({ message: "Invalid bio format" });
  }

  next();
};
