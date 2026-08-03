# AGENTS.md

Portfolio site: Next.js 16 App Router (`src/app`), React 19, TypeScript strict, Tailwind CSS v4, Bun-only toolchain. Deploy target: Cloudflare Workers via OpenNext (never Vercel). Product truth lives in `PRODUCT.md`; human docs in `README.md` and `docs/`.

## Commands

| Command                                   | Purpose                                     |
| ----------------------------------------- | ------------------------------------------- |
| `bun run dev`                             | Next.js dev server (Turbopack)              |
| `bun run build` / `bun run start`         | Next production build / serve               |
| `bun run typecheck`                       | `tsc --noEmit`                              |
| `bun run lint` / `bun run lint:fix`       | Oxlint (only linter)                        |
| `bun run format` / `bun run format:check` | Oxfmt (only formatter)                      |
| `bun run test` / `bun run test:run`       | Vitest (watch / single run)                 |
| `bun run test:e2e`                        | Playwright e2e                              |
| `bun run check`                           | typecheck + lint + format:check + test:run  |
| `bun run validate`                        | check + build                               |
| `bun run preview`                         | OpenNext build + Workers preview            |
| `bun run deploy`                          | OpenNext build + Workers deploy (ask first) |
| `bun run cf-typegen`                      | Generate Cloudflare env types               |

Package manager is Bun only: `bun add`, `bun add --dev`, `bun remove`, `bun run <script>`, `bunx`. Never npm, npx, pnpm, yarn, or their lockfiles.

## Boundaries

### Always

- Read the matching bundled Next.js doc (`node_modules/next/dist/docs/`) before writing or changing Next.js code.
- Run `bun run format`, `bun run typecheck`, `bun run lint` after edits; fix what they report.
- Prefer srcwalk over rg, grep, cat, and similar tools. Start with `srcwalk guide`.
- Validate untrusted data (env, forms, API boundaries) with Zod 4.

### Ask first

- Adding or upgrading dependencies; check for an existing equivalent first.
- Deploying (`bun run deploy`), `wrangler login`, or any production/remote change.
- Database schema changes (migrations under `supabase/`).
- Committing or pushing; use Conventional Commits and never leave `cursoragent` as commit author.

### Never

- Commit secrets, `.env.local`, `.dev.vars`, or the local-only paths `.agents/`, `.cursor/`, `.impeccable/`, `skills-lock.json`, `portfolio-template-ui-ux/`.
- Expose `SUPABASE_SERVICE_ROLE_KEY` to the client or any `NEXT_PUBLIC_*` var.
- Use `export const runtime = "edge"` (unsupported by `@opennextjs/cloudflare`).
- Use Pages Router, ESLint, Prettier, canary Next.js releases, or Radix `asChild` patterns.
- Disable typecheck/lint rules broadly, edit generated files, delete working code without reason, or run destructive data commands.

## Next.js

<!-- BEGIN:nextjs-agent-rules -->

This is NOT the Next.js you know: APIs, conventions, and file structure differ from training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing code; bundled docs win over prior knowledge. Heed deprecation notices (e.g. `middleware.ts` is deprecated — use `src/proxy.ts`).
<!-- END:nextjs-agent-rules -->

- App Router only under `src/app`; prefer React Server Components.
- Add `"use client"` only for state, effects, event handlers, client context, or browser APIs; keep client boundaries small. Never make a whole page/layout a Client Component for one interactive island.
- Prefer Server Actions or Route Handlers per bundled docs and use case.
- No custom Webpack/Babel config unless required.
- Feature modules under `src/features/`; UI primitives under `src/components/ui/` (shadcn).

## Supabase

- Clients: `src/lib/supabase/server.ts` (RSC / Server Actions / Route Handlers), `src/lib/supabase/client.ts` (browser), session refresh in `src/lib/supabase/proxy.ts` wired from `src/proxy.ts`.
- Validate public env via `getPublicEnv()` (`src/lib/env/schema.ts`) — no non-null assertions on env.
- `.env.example` is the template for env changes; schema/migrations live under `supabase/`.
- Use the Supabase plugin + Supabase MCP for Auth, RLS, and SSR cookie patterns.

## Cloudflare / OpenNext

- Config: `wrangler.jsonc`, `open-next.config.ts`, `.dev.vars` / `.dev.vars.example`.
- Local DX is `bun run dev`; `bun run preview` for the Workers runtime (prefer WSL — Windows preview is flaky).
- Avoid Node-only native modules on server paths that Workers cannot run.
- Read OpenNext Cloudflare docs before changing caching, bindings, or deploy config; use the Cloudflare plugin + Cloudflare MCPs for bindings, builds, and observability.

## UI stack

- shadcn/ui with **Base UI** (`components.json` style `base-nova`): use `render` prop patterns, not Radix `asChild`. Add components via `bunx --bun shadcn@latest add <name>`; use the shadcn plugin when working with components.
- Tailwind v4 + CSS variables in `src/app/globals.css`; use semantic tokens (`bg-background`, `text-muted-foreground`), not raw palette classes.
- React Hook Form + `@hookform/resolvers` for complex client forms (admin).
- TanStack Query for client server-state cache; prefer RSC data fetch for public pages.
- nuqs (`NuqsAdapter` in `src/app/providers.tsx`) for URL search/filter/pagination state.
- Zustand via factory + provider pattern (`src/stores/`, `src/providers/`); no module-level stores (SSR).
- Motion: import from `motion/react` or `motion/react-client`; prefer LazyMotion when bundle size matters. Search the Motion MCP docs before writing animation code.
- Dates: prefer `Intl`; shared helpers in `src/lib/datetime.ts`.

## TypeScript

- Keep `strict` on; never use `any` to dodge errors or `@ts-ignore` / `@ts-nocheck` without a concrete reason.
- Prefer inference where clear; type API boundaries, component props, and external data explicitly.

## Testing

- Unit/component: Vitest + Testing Library, specs under `tests/unit/`; use `bun run test:run` (not watch) in agent loops.
- E2E: Playwright, specs under `tests/e2e/`; prefer `playwright-cli` for agent browser automation.
- Do not over-mock; assert user-visible behavior.

## Tool routing

Route each task to its dedicated skill, plugin, or MCP before falling back to generic tools.

| Task                                                 | Route                                                                                                                                |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Code navigation, repo maps, symbols, callers, impact | `srcwalk` skill + CLI (`srcwalk guide` first)                                                                                        |
| Next.js APIs and runtime behavior                    | Bundled docs, then `next-devtools` MCP (`nextjs_docs`, `nextjs_index`, `nextjs_call`, `browser_eval`; live tools need `bun run dev`) |
| React/Next.js component quality                      | `react-doctor` plugin                                                                                                                |
| shadcn/ui components                                 | `shadcn` plugin                                                                                                                      |
| Supabase (Auth, RLS, SSR, schema, logs)              | `supabase` plugin + Supabase MCP                                                                                                     |
| Cloudflare (Workers, bindings, builds, logs)         | `cloudflare` plugin + Cloudflare MCPs                                                                                                |
| Animation                                            | `Motion` MCP (`search-motion-docs`)                                                                                                  |
| Library/framework/SDK docs                           | Context7 MCP (`resolve-library-id` → `query-docs`)                                                                                   |
| Live web research, comparison, verification          | Tavily MCP + built-in web search, combined                                                                                           |
| UI/UX design work                                    | `impeccable` skill (run its `scripts/context.mjs` once per session; product truth in `PRODUCT.md`)                                   |
| Complex multi-step engineering                       | `superpowers` skills (brainstorming, writing-plans, executing-plans, TDD, systematic-debugging, verification-before-completion)      |
| Transcript memory and the Learned sections below     | `continual-learning` skill → `agents-memory-updater` subagent; only that flow edits Learned sections                                 |

## Research and evidence

- For online research, comparison, or verification, combine Context7 (library docs), Tavily (live web), and built-in web search; do not rely on training data alone for fast-moving APIs.
- Prefer official sources (vendor docs, RFCs, source repos). Treat unofficial articles as leads only; verify against official sources or the installed code before applying.
- Ground truth for versions and APIs is the installed tree: `node_modules/`, `bun.lock`, and the configs in this repo.
- Gather evidence before acting: read diffs, logs, stack traces, and terminal output; reproduce errors before fixing; report what you observed, not guesses.

## Bundled package guidance

Check installed packages for agent-facing docs before going external — they are version-matched to what actually runs. Re-scan for `AGENTS.md`, `llms.txt`, `docs/`, and `skills/` under `node_modules/<pkg>/` when adding or upgrading dependencies.

- `node_modules/next/dist/docs/` — full Next.js docs for the installed version.
- `node_modules/@supabase/supabase-js/AGENTS.md` — official agent instructions; canonical API is TSDoc in its `src/`; `migrations/` for caller-action changes.
- `node_modules/@supabase/ssr/docs/design.md` — SSR auth internals and session data flows.
- `node_modules/@base-ui/react/docs/` — Base UI docs (overview, components, handbook, utils); Tailwind v4 examples.
- `node_modules/date-fns/docs/` — date-fns guides (tokens, time zones, i18n, FP).

## Workflow

Before editing: read this file → inspect the relevant code (srcwalk) → read bundled Next docs for Next work → check existing dependencies and scripts → choose the smallest change set.

After editing: `bun run format` → `bun run typecheck` → `bun run lint` → relevant tests (`bun run test:run`; `bun run test:e2e` for critical flows) → `bun run build` when touching routing, config, rendering/caching boundaries, metadata, `src/proxy.ts`, server code, OpenNext/Wrangler, or major dependencies → review the diff for out-of-scope changes → report files changed, checks run, and remaining errors.

## Learned User Preferences

- Use only `AGENTS.md` for agent instructions; do not create `CLAUDE.md`.
- Prefer Conventional Commits; do not leave Cursor/agent identity (`cursoragent`) as the git commit author in history.
- Stick to Next.js stable releases only; do not use canary or preview channels unless explicitly asked.
- Configure OpenNext/Wrangler and preview/deploy scripts without running `wrangler login` or production deploy unless explicitly asked.
- Vet dependencies before proposing them: verify maintenance with authoritative data (npm registry publish dates, download counts, GitHub activity); prefer actively-maintained modern packages or small owned/local utilities over stale deps (user rejected `next-themes`, `react-fast-marquee`, `reading-time`, `github-slugger`, `gray-matter`). If data shows a package the user called stale is actually maintained, keep it and present the evidence (e.g. `remark-gfm`).
- Gate execution on explicit user approval: the user reviews and approves specs, then plans (sometimes in batches), before implementation starts; do not execute until the user says so.

## Learned Workspace Facts

- Supabase project for this portfolio lives under the HuynhSang workspace/organization (project name `portfolio`); never store or commit database passwords or other secrets in docs.
- pnpm is not installed on this machine; run pnpm-based third-party projects (e.g. the reference template) with Bun instead.
- Ratified build strategy (in `PRODUCT.md`): replicate the `portfolio-template-ui-ux/portfolio-main` UI/UX/design/animation 100% (MIT license, author Sri Somanaath G — remove all author personal info before publishing) re-platformed to this repo's stack; user-approved phase specs/plans live under `docs/superpowers/specs/` and `docs/superpowers/plans/`.
