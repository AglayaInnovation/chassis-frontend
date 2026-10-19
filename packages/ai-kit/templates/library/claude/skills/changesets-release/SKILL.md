---
name: changesets-release
description: How to version and release packages with Changesets in Aglaya monorepos. Use when a change touches a published package, when asked to prepare a release, or to pick a semver bump.
---

# Releasing with Changesets

1. Make the change in `packages/<name>`.
2. Add a changeset: `{{pmRun}} changeset` (or write `.changeset/<slug>.md` directly):

   ```md
   ---
   "@aglaya/hooks": minor
   ---

   Add `useOnlineStatus` hook to track network connectivity.
   ```

3. Merge to `main`. CI opens a "Version Packages" PR; merging it publishes to npm.

## Picking the bump

| change                                                  | bump  |
| ------------------------------------------------------- | ----- |
| bug fix, no API change                                  | patch |
| new export, new optional prop/option                    | minor |
| removed/renamed export, changed signature, new peer dep | major |

- Do not bump versions in `package.json` by hand; `changeset version` does it.
- Private packages and apps (e.g. `examples`) do not need changesets.
