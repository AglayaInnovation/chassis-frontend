# `@aglaya/ai-kit`

The Aglaya team's AI coding environment as a versioned package. It installs and keeps in sync the
Claude Code setup (agents, skills, slash commands, hooks, permissions, MCP servers, and the team
standards in `CLAUDE.md`) across every project and every developer machine.

## Quick start

```bash
# In a project (commit the result so the whole team gets it)
npx @aglaya/ai-kit init --preset frontend

# On your machine, for every repo you open (writes to ~/.claude)
npx @aglaya/ai-kit init --global
```

Later, to pick up a new kit version:

```bash
npx @aglaya/ai-kit@latest sync
```

## Commands

| command  | what it does                                                                     |
| -------- | -------------------------------------------------------------------------------- |
| `init`   | Installs `core` plus the chosen presets. Interactive if `--preset` is omitted.   |
| `sync`   | Re-applies the presets recorded in `.claude/ai-kit.lock.json` with this version. |
| `status` | Dry-run of `sync`. Exits `1` if anything is out of sync, so CI can use it.       |
| `list`   | Lists presets.                                                                   |

Options: `--preset a,b`, `--global`, `--dir <path>`, `--force`, `--dry-run`, `--verbose`.

## Presets

| preset     | adds                                                                                                                                               |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `core`     | Always applied. Team standards, permissions allow/deny, file-guard hook, `code-reviewer` agent, `/commit`, `/review`, `conventional-commits` skill |
| `frontend` | `senior-frontend-mentor` agent, `react-conventions` skill, Playwright MCP server                                                                   |
| `library`  | `changesets-release` skill, `/release-check` command                                                                                               |

## What gets written and how updates behave

| target                                    | strategy                                                                                |
| ----------------------------------------- | --------------------------------------------------------------------------------------- |
| `.claude/agents,commands,skills,hooks/**` | Copied. Tracked by hash in `.claude/ai-kit.lock.json`.                                  |
| `.claude/settings.json`                   | Deep-merged: arrays unioned, local scalars win. Your own permissions/hooks are kept.    |
| `.mcp.json`                               | Deep-merged the same way (project installs only).                                       |
| `CLAUDE.md`                               | Only the block between `aglaya-ai-kit:start/end` markers is managed. The rest is yours. |

On `sync`, a copied file is updated only if it still matches what the kit last wrote. If someone edited
it locally, it is reported as a **conflict** and left alone (use `--force` to take the team version).
Files a newer kit no longer ships are removed if untouched, otherwise reported as **orphaned**.

Enforce the standard in CI:

```yaml
- run: npx @aglaya/ai-kit@latest status
```

## Contributing a new agent, skill or preset

1. Add files under `templates/<preset>/`:
   - `claude/**` → copied to `.claude/**`
   - `claude/settings.json` → merged into `.claude/settings.json`
   - `mcp.json` → merged into `.mcp.json`
   - `CLAUDE.block.md` → appended to the managed block of `CLAUDE.md`
   - `preset.json` → `{ "description": "..." }`
2. Templates can use `{{projectName}}`, `{{pm}}`, `{{pmRun}}` and `{{hooksDir}}`.
3. Run `yarn test`, add a changeset, and open a PR. After release, projects pick it up with `sync`.

Templates use `claude/` and `CLAUDE.block.md` instead of `.claude/` and `CLAUDE.md` on purpose, so
Claude Code doesn't load them as live config while you work on this repo.
