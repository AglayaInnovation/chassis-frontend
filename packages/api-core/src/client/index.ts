import { processRequest } from "../core/requestProcessor";
import type { ApiResponse, HttpMethod, JSONTypes, Authentication, RequestOptions } from "../types";

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  contentType?: string;
}

export interface MethodOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  body?: FormData | JSONTypes;
  authentication?: Authentication;
  options?: RequestOptions;
}

export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL;
    this.defaultHeaders = {
      "Content-Type": config.contentType || "application/json",
    };
  }

  private async request<T>(
    method: HttpMethod,
    url: string,
    config: MethodOptions = {}
  ): Promise<ApiResponse<T>> {
    return processRequest<T>(
      {
        method,
        url,
        baseURL: this.baseURL,
        defaultHeaders: this.defaultHeaders,
      },
      {
        headers: config.headers,
        params: config.params,
        body: config.body,
        authentication: config.authentication,
        options: config.options,
      }
    );
  }

  async get<T>(url: string, config?: MethodOptions): Promise<ApiResponse<T>> {
    return this.request<T>("GET", url, config);
  }

  async post<T>(url: string, config?: MethodOptions): Promise<ApiResponse<T>> {
    return this.request<T>("POST", url, config);
  }

  async put<T>(url: string, config?: MethodOptions): Promise<ApiResponse<T>> {
    return this.request<T>("PUT", url, config);
  }

  async patch<T>(url: string, config?: MethodOptions): Promise<ApiResponse<T>> {
    return this.request<T>("PATCH", url, config);
  }

  async delete<T>(url: string, config?: MethodOptions): Promise<ApiResponse<T>> {
    return this.request<T>("DELETE", url, config);
  }
}
