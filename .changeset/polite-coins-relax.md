---
"@aglaya/eslint-config": minor
---

feat: Add ESLint 9 support and remove strict TypeScript rules

- Add support for ESLint 8 and 9 via dual config format (legacy and flat config)
- Create base.mjs and next.mjs for ESLint 9 flat config compatibility
- Remove strict TypeScript type-checking rules (no-unsafe-*, explicit-function-return-type)
- Keep only @typescript-eslint/no-unused-vars rule for better developer experience
- Fix package.json exports to support both .js extensions and named paths
- Update README with usage examples for both ESLint 8 and ESLint 9
- Maintain backward compatibility with legacy .eslintrc.js configs
