import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Database } from "../config/database";
import { createError } from "./errorHandler";

const prisma = Database.getInstance();

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw createError("Access token required", 401);
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw createError("Server configuration error", 500);
    }

    const decoded = jwt.verify(token, jwtSecret) as { id: string; email: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true }
    });

    if (!user) {
      throw createError("User not found", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(createError("Invalid token", 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(createError("Token expired", 401));
    } else {
      next(error);
    }
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (token) {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        return next();
      }

      const decoded = jwt.verify(token, jwtSecret) as { id: string; email: string };
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, name: true }
      });
      req.user = user || undefined;
    }

    next();
  } catch (error) {
    next();
  }
};
