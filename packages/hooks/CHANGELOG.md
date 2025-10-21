# @aglaya/hooks

## 0.1.1

### Patch Changes

- ca55afc: docs: Update README with comprehensive documentation for all hooks
  - Add complete documentation for all 7 hooks in the package
  - Include usage examples, API documentation, and TypeScript examples
  - Add table of contents with anchor links for easy navigation
  - Document useNavigationHistory, useOnlineStatus, useLocalStorage, useDebounce, useClickOutside, useMedia, and usePrevious
  - Improve code examples with real-world use cases

## 0.1.0

### Minor Changes

- 2b0e4c5: feat: Add @aglaya/logger package and integrate logging in hooks
  - Create new @aglaya/logger package with structured logging (DEBUG, INFO, WARN, ERROR levels)
  - Add ANSI color support and timestamps for terminal logging
  - Integrate logger into useLocalStorage, useNavigationHistory, and useOnlineStatus hooks
  - Add ESLint disable comments for TypeScript unsafe warnings from logger integration

### Patch Changes

- Updated dependencies [2b0e4c5]
  - @aglaya/logger@0.1.0
