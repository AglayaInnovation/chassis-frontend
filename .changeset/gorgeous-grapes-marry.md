---
"@aglaya/logger": minor
"@aglaya/hooks": minor
---

feat: Add @aglaya/logger package and integrate logging in hooks

- Create new @aglaya/logger package with structured logging (DEBUG, INFO, WARN, ERROR levels)
- Add ANSI color support and timestamps for terminal logging
- Integrate logger into useLocalStorage, useNavigationHistory, and useOnlineStatus hooks
- Add ESLint disable comments for TypeScript unsafe warnings from logger integration
