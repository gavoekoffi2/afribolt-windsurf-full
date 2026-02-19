import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";

export class Database {
  private static instance: PrismaClient;

  public static getInstance(): PrismaClient {
    if (!Database.instance) {
      Database.instance = new PrismaClient({
        log: [
          { emit: "stdout", level: "query" },
          { emit: "stdout", level: "error" },
          { emit: "stdout", level: "info" },
        ],
      });
    }

    return Database.instance;
  }

  public static async connect(): Promise<void> {
    try {
      const prisma = Database.getInstance();
      await prisma.$connect();
      logger.info("Database connected successfully");
    } catch (error) {
      logger.error("Database connection failed:", error);
      throw error;
    }
  }

  public static async disconnect(): Promise<void> {
    try {
      const prisma = Database.getInstance();
      await prisma.$disconnect();
      logger.info("Database disconnected successfully");
    } catch (error) {
      logger.error("Database disconnection failed:", error);
      throw error;
    }
  }

  public static async migrate(): Promise<void> {
    try {
      logger.info("Running database migrations...");
      const { execSync } = require("child_process");
      execSync("npx prisma migrate deploy", { stdio: "inherit" });
      logger.info("Database migrations completed");
    } catch (error) {
      logger.error("Database migration failed:", error);
      throw error;
    }
  }

  public static async seed(): Promise<void> {
    try {
      logger.info("Seeding database...");
      const { execSync } = require("child_process");
      execSync("npx prisma db seed", { stdio: "inherit" });
      logger.info("Database seeding completed");
    } catch (error) {
      logger.error("Database seeding failed:", error);
      throw error;
    }
  }
}

export const db = Database.getInstance();