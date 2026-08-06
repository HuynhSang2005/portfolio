# Portfolio

Next.js App Router portfolio targeting Cloudflare Workers via OpenNext, with Supabase as the backend platform.

## Stack

- Next.js 16 + React 19 + TypeScript strict + Bun
- OpenNext (`@opennextjs/cloudflare`) + Wrangler
- Supabase (`@supabase/ssr`)
- Tailwind CSS v4 + shadcn/ui (Base UI)
- Zod 4, React Hook Form, TanStack Query, nuqs, Zustand, Motion, date-fns
- Oxlint + Oxfmt
- Vitest + Testing Library + Playwright

## Setup

```bash
bun install
cp .env.example .env.local
# fill NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
bun run dev
```

## Scripts

| Command                   | Purpose                                           |
| ------------------------- | ------------------------------------------------- |
| `bun run dev`             | Local Next.js development                         |
| `bun run build`           | Next.js production build                          |
| `bun run check`           | typecheck + lint + format:check + unit tests      |
| `bun run validate`        | check + build (never deploys)                     |
| `bun run test:run`        | Vitest once                                       |
| `bun run test:e2e:smoke`  | Local Playwright smoke                            |
| `bun run test:e2e:visual` | Local clone-owned visual regression               |
| `bun run preview`         | Optional local Workers runtime — not a merge gate |
| `bun run deploy`          | Break-glass production deploy (owner only)        |

## Delivery

- **GitHub Actions** owns both gates on `main`:
  - `quality` — runs on every PR and push (`bun run validate` + OpenNext build).
  - `deploy` — push to `main` only, requires `quality` to pass, publishes the
    OpenNext bundle via `wrangler deploy` using `CLOUDFLARE_API_TOKEN`.
- Canonical production origin: `https://portfolio.huynhsang.id.vn`.
- Deployment, smoke, diagnostics, and rollback: [`docs/deploy.md`](docs/deploy.md).

See `AGENTS.md` for agent/contributor conventions.
