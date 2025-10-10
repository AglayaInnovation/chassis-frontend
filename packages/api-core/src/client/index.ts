import { processRequest } from "../core/requestProcessor";
import type { ApiResponse, RequestConfig, FetchOptions, HttpMethod, JSONTypes, Authentication } from "../types";

export class ApiClient {
  private baseURL: string;
  private headers: Record<string, string>;
  private timeout: number;
  private authentication?: Authentication;
  private defaultOptions?: RequestConfig["options"];

  constructor(config: RequestConfig = {}) {
    this.baseURL = config.baseURL || "";
    this.headers = config.headers || {};
    this.timeout = config.timeout || 30000;
    this.authentication = config.authentication;
    this.defaultOptions = config.options;
  }

  setAuthentication(authentication: Authentication): void {
    this.authentication = authentication;
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

  async get<T>(url: string, options: Partial<FetchOptions> = {}): Promise<ApiResponse<T>> {
    return this.performRequest<T>("GET", url, options);
  }

  async post<T>(url: string, body?: FormData | JSONTypes, options: Partial<FetchOptions> = {}): Promise<ApiResponse<T>> {
    return this.performRequest<T>("POST", url, {
      ...options,
      body,
    });
  }

  async put<T>(url: string, body?: FormData | JSONTypes, options: Partial<FetchOptions> = {}): Promise<ApiResponse<T>> {
    return this.performRequest<T>("PUT", url, {
      ...options,
      body,
    });
  }

  async patch<T>(url: string, body?: FormData | JSONTypes, options: Partial<FetchOptions> = {}): Promise<ApiResponse<T>> {
    return this.performRequest<T>("PATCH", url, {
      ...options,
      body,
    });
  }

  async delete<T>(url: string, options: Partial<FetchOptions> = {}): Promise<ApiResponse<T>> {
    return this.performRequest<T>("DELETE", url, options);
  }
}
