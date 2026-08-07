# Deploy

This portfolio runs on one Cloudflare Worker: **`portfolio`** at
`https://portfolio.huynhsang.id.vn`.

## Ownership

- **GitHub Actions** owns the `quality` job (CI only, no deploy): runs on every
  PR and on every push to `main` — `format:check` → `typecheck` → `lint` →
  `test:run` → `next build`.
- **Cloudflare Workers Builds** owns deployment (CD): connected to the
  `HuynhSang2005/portfolio` repository, it builds and deploys on every push to
  the production branch (`main`).
- Cloudflare dashboard owns runtime configuration (Worker variables, secrets,
  custom domain, R2 bucket, rate limiter).

There is no `deploy` job in GitHub Actions — Workers Builds is the only path
that publishes the Worker, so CI and CD cannot conflict.

## Workers Builds settings

In the Cloudflare dashboard: **Workers & Pages → `portfolio` → Settings → Builds**.

| Setting                      | Value                              |
| ---------------------------- | ---------------------------------- |
| Git repository               | `HuynhSang2005/portfolio`          |
| Production branch            | `main`                             |
| Build command                | `npx opennextjs-cloudflare build`  |
| Deploy command               | `npx opennextjs-cloudflare deploy` |
| Non-production branch builds | Off (preview URLs are optional)    |

The OpenNext CLI (`opennextjs-cloudflare`) installs dependencies, runs
`next build`, produces `.open-next`, and invokes `wrangler deploy`.

## Production resources

| Resource                                | Purpose                                  |
| --------------------------------------- | ---------------------------------------- |
| Worker `portfolio`                      | Next.js/OpenNext production runtime      |
| `portfolio-cache`                       | OpenNext incremental cache               |
| `portfolio-media`                       | Published craft media                    |
| `CONTACT_RATE_LIMITER` namespace `1001` | Contact form protection                  |
| Supabase project `portfolio`            | Metrics and optional auth session client |

Runtime secrets are entered only in Worker **Settings → Variables & Secrets**:

- `SUPABASE_SERVICE_ROLE_KEY`
- `TURNSTILE_SECRET_KEY`
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`

Browser-safe values belong in the matching production build/runtime configuration:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`

Never commit real values and never prefix a service-role key with `NEXT_PUBLIC_`.

## Daily commands

```bash
# UI development
bun run dev

# Before merge
bun run validate
bun run test:e2e:smoke

# When changing visual UI intentionally
bun run test:e2e:visual
```

`bun run preview` is optional Workers-runtime debugging only. It is not a routine
gate on this machine because workerd is memory-intensive.

## Branch protection

After the first green `quality / quality` run on `main`, enable branch protection:

- Require a pull request before merging.
- Require the `quality / quality` check to pass before merging (`strict: true`).
- Disallow force pushes; allow the owner a break-glass bypass via the GitHub
  admin override if needed.

## Manual production deploy (break-glass)

```bash
bun run deploy
```

Ask the owner before running it. The scripts invoke OpenNext/Wrangler through
Node because Wrangler rejects the Bun runtime.

## Post-deploy smoke

1. Confirm `/`, `/blog`, `/craft`, and `/contact` return `200`.
2. Open one blog and one craft detail page.
3. Confirm the contact form renders and validates. Send a real message only when
   intentionally testing Resend/Turnstile.
4. Check Worker Logs only if there is an error; do not log message content,
   email addresses, API keys, or service-role keys.

Keep release evidence small: commit SHA, build URL, canonical URL result, and
any redacted diagnostic note.

## Rollback and diagnosis

Owner-approved rollback: **Cloudflare → Workers & Pages → portfolio →
Deployments** and restore the prior known-good version. Then re-run the
canonical HTTP smoke.

| Symptom               | First action                                                                                                    |
| --------------------- | --------------------------------------------------------------------------------------------------------------- |
| `quality` fails       | Read the failing step; the workflow prints the failing `bun run` command and a focused error                    |
| Workers Builds fails  | Check the build in **Deployments → View build history**; fix and push a new commit; roll back via the dashboard |
| Cache/binding failure | Verify `portfolio-cache` binding and regenerate types with `bun run cf-typegen` after config changes            |
| Contact fails         | Verify Turnstile, Resend, recipient, and limiter bindings/secrets in the production Worker                      |
| Production regression | Roll back the Worker version, smoke the canonical origin, then investigate                                      |
