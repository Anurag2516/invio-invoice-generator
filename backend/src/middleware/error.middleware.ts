import { NextFunction, Request, Response } from "express";

const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error(`[${req.method}] ${req.path}:`, error);
  res.status(500).json({ success: false, message: "Internal server error" });
};

export default errorHandler;
