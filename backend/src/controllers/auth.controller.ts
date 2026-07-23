import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/db";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken";
import {
  LoginInput,
  RegisterInput,
  registerSchema,
} from "../schemas/user.schema";

const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const parsedUser = registerSchema.safeParse(req.body.user);

    if (!parsedUser.success) {
      res.status(400).json({
        success: false,
        message: "Invalid User",
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
        success: false,
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
      success: true,
      message: "User registered successfully",
      data: { name: newUser.name, email: newUser.email },
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
    const parsedUser = registerSchema.safeParse(req.body.user);

    if (!parsedUser.success) {
      res.status(400).json({
        success: false,
        message: "Invalid User",
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
      res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
      return;
    }

    generateToken(user.id, user.email, res);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: { name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

const logout = (req: Request, res: Response, next: NextFunction): void => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
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

    res.status(200).json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export { register, login, logout, deleteAccount };
