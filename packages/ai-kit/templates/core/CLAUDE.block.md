## Team standards (Aglaya)

- Package manager: `{{pm}}`. Run scripts with `{{pmRun}} <script>`; never mix package managers or edit lockfiles by hand.
- Before declaring a task done, run lint, tests and build for the packages you touched, and report the real output.
- Commits follow Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`); see the `conventional-commits` skill.
- Keep changes minimal and scoped to the task. Do not reformat unrelated code or add dependencies without saying why.
- Match the surrounding code: naming, comment density, file layout. TypeScript over JavaScript for new source files.
- Never read or print secrets (`.env*`, keys). Never force-push or rewrite shared history.
- When there are several reasonable approaches, state the one you chose, why, and the main alternative.
