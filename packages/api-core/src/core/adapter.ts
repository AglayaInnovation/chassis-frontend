import type { HttpMethod } from "../types";

export interface FetchConfig {
  method: HttpMethod;
  headers: Record<string, string>;
  body?: string | FormData;
  mode?: RequestMode;
}

export function isServerEnvironment(): boolean {
  return typeof window === "undefined";
}

export function adaptFetchConfig(config: FetchConfig): RequestInit {
  const { method, headers, body, mode } = config;

  if (isServerEnvironment()) {
    return {
      method,
      headers,
      body,
    };
  }

  return {
    method,
    headers,
    body,
    mode,
  };
}

export function isFormData(body: unknown): boolean {
  if (typeof FormData !== "undefined" && body instanceof FormData) {
    return true;
  }

  if (body && typeof body === "object" && "constructor" in body) {
    return body.constructor.name === "FormData";
  }

  return false;
}

export function formatBodyForEnvironment(
  body?: FormData | string
): string | FormData | undefined {
  if (!body) {
    return undefined;
  }

  return body;
}
