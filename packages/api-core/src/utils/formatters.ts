import type { JSONTypes } from "../types";

export function formatQueryParams(params?: Record<string, unknown>): string {
  if (!params || Object.keys(params).length === 0) {
    return "";
  }

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([ key, value ]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export function formatHeaders(headers?: Record<string, string>, authentication?: {
  token?: string;
  otpToken?: string;
}, options?: {
  requiredAuth?: boolean;
  requiredOtp?: boolean;
}): Record<string, string> {
  const formattedHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (authentication?.token && options?.requiredAuth) {
    formattedHeaders["Authorization"] = `Bearer ${authentication.token}`;
  }

  if (authentication?.otpToken && options?.requiredOtp) {
    formattedHeaders["otp-token"] = authentication.otpToken;
  }

  return formattedHeaders;
}

export function formatBody(body?: FormData | JSONTypes): string | FormData | undefined {
  if (!body) {
    return undefined;
  }

  if (body instanceof FormData) {
    return body;
  }

  return JSON.stringify(body);
}

export function isFormData(body: unknown): boolean {
  // En navegador
  if (typeof FormData !== "undefined" && body instanceof FormData) {
    return true;
  }

  // En Node.js con node-fetch o undici
  if (body && typeof body === "object" && "constructor" in body) {
    return body.constructor.name === "FormData";
  }

  return false;
}
