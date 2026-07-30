# Essence

`AGENTS.md` is a Markdown file for coding agents. It complements human-facing docs by carrying repo-local context that helps agents understand how to work inside a project.

## Content Authority

Use these as primary authority:

- the official AGENTS.md format and examples.
- the target repository's current files, docs, commands, tests, generated markers, and explicit user instructions.

Use external articles as heuristics only. Use tool-vendor docs only for compatibility behavior.

## What It Is

- Scoped project context for AI coding agents.
- A concise map of local truths that are easy to miss.
- A place for commands, boundaries, conventions, and docs routes that affect edits.
- Living documentation that changes when agent-relevant repo reality changes.

## What It Is Not

- A replacement for README, CONTRIBUTING, architecture docs, or runbooks.
- A complete setup tutorial for humans.
- A generic coding prompt.
- A checklist that agents must follow mechanically.
- A vendor-specific instruction format.
- A dumping ground for every convention, script, or preference.

## Standard Boundary

The standard is plain Markdown plus scope. There are no required headings. The closest relevant `AGENTS.md` should carry the most specific context. Explicit user instructions still override repository instructions.

## Durable Rule

Keep a line only when it answers: "What would a capable coding agent do wrong in this repo if this line were absent?"
