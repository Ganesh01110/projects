import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { logger } from "./user.logger";

// Extend Express Request Type to include "user"
export interface AuthRequest extends Request {
  user?: { id: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    logger.warn("Unauthorized access attempt without token.");
     res.status(401).json({ message: "Unauthorized" });
     return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    req.user = decoded;
     next();
  } catch (error) {
    logger.error("Invalid token:", error);
     res.status(401).json({ message: "Invalid token" });
     return;
  }
};

export const validateUserUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { name, bio } = req.body;

  if (name && typeof name !== "string") {
    logger.warn("Invalid name format:", name);
     res.status(400).json({ message: "Invalid name format" });
    return;
  }

  if (bio && typeof bio !== "string") {
    logger.warn("Invalid bio format:", bio);
     res.status(400).json({ message: "Invalid bio format" });
     return;
  }

  next();
};
