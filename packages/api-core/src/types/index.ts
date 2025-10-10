export type Primitive = number | string | boolean | null | undefined;
export type JSONObject = { [k: string]: JSONTypes };
export type JSONArray = JSONTypes[];
export type JSONTypes = JSONArray | JSONObject | Primitive;

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
export type RequestMode = "cors" | "navigate" | "no-cors" | "same-origin";

export interface RetryConfig {
  maxRetries?: number;
  retryDelay?: number;
  retryDelayMultiplier?: number;
  maxRetryDelay?: number;
  retryOnStatus?: number[];
  retryOnNetworkError?: boolean;
}

export interface RequestOptions {
  requiredAuth?: boolean;
  requiredOtp?: boolean;
  retry?: RetryConfig;
}

export interface Authentication {
  token?: string;
  otpToken?: string;
}

export interface RequestConfig {
  baseURL?: string;
  headers?: Record<string, string>;
  timeout?: number;
  authentication?: Authentication;
  options?: RequestOptions;
}

export interface ApiResponse<T = unknown> {
  response: T;
  status: "ok" | "error";
  statusCode?: number;
  headers?: Record<string, string>;
}

export interface FetchOptions {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: FormData | JSONTypes;
  params?: Record<string, string>;
  mode?: RequestMode;
  authentication?: Authentication;
  options?: RequestOptions;
}
