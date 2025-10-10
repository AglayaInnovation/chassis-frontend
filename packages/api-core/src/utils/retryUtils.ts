import type { RetryConfig } from "../types";

export interface RetryOptions {
  maxRetries: number;
  retryDelay: number;
  retryDelayMultiplier: number;
  maxRetryDelay: number;
  retryOnStatus: number[];
  retryOnNetworkError: boolean;
}

export const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  retryDelayMultiplier: 2,
  maxRetryDelay: 10000, // 10 seconds
  retryOnStatus: [ 408, 429, 500, 502, 503, 504 ],
  retryOnNetworkError: true,
};

export function mergeRetryOptions(config?: RetryConfig): RetryOptions {
  return {
    maxRetries: config?.maxRetries ?? DEFAULT_RETRY_OPTIONS.maxRetries,
    retryDelay: config?.retryDelay ?? DEFAULT_RETRY_OPTIONS.retryDelay,
    retryDelayMultiplier: config?.retryDelayMultiplier ?? DEFAULT_RETRY_OPTIONS.retryDelayMultiplier,
    maxRetryDelay: config?.maxRetryDelay ?? DEFAULT_RETRY_OPTIONS.maxRetryDelay,
    retryOnStatus: config?.retryOnStatus ?? DEFAULT_RETRY_OPTIONS.retryOnStatus,
    retryOnNetworkError: config?.retryOnNetworkError ?? DEFAULT_RETRY_OPTIONS.retryOnNetworkError,
  };
}

export function calculateRetryDelay(attempt: number, options: RetryOptions): number {
  const delay = options.retryDelay * Math.pow(options.retryDelayMultiplier, attempt - 1);
  return Math.min(delay, options.maxRetryDelay);
}

export function shouldRetry(error: Error, response?: Response, options?: RetryOptions): boolean {
  if (!options) {
    return false;
  }

  // Network errors (fetch failed)
  if (options.retryOnNetworkError && error.name === "TypeError" && error.message.includes("fetch")) {
    return true;
  }

  // HTTP status codes
  if (response && options.retryOnStatus.includes(response.status)) {
    return true;
  }

  return false;
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function withRetry<T extends Response>(
  operation: () => Promise<T>,
  options: RetryOptions,
  attempt: number,
  onRetry?: (attempt: number, error: Error) => void
): Promise<T> {
  try {
    const response = await operation();

    // Check if we should retry based on response status
    if (!response.ok) {
      const responseError = new Error(`HTTP ${response.status}: ${response.statusText}`) as Error & { response?: Response };
      responseError.response = response;
      throw responseError;
    }

    return response;
  } catch (error) {
    const lastError = error as Error & { response?: Response };

    // Base case: no more retries available
    if (attempt > options.maxRetries) {
      throw lastError;
    }

    // Base case: error is not retryable
    if (!shouldRetry(lastError, lastError.response, options)) {
      throw lastError;
    }

    // Calculate delay and wait
    const delay = calculateRetryDelay(attempt, options);

    if (onRetry) {
      onRetry(attempt, lastError);
    }

    await sleep(delay);

    return withRetry(operation, options, attempt + 1, onRetry);
  }
}
