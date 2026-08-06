# Deploy

This portfolio uses one Cloudflare Worker: **`portfolio`** at
`https://portfolio.huynhsang.id.vn`.

## Ownership

- GitHub Actions runs the source and production-build check: `bun run validate`.
- Cloudflare Workers Builds deploys protected `main` to `portfolio`.
- Local `bun run deploy` is a break-glass production action and needs owner approval.

GitHub Actions never receives a Cloudflare deploy token. Do not configure preview
or staging Workers for this site unless a recurring, concrete need is established.

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

## Configure Workers Builds once

In Cloudflare: **Workers & Pages → portfolio → Settings → Builds**.

1. Connect the GitHub repository.
2. Select production branch `main`.
3. Leave non-production branch builds disabled.
4. Set:

| Field          | Value                                                                                                                  |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Build command  | `bun install --frozen-lockfile && bun run build && node ./node_modules/@opennextjs/cloudflare/dist/cli/index.js build` |
| Deploy command | `node ./node_modules/@opennextjs/cloudflare/dist/cli/index.js deploy`                                                  |

After the first successful `quality` workflow run, protect `main` with only the
`quality / quality` required check. Disallow force pushes; keep an owner
break-glass path for incidents.

## Manual production deploy

```bash
bun run deploy
```

Ask the owner before running it. The scripts invoke OpenNext/Wrangler through Node
because Wrangler rejects the Bun runtime.

## Post-deploy smoke

1. Confirm `/`, `/blog`, `/craft`, and `/contact` return `200`.
2. Open one blog and one craft detail page.
3. Confirm the contact form renders and validates. Send a real message only when
   intentionally testing Resend/Turnstile.
4. Check Worker Logs only if there is an error; do not log message content,
   email addresses, API keys, or service-role keys.

Keep release evidence small: commit SHA, Workers Build/version link, canonical URL
result, and any redacted diagnostic note.

## Rollback and diagnosis

Owner-approved rollback: **Cloudflare → Workers & Pages → portfolio → Deployments**
and restore the prior known-good version. Then re-run the canonical HTTP smoke.

| Symptom                | First action                                                                                         |
| ---------------------- | ---------------------------------------------------------------------------------------------------- |
| GitHub `quality` fails | Run `bun run validate` locally                                                                       |
| Workers Build fails    | Inspect the Cloudflare build log; run `bun run build` locally                                        |
| Cache/binding failure  | Verify `portfolio-cache` binding and regenerate types with `bun run cf-typegen` after config changes |
| Contact fails          | Verify Turnstile, Resend, recipient, and limiter bindings/secrets in the production Worker           |
| Production regression  | Roll back the Worker version, smoke the canonical origin, then investigate                           |
