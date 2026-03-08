import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { createError } from "./errorHandler";

export const validateAuth = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).max(50).optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return next(createError(error.details[0].message, 400));
  }
  next();
};

export const validateProject = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500).optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return next(createError(error.details[0].message, 400));
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

  const { error } = schema.validate(req.body);
  if (error) {
    return next(createError(error.details[0].message, 400));
  }
  next();
};

export const validateDeepCode = (req: Request, res: Response, next: NextFunction) => {
  const contextSchema = Joi.object({
    language: Joi.string().valid("javascript", "typescript", "python", "java", "go", "rust", "csharp", "php", "ruby").required(),
    framework: Joi.string().optional(),
    purpose: Joi.string().optional(),
    type: Joi.string().optional(),
    audience: Joi.string().optional(),
    environment: Joi.string().valid("development", "staging", "production").optional(),
    optimizationGoals: Joi.array().items(Joi.string()).optional(),
    standards: Joi.array().items(Joi.string()).optional(),
  }).required();

  const schema = Joi.object({
    code: Joi.string().min(1).max(100000).optional(),
    description: Joi.string().min(1).max(10000).optional(),
    context: contextSchema,
    issues: Joi.array().items(Joi.string()).optional(),
    files: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      code: Joi.string().required(),
      context: Joi.object().optional(),
    })).optional(),
  }).or("code", "description", "files");

  const { error } = schema.validate(req.body);
  if (error) {
    return next(createError(error.details[0].message, 400));
  }
  next();
};