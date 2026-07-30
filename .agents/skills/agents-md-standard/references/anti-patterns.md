# Anti-Patterns

Avoid these when creating or revising `AGENTS.md`.

## Generic Advice

Bad:

- write clean code.
- follow best practices.
- add tests when needed.
- keep things maintainable.

These do not encode repo-local context.

## README Copy

Do not paste setup tutorials, architecture overview, contribution rules, or release docs into AGENTS.md. Link them by need.

## Vendor Contamination

Do not let one tool's instruction loading behavior define the content model. Tool-specific behavior belongs in compatibility guidance only.

## Fake Certainty

Do not invent:

- commands.
- package names.
- owners.
- stack details.
- deployment process.
- conventions.

If evidence is missing, omit the claim or report uncertainty.

## Root Bloat

Root files become harmful when they contain local package rules, long docs, broad process instructions, or every possible command.

## Duplicate Nested Files

Nested files should not repeat root guidance. Duplication drifts and wastes context.

## Process Ceremony

AGENTS.md should not force agents through a ritual. It should give the local facts needed to choose good actions.
