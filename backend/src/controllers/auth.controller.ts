import { Request, Response } from "express";
import { prisma } from "../config/db";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken";

const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const userExists = await prisma.user.findUnique({
    where: { email: email },
  });

  if (userExists) {
    res.status(409).json({ success: false, message: "User with this email already exists", });
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userRegistered = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = generateToken(userRegistered.id, res);

    res.status(200).json({
      success: true,
      message: "User registered successfully",
      token,
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    res.status(400).json({ success: false, error: "Email does not exist" });
  } else {
    const isPasswordValid = bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      res.status(401).json({ success: false, error: "Invalid email or password" });

    const token = generateToken(user.id, res);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      data: { email: user.email, password: user.password },
    });
  }
};

const logout = async (req: Request, res:Response) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
};

export { register, login, logout };