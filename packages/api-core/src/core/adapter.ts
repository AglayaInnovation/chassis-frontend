import type { HttpMethod } from "../types";

export interface FetchConfig {
  method: HttpMethod;
  headers: Record<string, string>;
  body?: string | FormData;
  mode?: RequestMode;
}

/**
 * Detecta si estamos en un ambiente de servidor o navegador
 */
export function isServerEnvironment(): boolean {
  return typeof window === "undefined";
}

/**
 * Adapta la configuración de fetch para que funcione en servidor y navegador
 */
export function adaptFetchConfig(config: FetchConfig): RequestInit {
  const { method, headers, body, mode } = config;

  // En servidor, no se usa el parámetro 'mode'
  if (isServerEnvironment()) {
    return {
      method,
      headers,
      body,
      // Node.js 18+ fetch no soporta 'mode'
    };
  }

  // En navegador, incluimos 'mode'
  return {
    method,
    headers,
    body,
    mode,
  };
}

/**
 * Valida si un body es FormData de manera segura
 */
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

/**
 * Formatea el body según el ambiente
 */
export function formatBodyForEnvironment(body?: FormData | string): string | FormData | undefined {
  if (!body) {
    return undefined;
  }

  // Si ya es FormData o string, retornarlo tal cual
  return body;
}
