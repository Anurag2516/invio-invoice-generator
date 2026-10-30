import { NextFunction, Request, Response } from "express";
import { UpdateUserInput, updateUserSchema } from "../schema/user.schema";
import { prisma } from "../config/db";

const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      omit: {
        password: true,
      },
    });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const parsedProfile = updateUserSchema.safeParse(req.body);

    if (!parsedProfile.success) {
      res.status(400).json({
        errors: parsedProfile.error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      });
      return;
    }

    const profileData: UpdateUserInput = parsedProfile.data;
    const userId = req.user?.userId;

    const updateProfile = await prisma.user.update({
      where: { id: userId },
      data: { ...profileData },
      omit: { password: true },
    });

    res.status(200).json(updateProfile);
  } catch (error) {
    next(error);
  }
};

export { getProfile, updateProfile };
