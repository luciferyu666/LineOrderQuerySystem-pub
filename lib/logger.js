// lib/logger.js

import winston from "winston";

const isProduction = process.env.NODE_ENV === "production";

// 設定 log 格式
const logFormat = winston.format.printf(
  ({ timestamp, level, message, ...meta }) => {
    return `[${timestamp}] [${level.toUpperCase()}]: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta) : ""
    }`;
  }
);

// 建立 logger 實例
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize({ all: !isProduction }),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
    // 若需寫入檔案可加入以下設定：
    // new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// 提供簡單的 log 包裝函式（可選）
export function logInfo(message, meta = {}) {
  logger.info(message, meta);
}

export function logWarn(message, meta = {}) {
  logger.warn(message, meta);
}

export function logError(message, meta = {}) {
  logger.error(message, meta);
}

export default logger;
