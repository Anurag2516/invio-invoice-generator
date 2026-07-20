import { Response } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../middleware/auth.middleware";

export const generateToken = (userId: string, email: string, res: Response) => {
  const secretKey = process.env.JWT_SECRET_KEY;

  if (!secretKey) {
    throw new Error("JWT_SECRET_KEY is not defined");
  }

  const payload: JwtPayload = { userId, email };

  const token = jwt.sign(payload, secretKey, { expiresIn: "7d" });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  return token;
};
