import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, AuthRequest } from "../middleware/auth";
import { validateProject } from "../middleware/validation";
import { createError } from "../middleware/errorHandler";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.user!.id },
      include: {
        agents: {
          select: {
            id: true,
            name: true,
            type: true,
            status: true,
            lastActive: true,
          }
        },
        _count: {
          select: {
            sessions: true,
            histories: true,
          }
        }
      },
      orderBy: { updatedAt: "desc" }
    });

    res.json({
      success: true,
      data: { projects },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", authenticate, validateProject, async (req: AuthRequest, res, next) => {
  try {
    const { name, description } = req.body;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        userId: req.user!.id,
      },
      include: {
        agents: true,
      }
    });

    res.status(201).json({
      success: true,
      data: { project },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      include: {
        agents: {
          include: {
            histories: {
              orderBy: { createdAt: "desc" },
              take: 10,
            }
          }
        },
        sessions: {
          orderBy: { updatedAt: "desc" },
          take: 5,
        },
        histories: {
          orderBy: { createdAt: "desc" },
          take: 20,
        }
      }
    });

    if (!project) {
      throw createError("Project not found", 404);
    }

    res.json({
      success: true,
      data: { project },
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", authenticate, validateProject, async (req: AuthRequest, res, next) => {
  try {
    const { name, description, status } = req.body;

    const project = await prisma.project.update({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      data: {
        name,
        description,
        status,
      },
      include: {
        agents: true,
      }
    });

    res.json({
      success: true,
      data: { project },
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", authenticate, async (req: AuthRequest, res, next) => {
  try {
    await prisma.project.delete({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });

    res.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

export { router as projectRoutes };