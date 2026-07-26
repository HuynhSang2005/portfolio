<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md

Portfolio site: Next.js App Router (`src/app`), TypeScript strict, Tailwind CSS, Bun-only toolchain.

## Next.js docs

- Before writing or changing Next.js code, read the matching guide under `node_modules/next/dist/docs/`.
- Prefer those bundled docs for the installed Next.js version over training knowledge.
- If bundled docs and prior knowledge conflict, bundled docs win.
- Do not guess Next.js APIs, options, or conventions.

## Package manager

- Use Bun only: `bun add`, `bun add --dev`, `bun remove`, `bun run <script>`, `bunx`.
- Do not use npm, npx, pnpm, yarn, or their lockfiles.
- Do not switch package managers.

## Architecture

- App Router only under `src/app`. Prefer React Server Components.
- Add `"use client"` only for state, effects, event handlers, client context, or browser APIs. Keep client boundaries small.
- Do not turn a whole page or layout into a Client Component for a small interactive island.
- Prefer Server Actions or Route Handlers per current bundled docs and use case.
- Do not use Pages Router.
- Do not add custom Webpack or Babel config unless required.

## TypeScript

- Keep `strict` on. Do not use `any` to dodge type errors.
- Do not use `@ts-ignore` / `@ts-nocheck` without a concrete reason.
- Prefer inference when types are clear; type API boundaries, component props, and external data explicitly.
- Validate untrusted data at runtime when needed.

## Lint and format

- Oxlint is the only linter (`.oxlintrc.json`). Oxfmt is the only formatter (`.oxfmtrc.json`).
- Do not install or configure ESLint or Prettier, or add scripts that call them.
- After edits, run project scripts for Oxlint and Oxfmt. Do not hand-format against Oxfmt output.

## Agent tooling in this repo

- Skills: `.agents/skills/` (also `.cursor/skills/`). Prefer `/srcwalk` for code navigation.
- MCP: `.cursor/mcp.json` includes `next-devtools` (`bunx next-devtools-mcp@latest`). Full Next DevTools tools need `bun run dev` running.
- Prefer Context7 MCP for library docs when bundled Next docs are not enough; prefer Tavily for live web research.

## Scripts

| Script                                    | Purpose                         |
| ----------------------------------------- | ------------------------------- |
| `bun run dev`                             | Dev server (Turbopack default)  |
| `bun run build` / `bun run start`         | Production build / serve        |
| `bun run typecheck`                       | `tsc --noEmit`                  |
| `bun run lint` / `bun run lint:fix`       | Oxlint                          |
| `bun run format` / `bun run format:check` | Oxfmt                           |
| `bun run check`                           | typecheck + lint + format:check |
| `bun run validate`                        | check + build                   |

## Workflow

Before editing:

1. Read this file.
2. Read related source files (prefer `srcwalk` for structure).
3. Find matching Next.js docs under `node_modules/next/dist/docs/`.
4. Check existing dependencies and scripts.
5. Choose the smallest change set.

After editing:

1. `bun run format`
2. `bun run typecheck`
3. `bun run lint`
4. Run relevant tests if the repo has them.
5. `bun run build` when changing routing, config, rendering boundaries, caching, metadata, middleware, server code, or important dependencies.
6. Review the diff for out-of-scope changes.
7. Report files changed, checks run, and remaining errors.

## Change limits

- Do not add dependencies unless needed; check for an existing equivalent first.
- Do not bump Next.js, React, Bun, Oxlint, or Oxfmt unless asked.
- Do not edit generated files or unrelated files for drive-by refactors.
- Do not delete working code without a clear reason.
- Do not disable typechecking or lint rules broadly to hide errors.
- Do not run destructive data commands.
- Do not commit secrets or `.env` contents.
