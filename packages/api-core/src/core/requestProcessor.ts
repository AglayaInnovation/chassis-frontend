import { adaptFetchConfig } from "./adapter";
import { ApiError } from "../errors";
import type { ApiResponse, RequestOptions, Authentication, HttpMethod, JSONTypes } from "../types";
import {
  validationAuth,
  withRetry,
  mergeRetryOptions,
  formatHeaders,
  formatQueryParams,
  formatBody,
} from "../utils";

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

  const authentication: Authentication = {
    ...context.defaultAuthentication,
    ...input.authentication,
  };

  // Validate authentication
  validationAuth(options, authentication);

  // Build full URL with query params
  const queryString = formatQueryParams(input.params);
  const baseURL = context.baseURL || "";
  const fullURL = `${baseURL}${context.url}${queryString}`;

  // Format headers
  const requestHeaders = formatHeaders(
    {
      ...context.defaultHeaders,
      ...input.headers,
    },
    authentication,
    options
  );

  // Format body
  const requestBody = (context.method === "POST" || context.method === "PUT" || context.method === "PATCH")
    ? formatBody(input.body)
    : undefined;

  const fetchOperation = async (): Promise<Response> => {
    const fetchConfig = adaptFetchConfig({
      method: context.method,
      headers: requestHeaders,
      body: requestBody,
      mode: input.mode,
    });

    return fetch(fullURL, fetchConfig);
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
        console.warn(`Retry attempt ${attempt} for ${context.method} ${fullURL}: ${error.message}`);
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
