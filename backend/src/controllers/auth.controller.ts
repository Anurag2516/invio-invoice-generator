import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/db";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken";
import {
  LoginInput,
  loginSchema,
  RegisterInput,
  registerSchema,
} from "../schema/user.schema";
import { jwtCookieOptions } from "../config/cookie";

const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Session expired or invalid token.",
      });
      return;
    }

    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    if (!user) {
      res.status(404).json({
        message: "User not found.",
      });
      return;
    }

    res.status(200).json({
      id: userId,
      name: user.name,
      email: req.user.email,
    });
  } catch (error) {
    next(error);
  }
};

const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const parsedUser = registerSchema.safeParse(req.body);

    if (!parsedUser.success) {
      res.status(400).json({
        errors: parsedUser.error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      });
      return;
    }

    const { name, email, password }: RegisterInput = parsedUser.data;

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      res.status(409).json({
        message: "User with this email already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    generateToken(newUser.id, newUser.email, res);

    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const parsedUser = loginSchema.safeParse(req.body);

    if (!parsedUser.success) {
      res.status(400).json({
        errors: parsedUser.error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      });
      return;
    }

    const { email, password }: LoginInput = parsedUser.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    generateToken(user.id, user.email, res);

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

const logout = (req: Request, res: Response, next: NextFunction): void => {
  try {
    res.clearCookie("jwt", jwtCookieOptions);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const deleteAccount = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user.userId;

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export { getMe, register, login, logout, deleteAccount };
