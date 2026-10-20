---
name: conventional-commits
description: Team commit message convention. Use when writing a commit message, squashing commits, or titling a pull request.
---

# Conventional Commits (Aglaya)

Format:

```
<type>(<optional scope>): <imperative summary, lowercase, no period, <= 72 chars>

<optional body: what and why, not how. Wrap at 100.>

<optional footer: BREAKING CHANGE: ..., Refs: #123>
```

Types:

| type       | use for                                    | release impact |
| ---------- | ------------------------------------------ | -------------- |
| `feat`     | new user-facing capability                 | minor          |
| `fix`      | bug fix                                    | patch          |
| `perf`     | performance improvement without API change | patch          |
| `refactor` | internal change, no behavior change        | none           |
| `docs`     | documentation only                         | none           |
| `test`     | adding or fixing tests                     | none           |
| `chore`    | tooling, deps, config, release             | none           |
| `ci`       | CI pipelines                               | none           |

Rules:

- Scope is the package or area: `feat(hooks): add useOnlineStatus`.
- One logical change per commit. If the summary needs "and", split it.
- `!` after type/scope or a `BREAKING CHANGE:` footer for breaking changes.

Examples:

```
fix(api-core): retry idempotent requests on 503
feat(ui)!: rename Button `type` prop to `variant`

BREAKING CHANGE: `type` is now `variant`; `type` is passed to the DOM element.
```
