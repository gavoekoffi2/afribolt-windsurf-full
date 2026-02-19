import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const prisma = new PrismaClient();
const googleClient = new OAuth2Client();

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateToken(userId: string, email: string): string {
    return jwt.sign(
      { id: userId, email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );
  }

  static async verifyGoogleToken(idToken: string) {
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      return ticket.getPayload();
    } catch (error) {
      throw new Error("Invalid Google token");
    }
  }

  static async createUser(userData: {
    email: string;
    name?: string;
    password?: string;
    googleId?: string;
    avatar?: string;
  }) {
    return prisma.user.create({
      data: userData,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
      }
    });
  }

  static async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  static async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
      }
    });
  }
}
