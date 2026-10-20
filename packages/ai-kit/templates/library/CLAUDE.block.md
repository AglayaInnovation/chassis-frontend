## Library standards

- Every user-facing change to a published package needs a changeset (`{{pmRun}} changeset`). See the `changesets-release` skill.
- Public API lives in the package `exports`; anything not exported is internal and may change freely.
- Breaking changes require a major changeset and a migration note in the changeset body.
