---
"@aglaya/api-core": minor
---

Refactor fetch configuration with centralized settings module

- Extract fetch configuration logic to dedicated `utils/settings.ts` module
- Implement `fetchCore` function as single source of truth for HTTP requests
- Improve JSON type definitions to resolve circular reference issues
- Fix `JSONObject` index signature compatibility
- Enhance type safety across API client methods
