# Optimization

Optimize `AGENTS.md` for agent performance, not document completeness.

## Context Window

- Keep root short because it loads broadly.
- Move local context into nested files when directory scope differs.
- Link docs instead of copying them.
- Prefer concise bullets over explanatory prose.
- Remove content true for most repositories.

## Signal Density

Highest signal content:

- exact commands agents need.
- edit boundaries.
- generated and contract surfaces.
- repo-specific conventions.
- docs routes for risky changes.
- topology hints for large repos.

Low signal content:

- generic quality advice.
- long background explanations.
- full script catalogs.
- human onboarding prose.
- repeated root guidance in nested files.

## Logic and Scope

Each instruction should have the right scope:

- root: broadly applicable.
- nested: subtree-specific.
- linked docs: detailed human-maintained knowledge.
- tool-specific files: compatibility-only guidance.

## Safety

Promote boundaries around:

- secrets and env files.
- production systems.
- infrastructure changes.
- migrations and data changes.
- generated files.
- public APIs and schemas.

## Maintainability

The file should be easy to update when commands, topology, or contracts change. Prefer fewer durable rules over many fragile details.
