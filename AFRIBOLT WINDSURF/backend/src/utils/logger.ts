import winston from "winston";

const transports: winston.transport[] = [
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
    maxsize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
  }),
  new winston.transports.File({
    filename: "logs/combined.log",
    maxsize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
  }),
];

// Always add console transport - required for Docker container logging
transports.push(
  new winston.transports.Console({
    format:
      process.env.NODE_ENV === "production"
        ? winston.format.json()
        : winston.format.combine(winston.format.colorize(), winston.format.simple()),
  })
);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: "afribolt-backend" },
  transports,
});
