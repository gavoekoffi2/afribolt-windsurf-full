import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
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
import { Database } from "./config/database";
import jwt from "jsonwebtoken";

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ["JWT_SECRET", "DATABASE_URL"];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    logger.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

const app = express();
app.set("trust proxy", 1);
const server = createServer(app);
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

const io = new Server(server, {
  cors: {
    origin: frontendUrl,
    methods: ["GET", "POST"]
  }
});

// Use the Database singleton instead of creating a duplicate PrismaClient
const prisma = Database.getInstance();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({
  origin: frontendUrl,
  credentials: true,
}));
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/llm", llmRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/deepcode", deepcodeRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

let agentOrchestrator: AgentOrchestrator;

// Socket.io authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace("Bearer ", "");
  if (!token) {
    return next(new Error("Authentication required"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string };
    (socket as any).userId = decoded.id;
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  logger.info(`Client connected: ${socket.id} (user: ${(socket as any).userId})`);

  socket.on("join-project", (projectId: string) => {
    socket.join(`project-${projectId}`);
  });

  socket.on("agent-request", async (data) => {
    try {
      if (!agentOrchestrator) {
        socket.emit("agent-error", { message: "System not ready" });
        return;
      }
      const result = await agentOrchestrator.processRequest(data);
      socket.emit("agent-response", result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      socket.emit("agent-error", { message });
    }
  });

  socket.on("disconnect", () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

async function startServer() {
  try {
    await Database.connect();
    logger.info("Connected to database");

    agentOrchestrator = new AgentOrchestrator(io, prisma);

    server.listen(PORT, () => {
      logger.info(`AFRIBOLT Backend running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received. Shutting down gracefully...");
  await Database.disconnect();
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  logger.info("SIGINT received. Shutting down gracefully...");
  await Database.disconnect();
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
});

startServer();

export { app, prisma, io };