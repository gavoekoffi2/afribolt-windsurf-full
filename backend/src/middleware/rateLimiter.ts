import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible";
import { Request, Response, NextFunction } from "express";

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
    const key = req.ip || req.socket.remoteAddress || "unknown";
    await rateLimiterInstance.consume(key);
    next();
  } catch (rejRes: unknown) {
    if (rejRes instanceof RateLimiterRes) {
      const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
      res.set("Retry-After", String(secs));
    }
    res.status(429).json({
      success: false,
      error: { message: "Too Many Requests" },
    });
  }
};

export { rateLimiterMiddleware as rateLimiter };
