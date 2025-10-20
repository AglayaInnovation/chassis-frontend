/* eslint-disable no-console */
import { LogLevel, type LoggerOptions } from "./types";

/**
 * ANSI color codes for terminal output
 */
const COLORS = {
  reset: "\x1b[0m",
  debug: "\x1b[36m", // Cyan
  info: "\x1b[32m", // Green
  warn: "\x1b[33m", // Yellow
  error: "\x1b[31m", // Red
} as const;

/**
 * Logger class for consistent logging across applications
 */
export class Logger {
  private level: LogLevel;
  private prefix?: string;
  private colors: boolean;
  private timestamps: boolean;
  private handler?: (level: LogLevel, message: string, data?: unknown) => void;

  constructor(options: LoggerOptions = {}) {
    this.level = options.level ?? LogLevel.INFO;
    this.prefix = options.prefix;
    this.colors = options.colors ?? true;
    this.timestamps = options.timestamps ?? false;
    this.handler = options.handler;
  }

  /**
   * Set the minimum log level
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * Get the current log level
   */
  getLevel(): LogLevel {
    return this.level;
  }

  /**
   * Format a log message with optional color and timestamp
   */
  private format(
    level: LogLevel,
    message: string,
    color?: string
  ): string {
    const parts: string[] = [];

    if (this.timestamps) {
      parts.push(`[${new Date().toISOString()}]`);
    }

    if (this.prefix) {
      parts.push(`[${this.prefix}]`);
    }

    parts.push(`[${LogLevel[level]}]`);
    parts.push(message);

    const formatted = parts.join(" ");

    if (this.colors && color) {
      return `${color}${formatted}${COLORS.reset}`;
    }

    return formatted;
  }

  /**
   * Check if a log level should be displayed
   */
  private shouldLog(level: LogLevel): boolean {
    return level >= this.level;
  }

  /**
   * Internal log method
   */
  private log(level: LogLevel, message: string, data?: unknown): void {
    if (!this.shouldLog(level)) {
      return;
    }

    if (this.handler) {
      this.handler(level, message, data);
      return;
    }

    let color: string | undefined;
    let consoleMethod: typeof console.log = console.log;

    switch (level) {
    case LogLevel.DEBUG:
      color = COLORS.debug;
      consoleMethod = console.debug;
      break;
    case LogLevel.INFO:
      color = COLORS.info;
      consoleMethod = console.info;
      break;
    case LogLevel.WARN:
      color = COLORS.warn;
      consoleMethod = console.warn;
      break;
    case LogLevel.ERROR:
      color = COLORS.error;
      consoleMethod = console.error;
      break;
    }

    const formatted = this.format(level, message, color);

    if (data !== undefined) {
      consoleMethod(formatted, data);
    } else {
      consoleMethod(formatted);
    }
  }

  /**
   * Log a debug message
   */
  debug(message: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  /**
   * Log an info message
   */
  info(message: string, data?: unknown): void {
    this.log(LogLevel.INFO, message, data);
  }

  /**
   * Log a warning message
   */
  warn(message: string, data?: unknown): void {
    this.log(LogLevel.WARN, message, data);
  }

  /**
   * Log an error message
   */
  error(message: string, data?: unknown): void {
    this.log(LogLevel.ERROR, message, data);
  }

  /**
   * Create a child logger with a specific prefix
   */
  child(prefix: string): Logger {
    return new Logger({
      level: this.level,
      prefix: this.prefix ? `${this.prefix}:${prefix}` : prefix,
      colors: this.colors,
      timestamps: this.timestamps,
      handler: this.handler,
    });
  }
}

/**
 * Create a new logger instance
 */
export function createLogger(options?: LoggerOptions): Logger {
  return new Logger(options);
}

/**
 * Default logger instance
 */
export const logger = new Logger();
