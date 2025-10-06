# @aglaya/api-core

A flexible and type-safe HTTP client library for both browser and Node.js environments with built-in retry logic, authentication, and error handling.

## Features

- 🚀 **Universal**: Works in both browser and Node.js
- 📦 **Type-Safe**: Full TypeScript support
- 🔄 **Retry Logic**: Automatic retry on failed requests
- 🔐 **Authentication**: Built-in auth support
- ⚡ **Modern**: Uses native Fetch API
- 🎯 **Simple API**: Intuitive and easy to use

## Installation

```bash
yarn add @aglaya/api-core
# or
npm install @aglaya/api-core
```

## Usage

### Basic Usage

```typescript
import { ApiClient } from "@aglaya/api-core";

const client = new ApiClient({
  baseURL: "https://api.example.com",
  headers: {
    "Authorization": "Bearer your-token"
  }
});

// GET request
const response = await client.get("/users");

// POST request
const newUser = await client.post("/users", {
  name: "John Doe",
  email: "john@example.com"
});

// PUT request
const updated = await client.put("/users/1", {
  name: "Jane Doe"
});

// DELETE request
await client.delete("/users/1");
```

### Configuration

```typescript
const client = new ApiClient({
  baseURL: "https://api.example.com",    // Base URL for all requests
  headers: {                              // Default headers
    "Authorization": "Bearer token"
  },
  timeout: 30000,                         // Request timeout (ms)
  retries: 3,                             // Number of retries
  retryDelay: 1000                        // Delay between retries (ms)
});
```

### TypeScript Support

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const response = await client.get<User>("/users/1");
console.log(response.data.name); // Fully typed!
```

## API Reference

### `ApiClient`

#### Constructor

```typescript
new ApiClient(config?: RequestConfig)
```

#### Methods

- `get<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>>`
- `post<T>(url: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>>`
- `put<T>(url: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>>`
- `delete<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>>`

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
