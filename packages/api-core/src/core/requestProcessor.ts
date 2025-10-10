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

  // Check response status
  if (!response.ok) {
    throw new ApiError(
      `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      "HTTP_ERROR"
    );
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
