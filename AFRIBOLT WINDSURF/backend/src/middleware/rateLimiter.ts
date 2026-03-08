import { RateLimiterMemory } from "rate-limiter-flexible";
import { Request, Response, NextFunction } from "express";
import { createError } from "./errorHandler";

const rateLimiterInstance = new RateLimiterMemory({
  points: 100,
  duration: 60,
});

export const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const key = req.ip || "unknown";
    await rateLimiterInstance.consume(key);
    next();
  } catch (rejRes: unknown) {
    if (rejRes && typeof rejRes === "object" && "msBeforeNext" in rejRes) {
      const secs = Math.round((rejRes as { msBeforeNext: number }).msBeforeNext / 1000) || 1;
      res.set("Retry-After", String(secs));
    }
    next(createError("Too Many Requests", 429));
  }
};

export { rateLimiterMiddleware as rateLimiter };
