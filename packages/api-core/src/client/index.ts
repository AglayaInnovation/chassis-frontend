import type { ApiResponse, RequestConfig, RequestOptions } from "../types";

export class ApiClient {
  private baseURL: string;
  private headers: Record<string, string>;
  private timeout: number;
  private retries: number;
  private retryDelay: number;

  constructor(config: RequestConfig = {}) {
    this.baseURL = config.baseURL || "";
    this.headers = config.headers || {};
    this.timeout = config.timeout || 30000;
    this.retries = config.retries || 3;
    this.retryDelay = config.retryDelay || 1000;
  }

  async request<T>(url: string, options: RequestOptions): Promise<ApiResponse<T>> {
    const fullURL = `${this.baseURL}${url}`;

    const response = await fetch(fullURL, {
      method: options.method,
      headers: {
        ...this.headers,
        ...options.headers,
        "Content-Type": "application/json",
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const data = (await response.json()) as T;

    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers,
    };
  }

  async get<T>(url: string, options: Partial<RequestOptions> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: "GET",
    });
  }

  async post<T>(url: string, body?: unknown, options: Partial<RequestOptions> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: "POST",
      body,
    });
  }

  async put<T>(url: string, body?: unknown, options: Partial<RequestOptions> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: "PUT",
      body,
    });
  }

  async delete<T>(url: string, options: Partial<RequestOptions> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: "DELETE",
    });
  }
}
