---
description: Create a Conventional Commit from the current changes
argument-hint: [optional hint about intent]
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git add:*), Bash(git commit:*), Bash(git log:*)
---

## Context

- Status: !`git status --short`
- Staged diff: !`git diff --cached`
- Unstaged diff: !`git diff`
- Recent commits (style reference): !`git log --oneline -10`

## Task

Create a commit following the `conventional-commits` skill. Intent hint from the user: $ARGUMENTS

1. If nothing is staged, stage only the files that belong to one logical change. If the changes mix
   unrelated concerns, propose a split and ask before committing.
2. Write the message: type, scope (package or area), imperative summary, and a body explaining _why_
   when it is not obvious.
3. Commit. Do not push.
