# @aglaya/api-core

A flexible and type-safe HTTP client library for both browser and Node.js environments with built-in retry logic, authentication, and error handling.

## Features

- 🚀 **Universal**: Works in both browser and Node.js
- 📦 **Type-Safe**: Full TypeScript support
- 🔄 **Retry Logic**: Opt-in retry with exponential backoff
- ⏱️ **Timeouts**: Per-client or per-request
- 🔐 **Authentication**: Bearer token and OTP, sent only where you require them
- 🧯 **Errors**: Every failure is an `ApiError`, with the server's message and error code
- ⚡ **Modern**: Uses native Fetch API, no runtime dependencies

## Installation

```bash
yarn add @aglaya/api-core
# or
npm install @aglaya/api-core
```

## Usage

There are two clients over the same core:

- `ApiClient`: for the browser. Configure the base URL and timeout once, and pass authentication per request.
- `ApiServerClient`: for Node.js 18+, Bun and Deno. Also takes default headers, authentication and options (retry, timeout) once for every request.

### ApiClient (browser)

```typescript
import { ApiClient } from "@aglaya/api-core";

const client = new ApiClient({
  baseURL: "https://api.example.com",
  timeout: 10000, // ms, optional; no timeout if omitted
  contentType: "application/json", // default
});

// Public endpoint: no token is sent
const { response: products } = await client.get<Product[]>("/products", {
  params: { page: 1 },
});

// Protected endpoint: the token is sent only with requiredAuth
const { response: user } = await client.post<User>("/users", {
  body: { name: "John Doe" },
  authentication: { token },
  options: { requiredAuth: true },
});
```

`post`, `put` and `patch` take the body inside the options object (`{ body }`).

### ApiServerClient (Node.js, Bun, Deno)

```typescript
import { ApiServerClient } from "@aglaya/api-core";

const client = new ApiServerClient({
  baseURL: "https://api.example.com",
  headers: { "X-Client": "my-service" },
  authentication: { token: process.env.API_TOKEN },
  options: {
    requiredAuth: true,
    timeout: 10000,
    retry: { maxRetries: 3, retryDelay: 1000 },
  },
});

const { response: users } = await client.get<User[]>("/users");
const { response: created } = await client.post<User>("/users", { name: "Jane" });

// Per-request options override the defaults
await client.get("/health", { options: { requiredAuth: false, timeout: 2000 } });
```

Here `post`, `put` and `patch` take the body as the second argument.

### Authentication

Tokens are only sent when the request requires them, so one client can call both public and protected endpoints:

| Option | Header sent | If the value is missing |
|---|---|---|
| `requiredAuth: true` | `Authorization: Bearer <token>` | `ApiError` 401, code `AUTH_TOKEN_REQUIRED` |
| `requiredOtp: true` | `otp-token: <otpToken>` | `ApiError` 401, code `OTP_TOKEN_REQUIRED` |

Without `requiredAuth`, `authentication.token` is ignored and no `Authorization` header is sent.

### Retry

Retry is off unless `options.retry` is set. Defaults:

```typescript
{
  maxRetries: 3,
  retryDelay: 1000, // first delay, ms
  retryDelayMultiplier: 2, // exponential backoff
  maxRetryDelay: 10000,
  retryOnStatus: [408, 429, 500, 502, 503, 504],
  retryOnNetworkError: true,
}
```

Other statuses (400, 401, 404...) fail on the first attempt. `timeout` applies to each attempt.

### Responses

Every method resolves to:

```typescript
interface ApiResponse<T> {
  response: T; // the parsed JSON body
  status: "ok";
  statusCode: number;
  headers: Record<string, string>;
}
```

### Errors

Every failure rejects with an `ApiError`, including after retries are exhausted:

```typescript
import { ApiError } from "@aglaya/api-core";

try {
  await client.get("/budgets/123");
} catch (error) {
  if (error instanceof ApiError) {
    error.status; // 404 (undefined for timeouts and network errors)
    error.code; // "BUDGET_NOT_FOUND"
    error.message; // "Budget not found"
    error.data; // the parsed error body, if it was JSON
  }
}
```

| Failure | `code` | `message` |
|---|---|---|
| Non-2xx response | `errorCode` or `code` from the JSON body, else `HTTP_ERROR` | `message` from the JSON body, else `HTTP <status>: <statusText>` |
| Timeout | `TIMEOUT` | `Request timed out after <ms>ms` |
| Network failure | `NETWORK_ERROR` | `Network error: <cause>` |
| Missing token / OTP | `AUTH_TOKEN_REQUIRED` / `OTP_TOKEN_REQUIRED` | `Required Token` / `Required OTP Token` |

## Development

```bash
# Install dependencies
yarn install

# Build
yarn build

# Test
yarn test

# Lint
yarn lint

# Type check
yarn type-check
```

## License

MIT © Monster50
