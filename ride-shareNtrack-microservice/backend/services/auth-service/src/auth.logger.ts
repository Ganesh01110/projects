import { createLogger, format, transports } from "winston";

// Define log format
const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
  })
);

// Create logger instance
export const logger = createLogger({
  level: "info", // Default log level
  format: logFormat,
  transports: [
    new transports.Console(), // Log to console
    new transports.File({ filename: "logs/error.log", level: "error" }), // Log errors to a file
    new transports.File({ filename: "logs/combined.log" }), // Log all levels to a file
  ],
});

// Export logger
export default logger;