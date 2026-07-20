import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  email: string;
}

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  let token: string | undefined;

  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res.status(401).json({ success: false, message: "No token provided" });
    return;
  }

  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) {
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded as unknown as JwtPayload;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ success: false, message: "Token expired" });
    } else {
      res.status(401).json({ success: false, message: "Invalid token" });
    }
  }
}