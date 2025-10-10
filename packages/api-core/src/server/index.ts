import { processRequest } from "../core/requestProcessor";
import type {
  ApiResponse,
  FetchOptions,
  HttpMethod,
  JSONTypes,
  Authentication,
  RequestOptions,
} from "../types";

export interface ServerConfig {
  baseURL?: string;
  headers?: Record<string, string>;
  authentication?: Authentication;
  options?: RequestOptions;
}

/**
 * ApiServerClient - Cliente HTTP para uso en servidor (Node.js, Bun, etc.)
 *
 * Usa el mismo core que ApiClient pero optimizado para entornos de servidor:
 * - Compatible con Node.js 18+ (fetch nativo)
 * - Compatible con Bun, Deno
 * - No usa APIs exclusivas del navegador (como 'mode' en fetch)
 * - Soporta autenticación y retry logic
 * - Maneja FormData de forma segura en ambos entornos
 *
 * @example
 * ```ts
 * // Node.js / Bun / Deno
 * const client = new ApiServerClient({
 *   baseURL: 'https://api.example.com',
 *   authentication: { token: 'secret' },
 *   options: {
 *     retry: {
 *       maxRetries: 3,
 *       retryDelay: 1000
 *     }
 *   }
 * });
 *
 * const data = await client.get('/users');
 * ```
 */
export class ApiServerClient {
  private baseURL: string;
  private headers: Record<string, string>;
  private authentication?: Authentication;
  private defaultOptions?: ServerConfig["options"];

  constructor(config: ServerConfig = {}) {
    this.baseURL = config.baseURL || "";
    this.headers = config.headers || {};
    this.authentication = config.authentication;
    this.defaultOptions = config.options;
  }

  /**
   * Actualiza la autenticación del cliente
   */
  setAuthentication(authentication: Authentication): void {
    this.authentication = authentication;
  }

  /**
   * Actualiza los headers por defecto
   */
  setHeaders(headers: Record<string, string>): void {
    this.headers = { ...this.headers, ...headers };
  }

  /**
   * Actualiza el baseURL
   */
  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL;
  }

  private async performRequest<T>(
    method: HttpMethod,
    url: string,
    fetchOptions: Partial<FetchOptions> = {}
  ): Promise<ApiResponse<T>> {
    return processRequest<T>(
      {
        method,
        url,
        baseURL: this.baseURL,
        defaultHeaders: this.headers,
        defaultOptions: this.defaultOptions,
        defaultAuthentication: this.authentication,
      },
      {
        headers: fetchOptions.headers,
        params: fetchOptions.params,
        body: fetchOptions.body,
        mode: fetchOptions.mode,
        options: fetchOptions.options,
        authentication: fetchOptions.authentication,
      }
    );
  }

  /**
   * GET request
   */
  async get<T>(
    url: string,
    options: Partial<FetchOptions> = {}
  ): Promise<ApiResponse<T>> {
    return this.performRequest<T>("GET", url, options);
  }

  /**
   * POST request
   */
  async post<T>(
    url: string,
    body?: FormData | JSONTypes,
    options: Partial<FetchOptions> = {}
  ): Promise<ApiResponse<T>> {
    return this.performRequest<T>("POST", url, {
      ...options,
      body,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    url: string,
    body?: FormData | JSONTypes,
    options: Partial<FetchOptions> = {}
  ): Promise<ApiResponse<T>> {
    return this.performRequest<T>("PUT", url, {
      ...options,
      body,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    url: string,
    body?: FormData | JSONTypes,
    options: Partial<FetchOptions> = {}
  ): Promise<ApiResponse<T>> {
    return this.performRequest<T>("PATCH", url, {
      ...options,
      body,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(
    url: string,
    options: Partial<FetchOptions> = {}
  ): Promise<ApiResponse<T>> {
    return this.performRequest<T>("DELETE", url, options);
  }

  /**
   * Request genérico con método personalizado
   */
  async request<T>(
    method: HttpMethod,
    url: string,
    options: Partial<FetchOptions> = {}
  ): Promise<ApiResponse<T>> {
    return this.performRequest<T>(method, url, options);
  }
}
