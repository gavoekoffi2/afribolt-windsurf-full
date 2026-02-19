import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { createError } from "./errorHandler";

export const validateAuth = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Email invalide",
      "any.required": "Email requis",
    }),
    password: Joi.string().min(6).max(128).required().messages({
      "string.min": "Le mot de passe doit contenir au moins 6 caractères",
      "any.required": "Mot de passe requis",
    }),
    name: Joi.string().min(2).max(50).optional().messages({
      "string.min": "Le nom doit contenir au moins 2 caractères",
    }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message).join(", ");
    return next(createError(messages, 400));
  }
  next();
};

export const validateProject = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500).optional().allow(""),
    status: Joi.string().valid("active", "planning", "completed", "archived").optional(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message).join(", ");
    return next(createError(messages, 400));
  }
  next();
};

export const validateAgentRequest = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    agentType: Joi.string().valid("emefa", "koffi", "dede", "solim", "akofa", "kwami", "yaovi").required(),
    message: Joi.string().min(1).max(10000).required(),
    context: Joi.object().optional(),
    model: Joi.string().valid("gpt-4", "gpt-3.5-turbo", "claude-3-sonnet", "claude-3-opus", "gemini-pro").optional(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message).join(", ");
    return next(createError(messages, 400));
  }
  next();
};

export const validateDeepCode = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    code: Joi.string().min(1).max(100000).optional(),
    description: Joi.string().min(1).max(10000).optional(),
    issues: Joi.array().items(Joi.string()).optional(),
    files: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        code: Joi.string().required(),
        context: Joi.object().optional(),
      })
    ).optional(),
    context: Joi.object({
      language: Joi.string().valid("javascript", "typescript", "python", "java", "go", "rust", "csharp", "php", "ruby").required(),
      framework: Joi.string().optional().allow(""),
      purpose: Joi.string().optional().allow(""),
      type: Joi.string().valid("frontend", "backend", "fullstack").optional(),
      features: Joi.array().items(Joi.string()).optional(),
      complexity: Joi.string().valid("simple", "medium", "complex").optional(),
      environment: Joi.string().valid("development", "staging", "production").optional(),
      standards: Joi.array().items(Joi.string()).optional(),
      optimizationGoals: Joi.array().items(Joi.string()).optional(),
      audience: Joi.string().valid("developers", "users", "api").optional(),
    }).required(),
  }).or("code", "description", "files");

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message).join(", ");
    return next(createError(messages, 400));
  }
  next();
};
