import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = req.headers["user"];
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  req.user = JSON.parse(user as string);
  next();
};
