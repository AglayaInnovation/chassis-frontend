export class ApiError extends Error {
  public readonly status?: number;
  public readonly code?: string;
  public readonly data?: unknown;

  constructor(message: string, status?: number, code?: string, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.data = data;

    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}
