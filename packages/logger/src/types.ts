/**
 * Log levels in order of severity
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  SILENT = 4,
}

/**
 * Logger configuration options
 */
export interface LoggerOptions {
  /**
   * Minimum log level to display
   * @default LogLevel.INFO
   */
  level?: LogLevel;

  /**
   * Prefix to add to all log messages
   */
  prefix?: string;

  /**
   * Enable colored output (only works in environments that support ANSI colors)
   * @default true
   */
  colors?: boolean;

  /**
   * Enable timestamps in log messages
   * @default false
   */
  timestamps?: boolean;

  /**
   * Custom log handler function
   */
  handler?: LogHandler;
}

/**
 * Custom log handler function type
 */
export type LogHandler = (
  level: LogLevel,
  message: string,
  data?: unknown
) => void;

/**
 * Log metadata
 */
export interface LogMetadata {
  level: LogLevel;
  timestamp: Date;
  prefix?: string;
  message: string;
  data?: unknown;
}
