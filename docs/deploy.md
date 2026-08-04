# Deploy runbook

Single source of truth for shipping this site to Cloudflare Workers. Target: `huynhsang.id.vn` (prod), Workers Builds preview URLs (staging/PR).

## Environments

| Environment          | URL                                                                         | How                                          |
| -------------------- | --------------------------------------------------------------------------- | -------------------------------------------- |
| Local dev            | `http://localhost:3000`                                                     | `bun run dev`                                |
| PR preview (staging) | `<branch>-portfolio.<account>.workers.dev`                                  | Workers Builds per-PR preview                |
| Production           | `https://huynhsang.id.vn` + `https://portfolio.huynhsang060305.workers.dev` | `bun run deploy` or Workers Builds on `main` |

## Secrets inventory

Server-only secrets (never `NEXT_PUBLIC_*`, never committed):

| Secret                          | Where used          | Set via                                         |
| ------------------------------- | ------------------- | ----------------------------------------------- |
| `TURNSTILE_SECRET_KEY`          | contact verify      | `wrangler secret put TURNSTILE_SECRET_KEY`      |
| `RESEND_API_KEY`                | contact email       | `wrangler secret put RESEND_API_KEY`            |
| `CONTACT_TO_EMAIL`              | contact inbox       | `wrangler secret put CONTACT_TO_EMAIL`          |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase clients    | `.dev.vars` / Workers Builds env var            |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase clients    | `.dev.vars` / Workers Builds env var            |
| `SUPABASE_SERVICE_ROLE_KEY`     | post metrics writes | `wrangler secret put SUPABASE_SERVICE_ROLE_KEY` |

> `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS — server-only (`src/lib/supabase/admin.ts`), never expose it to the client or `NEXT_PUBLIC_*`.
> Apply order for the metrics lockdown: set the secret first, then apply migration `20260804000000_lockdown_metric_rpcs.sql` (it revokes anon RPC execute; without the secret, views/likes increments return 500).

Local development: copy `.dev.vars.example` to `.dev.vars` and fill in. Templates: `.env.example`, `.dev.vars.example` (Turnstile test keys there are always-pass keys — replace with production keys before launch).

After changing secrets: `bun run cf-typegen` to refresh `cloudflare-env.d.ts`.

## Deploy

```bash
bun run deploy
```

- Ask the owner before any production deploy.
- `preview`/`deploy`/`upload` invoke the OpenNext CLI through Node (`node ./node_modules/@opennextjs/cloudflare/dist/cli/index.js ...`) because Wrangler rejects the Bun runtime. Do not "simplify" this to `bunx --bun`.
- `build` uses `next build --webpack`: OpenNext consumes the webpack standalone output; the default Turbopack production build is not verified with `@opennextjs/cloudflare@1.20.x`.
- `prebuild` (MDX → HTML bundling) runs automatically as a lifecycle hook; no need to call it manually before `build`. `test:run` calls it explicitly because Vitest does not trigger build lifecycles.

## Smoke checklist (after any deploy)

1. `GET /`, `/blog`, `/blog/<slug>`, `/craft`, `/craft/<slug>`, `/contact` → 200.
2. Contact form: valid submit → success; repeat rapid submits → rate-limited (429 path).
3. Turnstile renders (production keys, not test keys).
4. Videos on `/craft` load from R2 (not origin), lazy — no eager multi-MB downloads on page load.
5. Worker size: gzip script under the ~3 MiB Free-plan limit (check deploy output).

## CI/CD

- **GitHub Actions** (`.github/workflows/check.yml`): runs `bun run check` on every PR to `main`. Must be green before merge.
- **Cloudflare Workers Builds** (dashboard → Workers → `portfolio` → Settings → Builds): connect `HuynhSang2005/portfolio`.
  - Build command: `bun install && bun run build && npx opennextjs-cloudflare build`
  - Deploy command: `npx opennextjs-cloudflare deploy`
  - Non-production branches → preview URLs (use these for Workers-true smoke before merging).
  - Set the env vars/secrets above in the Workers Builds settings too.

## Custom domain

`huynhsang.id.vn` attaches via Workers → `portfolio` → Settings → Domains & Routes → Custom Domain. The domain must be on Cloudflare DNS (nameservers pointed). Until attached, the workers.dev URL is the prod smoke target.

## Troubleshooting

| Symptom                                                            | Cause                                          | Fix                                                                                         |
| ------------------------------------------------------------------ | ---------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `GET /` 404 + dev server restarts                                  | Turbopack OOM from Wrangler `getPlatformProxy` | Keep `OPENNEXT_CLOUDFLARE_DEV` unset for daily dev; set `=1` only when testing bindings     |
| `EvalError: Code generation from strings disallowed` on slug pages | Runtime MDX eval on Workers                    | MDX is precompiled by `scripts/bundle-mdx-content.ts`; never reintroduce runtime MDX        |
| Worker too large (>3 MiB)                                          | Heavy server bundles (Shiki/full deps)         | Keep deps lean; check what crept into the server bundle                                     |
| Contact secrets undefined on Workers                               | Reading `process.env` only                     | `getContactSecrets()` reads CF `env` first — keep it that way                               |
| Deprecation warning: `middleware` file convention                  | Next 16 prefers `proxy.ts`                     | **Keep** `src/middleware.ts` until `@opennextjs/cloudflare` supports Node `proxy.ts` on npm |
| Leftover `workerd` eating RAM after `bun run preview`              | Local Workers preview is heavy on this laptop  | `bun run preview` is optional/rare; kill leftover `workerd` processes                       |
