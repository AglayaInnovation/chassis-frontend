# @aglaya/api-core

## 0.2.0

### Minor Changes

- 4f03fad: Timeouts and consistent errors:
  - `options.timeout` (and `ApiClient`'s `timeout`, previously ignored) now aborts each attempt with an `ApiError` (code `TIMEOUT`).
  - Non-2xx responses keep the server's `message` and `errorCode`/`code` from a JSON body, and expose the body as `error.data`.
  - With `retry`, failures now reject with `ApiError` (status, code) instead of a plain `Error`.
  - Network failures reject with `ApiError` (code `NETWORK_ERROR`).
  - Removed the unused `node-fetch` dependency.

## 0.1.0

### Minor Changes

- 1552a97: Refactor fetch configuration with centralized settings module
  - Extract fetch configuration logic to dedicated `utils/settings.ts` module
  - Implement `fetchCore` function as single source of truth for HTTP requests
  - Improve JSON type definitions to resolve circular reference issues
  - Fix `JSONObject` index signature compatibility
  - Enhance type safety across API client methods
