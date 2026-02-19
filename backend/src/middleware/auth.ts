import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { createError } from "./errorHandler";

const prisma = new PrismaClient();

interface JWTPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

// AuthRequest is now just an alias for Request since we extended it globally
export type AuthRequest = Request;

// Validate JWT_SECRET exists at module load
if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET environment variable is required in production");
}

export const authenticate = async (
  req: Request,
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

    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true }
    });

    if (!user) {
      throw createError("User not found", 401);
    }

    req.user = { id: user.id, email: user.email, name: user.name || "" };
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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (token && process.env.JWT_SECRET) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, name: true }
      });
      if (user) {
        req.user = { id: user.id, email: user.email, name: user.name || "" };
      }
    }

    next();
  } catch {
    // Token invalid or expired - continue without auth
    next();
  }
};
