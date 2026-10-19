---
description: Check that the branch is ready to release (changesets, build, tests, exports)
allowed-tools: Bash(git diff:*), Bash(git status:*), Bash({{pmRun}} build:*), Bash({{pmRun}} test:*), Bash({{pmRun}} lint:*), Read, Glob, Grep
---

Verify this branch is releasable:

1. List packages under `packages/` changed vs `main` (`git diff --name-only main...HEAD`).
2. For each published (non-private) changed package, confirm a `.changeset/*.md` entry covers it and the
   bump matches the `changesets-release` skill. Flag missing or under-bumped ones.
3. Run lint, build and tests; report failures with their real output.
4. For changed packages, check that every path in `exports` / `main` / `types` exists after build.

Finish with a checklist (✅/❌) per package and the exact commands to fix any ❌.
