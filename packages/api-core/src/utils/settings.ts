import { adaptFetchConfig } from "../core/adapter";
import type {
  RequestOptions,
  Authentication,
  HttpMethod,
  JSONTypes,
} from "../types";

import {
  validationAuth,
  formatHeaders,
  formatQueryParams,
  formatBody,
} from "./index";

export interface FetchSettings {
  fullURL: string;
  fetchConfig: RequestInit;
}

export interface FetchCoreInput {
  method: HttpMethod;
  url: string;
  baseURL?: string;
  defaultHeaders?: Record<string, string>;
  defaultOptions?: RequestOptions;
  defaultAuthentication?: Authentication;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  body?: FormData | JSONTypes;
  mode?: RequestMode;
  options?: RequestOptions;
  authentication?: Authentication;
}

/**
 * Builds all the necessary settings for a fetch request
 * Handles merging options, authentication, headers, query params, and body formatting
 */
function buildFetchSettings(input: FetchCoreInput): FetchSettings {
  const options: RequestOptions = {
    ...input.defaultOptions,
    ...input.options,
  };

  const authentication: Authentication = {
    ...input.defaultAuthentication,
    ...input.authentication,
  };

  // Validate authentication
  validationAuth(options, authentication);

  // Build full URL with query params
  const queryString = formatQueryParams(input.params);
  const baseURL = input.baseURL || "";
  const fullURL = `${baseURL}${input.url}${queryString}`;

  // Format headers
  const requestHeaders = formatHeaders(
    {
      ...input.defaultHeaders,
      ...input.headers,
    },
    authentication,
    options
  );

  // Format body
  const requestBody =
    input.method === "POST" ||
    input.method === "PUT" ||
    input.method === "PATCH"
      ? formatBody(input.body)
      : undefined;

  // Build fetch config
  const fetchConfig = adaptFetchConfig({
    method: input.method,
    headers: requestHeaders,
    body: requestBody,
    mode: input.mode,
  });

  return {
    fullURL,
    fetchConfig,
  };
}

/**
 * Core fetch function that handles all request configuration and execution
 * @param input - Configuration for the fetch request
 * @returns Promise with the fetch Response
 */
export async function fetchCore(input: FetchCoreInput): Promise<Response> {
  const { fullURL, fetchConfig } = buildFetchSettings(input);
  return fetch(fullURL, fetchConfig);
}
