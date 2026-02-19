import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, AuthRequest } from "../middleware/auth";
import { validateAgentRequest } from "../middleware/validation";
import { createError } from "../middleware/errorHandler";
import { emefaAgent } from "../agents/emefa";
import { AgentOrchestrator } from "../agents/orchestrator";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { projectId } = req.query;
    
    const agents = await prisma.agent.findMany({
      where: {
        project: {
          userId: req.user!.id,
          ...(projectId && { id: projectId as string }),
        },
      },
      include: {
        histories: {
          orderBy: { createdAt: "desc" },
          take: 5,
        }
      },
      orderBy: { updatedAt: "desc" }
    });

    res.json({
      success: true,
      data: { agents },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/chat", authenticate, validateAgentRequest, async (req: AuthRequest, res, next) => {
  try {
    const { agentType, message, context, model } = req.body;
    const { projectId } = context;

    if (!projectId) {
      throw createError("Project ID is required", 400);
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: req.user!.id,
      },
    });

    if (!project) {
      throw createError("Project not found", 404);
    }

    let agent = await prisma.agent.findFirst({
      where: {
        type: agentType,
        projectId,
      },
    });

    if (!agent) {
      agent = await prisma.agent.create({
        data: {
          name: agentType.toUpperCase(),
          type: agentType,
          projectId,
          status: "active",
        },
      });
    }

    const orchestrator = new AgentOrchestrator(null, prisma);
    const response = await orchestrator.processAgentRequest(
      agentType,
      message,
      context,
      model || "gpt-4",
      req.user!.id
    );

    await prisma.agent.update({
      where: { id: agent.id },
      data: {
        lastActive: new Date(),
        status: "active",
      },
    });

    await prisma.history.create({
      data: {
        type: "agent_response",
        content: response,
        agentId: agent.id,
        projectId,
      },
    });

    res.json({
      success: true,
      data: {
        response,
        agent,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const agent = await prisma.agent.findFirst({
      where: {
        id: req.params.id,
        project: {
          userId: req.user!.id,
        },
      },
      include: {
        histories: {
          orderBy: { createdAt: "desc" },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      }
    });

    if (!agent) {
      throw createError("Agent not found", 404);
    }

    res.json({
      success: true,
      data: { agent },
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:id/config", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { config } = req.body;

    const agent = await prisma.agent.findFirst({
      where: {
        id: req.params.id,
        project: {
          userId: req.user!.id,
        },
      },
    });

    if (!agent) {
      throw createError("Agent not found", 404);
    }

    const updatedAgent = await prisma.agent.update({
      where: { id: req.params.id },
      data: {
        config,
      },
    });

    res.json({
      success: true,
      data: { agent: updatedAgent },
    });
  } catch (error) {
    next(error);
  }
});

export { router as agentRoutes };