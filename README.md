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

| Command            | Purpose                                      |
| ------------------ | -------------------------------------------- |
| `bun run dev`      | Local Next.js development                    |
| `bun run preview`  | Build and preview in Workers runtime         |
| `bun run build`    | Next.js production build                     |
| `bun run check`    | typecheck + lint + format:check + unit tests |
| `bun run validate` | check + build                                |
| `bun run test:run` | Vitest once                                  |
| `bun run test:e2e` | Playwright e2e                               |
| `bun run deploy`   | Deploy to Cloudflare Workers (explicit only) |

See `AGENTS.md` for agent/contributor conventions.
