# AGENTS.md Fragments

Use these as writing patterns, not templates.

## Scope Fragment

```markdown
# AGENTS.md

This file applies to the whole repository. More specific instructions live in nested `AGENTS.md` files.
```

## Project Identity Fragment

```markdown
- This repo contains a FastAPI service and a React admin app.
- Backend code lives in `services/api/`; frontend code lives in `apps/admin/`.
```

## Command Fragment

```markdown
- Run backend tests with `uv run pytest services/api/tests`.
- Run frontend checks with `pnpm --filter admin lint`.
```

## Monorepo Router Fragment

```markdown
- Start by locating the workspace package in `pnpm-workspace.yaml`.
- Use the nearest nested `AGENTS.md` for package-specific commands and contracts.
```

## Generated Boundary Fragment

```markdown
- Do not edit generated clients directly. Change the source schema and run the documented generator.
```

## Infra Safety Fragment

```markdown
- Treat infrastructure changes as ask-first. Validate locally, but do not deploy or apply without explicit user approval.
```

## MCP and Agent Assets Fragment

```markdown
- Agent skills live in `skills/`; each skill must keep `SKILL.md` concise and put detailed guidance in `references/`.
- MCP tool contracts live in `mcp/`; update the relevant contract docs when changing tool schemas.
```

## Bad Fragments to Avoid

```markdown
- Be careful and use best practices.
- This repo uses modern tooling.
- Always follow the team's standards.
- Use vendor-specific instruction behavior as the source of truth for AGENTS.md.
```
