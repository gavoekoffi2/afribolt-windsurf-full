import express from "express";
import { authenticate, AuthRequest } from "../middleware/auth";
import { llmRouter } from "../llm/router";
import { createError } from "../middleware/errorHandler";

const router = express.Router();

router.get("/models", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const availableModels = llmRouter.getAvailableModels();
    
    res.json({
      success: true,
      data: {
        models: availableModels,
        count: availableModels.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/test", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { model, message } = req.body;

    if (!model || !message) {
      throw createError("Model and message are required", 400);
    }

    const messages: import("../llm/router").LLMMessage[] = [
      { role: "system", content: "Tu es un assistant IA utile. Réponds de manière concise." },
      { role: "user", content: message }
    ];

    const response = await llmRouter.generateResponse(model, messages, {
      temperature: 0.7,
      maxTokens: 500,
      userId: req.user!.id,
    });

    res.json({
      success: true,
      data: {
        response,
        model,
        usage: response.usage,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/status", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const models = llmRouter.getAvailableModels();
    
    const status = {
      openai: models.some(m => m.startsWith("gpt")),
      anthropic: models.some(m => m.startsWith("claude")),
      gemini: models.some(m => m.startsWith("gemini")),
      totalModels: models.length,
      availableModels: models,
    };

    res.json({
      success: true,
      data: { status },
    });
  } catch (error) {
    next(error);
  }
});

export { router as llmRoutes };