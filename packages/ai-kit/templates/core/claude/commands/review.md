---
description: Review the current branch against the base branch using the team checklist
argument-hint: [base branch, default main]
allowed-tools: Bash(git diff:*), Bash(git log:*), Bash(git merge-base:*), Read, Grep, Glob
---

Review the changes on this branch with the `code-reviewer` agent. Base branch: "$ARGUMENTS"
(use `main` if empty).

1. List the commits (`git log --oneline <base>..HEAD`) and changed files (`git diff --stat <base>...HEAD`).
2. Hand the diff to the `code-reviewer` agent.
3. Report findings ordered by severity (blocking, should-fix, nit), each with `file:line`, the concrete
   failure scenario, and a suggested fix. End with a one-line verdict.
