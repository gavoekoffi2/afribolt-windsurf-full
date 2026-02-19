import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
import { authRoutes } from "./routes/auth";
import { projectRoutes } from "./routes/projects";
import { agentRoutes } from "./routes/agents";
import { llmRoutes } from "./routes/llm";
import { healthRoutes } from "./routes/health";
import { deepcodeRoutes } from "./routes/deepcode";
import { errorHandler } from "./middleware/errorHandler";
import { rateLimiter } from "./middleware/rateLimiter";
import { logger } from "./utils/logger";
import { AgentOrchestrator } from "./agents/orchestrator";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/llm", llmRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/deepcode", deepcodeRoutes);

// Basic health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(errorHandler);

// WebSocket setup
const agentOrchestrator = new AgentOrchestrator(io, prisma);

io.on("connection", (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on("join-project", (projectId: string) => {
    if (projectId && typeof projectId === "string") {
      socket.join(`project-${projectId}`);
      logger.info(`Client ${socket.id} joined project ${projectId}`);
    }
  });

  socket.on("agent-request", async (data) => {
    try {
      const result = await agentOrchestrator.processRequest(data);
      socket.emit("agent-response", result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An error occurred";
      logger.error("Socket agent-request error:", { socketId: socket.id, error: message });
      socket.emit("agent-error", { message });
    }
  });

  socket.on("disconnect", () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Graceful shutdown
async function gracefulShutdown(signal: string) {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  server.close(() => {
    logger.info("HTTP server closed");
  });

  io.close(() => {
    logger.info("WebSocket server closed");
  });

  await prisma.$disconnect();
  logger.info("Database disconnected");

  process.exit(0);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled rejection:", reason);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception:", error);
  process.exit(1);
});

// Start server
async function startServer() {
  try {
    await prisma.$connect();
    logger.info("Connected to database");

    server.listen(PORT, () => {
      logger.info(`AFRIBOLT Backend running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

export { app, prisma, io };
