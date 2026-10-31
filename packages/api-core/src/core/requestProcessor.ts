import { ApiError } from "../errors";
import type {
  ApiResponse,
  RequestOptions,
  Authentication,
  HttpMethod,
  JSONTypes,
} from "../types";
import { withRetry, mergeRetryOptions } from "../utils";
import { fetchCore } from "../utils/settings";

const MIN_ATTEMPTS = 1;

export interface RequestContext {
  method: HttpMethod;
  url: string;
  baseURL?: string;
  defaultHeaders?: Record<string, string>;
  defaultOptions?: RequestOptions;
  defaultAuthentication?: Authentication;
}

export interface RequestInput {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  body?: FormData | JSONTypes;
  mode?: RequestMode;
  options?: RequestOptions;
  authentication?: Authentication;
}

/**
 * Builds an ApiError from a non-ok response, keeping the server's message and
 * error code when the body is JSON ({ message, errorCode } or { message, code }).
 */
async function httpError(response: Response): Promise<ApiError> {
  const body = (await response.json().catch(() => undefined)) as
    | { message?: unknown; errorCode?: unknown; code?: unknown }
    | undefined;
  const message =
    typeof body?.message === "string"
      ? body.message
      : `HTTP ${response.status}: ${response.statusText}`;
  const code = body?.errorCode ?? body?.code;

  return new ApiError(
    message,
    response.status,
    typeof code === "string" ? code : "HTTP_ERROR",
    body
  );
}

/** Wraps a fetch failure (timeout, network) so callers only ever see ApiError. */
function toApiError(error: unknown, timeout?: number): ApiError {
  if (error instanceof ApiError) {
    return error;
  }
  // Checked by name, not instanceof: the DOMException may come from another realm
  const { name, message = String(error) } = (error ?? {}) as { name?: string; message?: string };
  if (name === "TimeoutError") {
    return new ApiError(`Request timed out after ${timeout}ms`, undefined, "TIMEOUT", error);
  }
  return new ApiError(`Network error: ${message}`, undefined, "NETWORK_ERROR", error);
}

export async function processRequest<T>(
  context: RequestContext,
  input: RequestInput = {}
): Promise<ApiResponse<T>> {
  const options: RequestOptions = {
    ...context.defaultOptions,
    ...input.options,
  };

  // Build URL for logging purposes
  const baseURL = context.baseURL || "";
  const url = `${baseURL}${context.url}`;

  const fetchOperation = async (): Promise<Response> => {
    return fetchCore({
      method: context.method,
      url: context.url,
      baseURL: context.baseURL,
      defaultHeaders: context.defaultHeaders,
      defaultOptions: context.defaultOptions,
      defaultAuthentication: context.defaultAuthentication,
      headers: input.headers,
      params: input.params,
      body: input.body,
      mode: input.mode,
      options: input.options,
      authentication: input.authentication,
    });
  };

  let response: Response;

  try {
    // Apply retry logic if configured
    if (options.retry) {
      const retryOptions = mergeRetryOptions(options.retry);
      response = await withRetry(
        fetchOperation,
        retryOptions,
        MIN_ATTEMPTS,
        (attempt, error) => {
          // eslint-disable-next-line no-console
          console.warn(
            `Retry attempt ${attempt} for ${context.method} ${url}: ${error.message}`
          );
        }
      );
    } else {
      response = await fetchOperation();
    }
  } catch (error) {
    // withRetry rejects with the last non-ok response attached; handle it like any other
    const failed = (error as { response?: Response }).response;
    if (!failed) {
      throw toApiError(error, options.timeout);
    }
    response = failed;
  }

  // Check response status
  if (!response.ok) {
    throw await httpError(response);
  }

  const data = (await response.json()) as T;

  const responseHeaders: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    responseHeaders[key] = value;
  });

  return {
    response: data,
    status: "ok",
    statusCode: response.status,
    headers: responseHeaders,
  };
}
