<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md

Portfolio site: Next.js App Router (`src/app`), TypeScript strict, Tailwind CSS, Bun-only toolchain. Deploy target is Cloudflare Workers via OpenNext (not Vercel).

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
- Feature-oriented code under `src/features/` when building product modules; UI primitives under `src/components/ui/` (shadcn).

## Cloudflare / OpenNext

- Local DX: `bun run dev` (Next.js). Production-like Workers runtime: `bun run preview`.
- Deploy scripts exist (`bun run deploy`) but do not deploy unless the user explicitly asks.
- Config: `wrangler.jsonc`, `open-next.config.ts`, `.dev.vars` / `.dev.vars.example`.
- Do not use `export const runtime = "edge"` — unsupported with `@opennextjs/cloudflare`.
- Avoid Node-only native modules on the server path that Workers cannot run.
- Read OpenNext Cloudflare docs before changing caching, bindings, or deploy config.

## Supabase

- Clients: `src/lib/supabase/server.ts` (RSC / Server Actions / Route Handlers), `src/lib/supabase/client.ts` (browser), session refresh helper in `src/lib/supabase/proxy.ts` wired from `src/proxy.ts` (Next 16 `proxy` convention; the old `middleware.ts` file convention is deprecated).
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client or `NEXT_PUBLIC_*`.
- Do not commit `.env.local` or real secrets. Use `.env.example` as the template.
- Schema/migrations live under `supabase/` when added; do not invent production schema changes without migrations.
- Prefer Supabase MCP / current docs for Auth, RLS, and SSR cookie patterns.

## UI stack

- shadcn/ui with **Base UI** (`components.json` style `base-nova`). Use `render` prop patterns, not Radix `asChild`.
- Add components via `bunx --bun shadcn@latest add <name>`.
- Tailwind v4 + CSS variables in `src/app/globals.css`. Use semantic tokens (`bg-background`, `text-muted-foreground`), not raw palette classes for theming.

## State, forms, validation, motion, dates

- Zod 4 for runtime validation (env, forms, API boundaries).
- React Hook Form + `@hookform/resolvers` for complex client forms (admin).
- TanStack Query for client server-state cache; prefer RSC data fetch for public pages.
- nuqs (`NuqsAdapter` in providers) for URL search/filter/pagination state.
- Zustand via per-request/factory + provider pattern (`src/stores/`, `src/providers/`) — no module-level store for SSR.
- Motion: import from `motion/react` or `motion/react-client`; keep client boundaries small; prefer LazyMotion when bundle size matters.
- Dates: prefer `Intl` for display; use `date-fns` helpers in `src/lib/datetime.ts` when needed.

## TypeScript

- Keep `strict` on. Do not use `any` to dodge type errors.
- Do not use `@ts-ignore` / `@ts-nocheck` without a concrete reason.
- Prefer inference when types are clear; type API boundaries, component props, and external data explicitly.
- Validate untrusted data at runtime when needed.

## Lint and format

- Oxlint is the only linter (`.oxlintrc.json`). Oxfmt is the only formatter (`.oxfmtrc.json`).
- Do not install or configure ESLint or Prettier, or add scripts that call them.
- After edits, run project scripts for Oxlint and Oxfmt. Do not hand-format against Oxfmt output.

## Testing

- Unit/component: Vitest + Testing Library (`bun run test` / `bun run test:run`). Tests under `tests/unit/`.
- E2E: Playwright Test (`bun run test:e2e`). Specs under `tests/e2e/`.
- Agent browser automation: prefer `playwright-cli` when available; use `vitest run` (not watch) in agent loops.
- Do not over-mock; assert user-visible behavior.

## Agent tooling in this repo

- Skills: `.agents/skills/` (also `.cursor/skills/`). Prefer `/srcwalk` for code navigation.
- MCP: `.cursor/mcp.json` includes `next-devtools` (`bunx next-devtools-mcp@latest`). Full Next DevTools tools need `bun run dev` running.
- Prefer Context7 MCP for library docs when bundled Next docs are not enough; prefer Tavily for live web research.
- Cloudflare / Supabase / shadcn plugins and skills when touching those areas.

## Scripts

| Script                                    | Purpose                                     |
| ----------------------------------------- | ------------------------------------------- |
| `bun run dev`                             | Next.js dev server (Turbopack)              |
| `bun run preview`                         | OpenNext build + Workers preview            |
| `bun run deploy`                          | OpenNext build + Workers deploy (ask first) |
| `bun run build` / `bun run start`         | Next production build / serve               |
| `bun run typecheck`                       | `tsc --noEmit`                              |
| `bun run lint` / `bun run lint:fix`       | Oxlint                                      |
| `bun run format` / `bun run format:check` | Oxfmt                                       |
| `bun run test` / `bun run test:run`       | Vitest                                      |
| `bun run test:e2e`                        | Playwright                                  |
| `bun run check`                           | typecheck + lint + format:check + test:run  |
| `bun run validate`                        | check + build                               |
| `bun run cf-typegen`                      | Generate Cloudflare env types               |

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
4. Run relevant tests (`bun run test:run`, and e2e when touching critical flows).
5. `bun run build` when changing routing, config, rendering boundaries, caching, metadata, middleware, server code, OpenNext/Wrangler, or important dependencies.
6. Review the diff for out-of-scope changes.
7. Report files changed, checks run, and remaining errors.

## Change limits

- Do not add dependencies unless needed; check for an existing equivalent first.
- Do not bump Next.js, React, Bun, Oxlint, Oxfmt, or OpenNext unless asked.
- Do not edit generated files or unrelated files for drive-by refactors.
- Do not delete working code without a clear reason.
- Do not disable typechecking or lint rules broadly to hide errors.
- Do not run destructive data commands.
- Do not commit secrets or `.env` / `.env.local` contents.
- Do not deploy to Cloudflare unless explicitly requested.

## Learned User Preferences

- Use only `AGENTS.md` for agent instructions; do not create `CLAUDE.md`.
- Prefer Conventional Commits; do not leave Cursor/agent identity (`cursoragent`) as the git commit author in history.
- Stick to Next.js stable releases only; do not use canary or preview channels unless explicitly asked.
- Configure OpenNext/Wrangler and preview/deploy scripts without running `wrangler login` or production deploy unless explicitly asked.

## Learned Workspace Facts

- Supabase project for this portfolio lives under the HuynhSang workspace/organization (project name `portfolio`); never store or commit database passwords or other secrets in docs.
