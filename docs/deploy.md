# Deploy

This portfolio uses one Cloudflare Worker: **`portfolio`** at
`https://portfolio.huynhsang.id.vn`.

## Ownership

- **GitHub Actions** is the single source of build truth.
  - The `quality` job runs on every PR and on every push to `main`:
    `bun install --frozen-lockfile` → `bun run format:check` → `bun run typecheck`
    → `bun run lint` → `bun run test:run` → `bun run build` → OpenNext build.
  - The `deploy` job runs **only** on a successful push to `main` and publishes
    the OpenNext bundle via `wrangler deploy` using the
    `CLOUDFLARE_API_TOKEN` secret. No preview/staging environments are wired.
- **Cloudflare dashboard** owns the runtime configuration that the bundle reads
  (Worker settings, variables, secrets, custom domain, R2 bucket, rate limiter).
- Local `bun run deploy` is a break-glass production action and needs owner approval.

GitHub Actions is the only path that mutates the live Worker. The Wrangler OAuth
token is for local diagnostics only — it does not have the
"Workers Scripts: Edit" scope required for a remote deploy.

## Production resources

| Resource                                | Purpose                                  |
| --------------------------------------- | ---------------------------------------- |
| Worker `portfolio`                      | Next.js/OpenNext production runtime      |
| `portfolio-cache`                       | OpenNext incremental cache               |
| `portfolio-media`                       | Published craft media                    |
| `CONTACT_RATE_LIMITER` namespace `1001` | Contact form protection                  |
| Supabase project `portfolio`            | Metrics and optional auth session client |

Cloudflare runtime secrets are entered only in Worker **Settings → Variables & Secrets**:

- `SUPABASE_SERVICE_ROLE_KEY`
- `TURNSTILE_SECRET_KEY`
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`

Browser-safe values belong in the matching production build/runtime configuration:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`

Never commit real values and never prefix a service-role key with `NEXT_PUBLIC_`.

## GitHub Actions secrets (one-time)

`Settings → Secrets and variables → Actions → Repository secrets`:

| Secret                  | Purpose                                                                                |
| ----------------------- | -------------------------------------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | Cloudflare API token with **Workers Scripts: Edit** scope for the `portfolio` worker.  |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID hosting `portfolio`. Visible in the dashboard URL.               |

Use a Cloudflare **API Token** (not the Wrangler OAuth) so the scope is explicit
and revokable from a single place. The token never needs Workers KV/D1/Queues
scopes for this site.

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
- Do not require the `deploy` job as a merge gate — it only runs on `main` and
  will always show "skipped" on PR branches.

`gh api` snippet (run once, owner-only):

```bash
gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  repos/HuynhSang2005/portfolio/branches/main/protection \
  -f required_status_checks='{"strict":true,"contexts":["quality / quality"]}' \
  -f enforce_admins=false \
  -f required_pull_request_reviews='{"required_approving_review_count":0,"dismiss_stale_reviews":true}' \
  -f restrictions='null' \
  -f allow_force_pushes=false \
  -f allow_deletions=false \
  -f required_linear_history=false \
  -f required_conversation_resolution=true \
  -f block_creations=false
```

## Manual production deploy

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

Keep release evidence small: commit SHA, workflow run URL, canonical URL
result, and any redacted diagnostic note.

## Rollback and diagnosis

Owner-approved rollback: **Cloudflare → Workers & Pages → portfolio → Deployments**
and restore the prior known-good version. Then re-run the canonical HTTP smoke.

| Symptom                | First action                                                                                          |
| ---------------------- | ----------------------------------------------------------------------------------------------------- |
| `quality` fails        | Read the failing step; the workflow prints the failing `bun run` command and a focused error         |
| `deploy` fails         | Re-run the workflow (`Actions → quality → Re-run jobs`); if the bundle is broken, roll back via the dashboard |
| Cache/binding failure  | Verify `portfolio-cache` binding and regenerate types with `bun run cf-typegen` after config changes  |
| Contact fails          | Verify Turnstile, Resend, recipient, and limiter bindings/secrets in the production Worker            |
| Production regression  | Roll back the Worker version, smoke the canonical origin, then investigate                            |
