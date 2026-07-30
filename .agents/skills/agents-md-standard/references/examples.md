# Examples

These are illustrative fragments. Adapt them only when repo evidence supports the content.

## Good: Small Root

```markdown
# AGENTS.md

- This repo is a Python CLI package; source lives in `src/ledger_cli/`.
- Use `uv run pytest` for the full test suite.
- Read `docs/cli-contract.md` before changing command names or output formats.
```

## Good: Monorepo Root Router

```markdown
# AGENTS.md

- Packages live under `apps/` and `packages/`; each deployable app has its own `AGENTS.md`.
- Use `pnpm --filter api test` for scoped tests.
- For schema changes, read `packages/api/AGENTS.md` before editing generated clients.
```

## Good: Service Nested File

```markdown
# AGENTS.md

- This service owns the billing API and database migrations.
- Run tests from this directory with `go test ./...`.
- Ask before changing migrations that modify existing columns.
```

## Good: Generated Boundary

```markdown
- Do not edit `src/generated/` directly. Update `api/openapi.yaml` and run `pnpm generate`.
```

## Good: Infra Safety

```markdown
- Do not run apply/deploy commands. Limit local validation to `terraform fmt`, `terraform validate`, and plan review unless the user explicitly approves.
```

## Good: MCP and Agent Assets

```markdown
- MCP server definitions live in `mcp/servers/`; update `docs/mcp-contracts.md` when tool inputs or outputs change.
- Prompt evals live in `evals/`; run `pnpm eval --filter prompt-safety` after changing prompts.
```

## Bad: Generic Advice

```markdown
- Write clean and maintainable code.
- Follow best practices.
```

## Bad: Vendor-Contaminated Standard

```markdown
- Rely on one tool's override behavior as the source of truth for all agents.
```

## Bad: README Copy

```markdown
This project is easy to install. First clone the repository, then follow the getting started tutorial below...
```
