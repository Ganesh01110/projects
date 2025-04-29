import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const user = req.headers["user"];
  if (!user) { 
    res.status(401).json({ message: "Unauthorized" });
    return;
}

  req.user = JSON.parse(user as string);
  next();
};
