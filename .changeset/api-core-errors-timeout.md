---
"@aglaya/api-core": minor
---

Timeouts and consistent errors:

- `options.timeout` (and `ApiClient`'s `timeout`, previously ignored) now aborts each attempt with an `ApiError` (code `TIMEOUT`).
- Non-2xx responses keep the server's `message` and `errorCode`/`code` from a JSON body, and expose the body as `error.data`.
- With `retry`, failures now reject with `ApiError` (status, code) instead of a plain `Error`.
- Network failures reject with `ApiError` (code `NETWORK_ERROR`).
- Removed the unused `node-fetch` dependency.
