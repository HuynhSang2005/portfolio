# P5 Extras — Design Spec

> Status: **Draft for owner review — do not execute until spec + plan are approved.**
> Depends on: P1–P4. Canonical-origin migration was completed after P4: `https://portfolio.huynhsang.id.vn` is the production origin; `https://huynhsang.id.vn` is the legacy apex redirect only.

## 1. Goal

Complete explicitly deferred template extras and production-operational polish without changing the established canonical origin. This spec includes the deferred SEO migration follow-up, but does not authorize its external-console actions until the owner approves the relevant P5 task.

## 2. Scope

### 2.1 Template extras and content polish

- Re-confirm each optional template surface before implementation: `cal-grid`, `vercel-grid`, craft RSS/Atom, public LLM-facing copy (`llms.txt` or equivalent), clock, buddy, Cal, and analytics.
- Replace placeholder blog/craft content and owner identity/contact values only when the owner supplies final copy and identity data.
- Configure production Turnstile and Resend sender-domain DNS as owner-gated operations.

### 2.2 Platform hardening

- Prefer Cloudflare Workers Builds CI for reproducible OpenNext deployments.
- Keep runtime secrets in Wrangler/Cloudflare secrets only; do not commit them or bake them into client/server bundles.
- Evaluate R2 incremental cache only when production evidence shows cache misses under load.

### 2.3 SEO migration follow-up

The public canonical architecture is fixed for this follow-up:

```text
https://huynhsang.id.vn/<path>?<query>
  -- Cloudflare Single Redirect (308; preserve path + query) -->
https://portfolio.huynhsang.id.vn/<path>?<query>
```

- The canonical sitemap is `https://portfolio.huynhsang.id.vn/sitemap.xml`.
- `robots.txt` must continue to advertise that sitemap, and sitemap/RSS entries must continue to use `https://portfolio.huynhsang.id.vn`.
- Owner-gated external actions:
  1. Verify or add the `portfolio.huynhsang.id.vn` property in Google Search Console and Bing Webmaster Tools.
  2. Submit the canonical sitemap in each verified property.
  3. Use URL Inspection and Indexing/Coverage reports for representative canonical URLs.
- Do not submit a legacy-apex sitemap, add Search Console/Bing credentials or API tokens to the repository, or create a new crawler integration.
- Record a secret-free migration log: action date, property, sitemap URL, representative URLs, acceptance result, and baseline/follow-up metrics.

### 2.4 Monitoring and escalation

Collect a baseline immediately before the external submission, then review after 7 days, 28 days, and after any material traffic/indexing alert:

- HTTP correctness: apex requests return exactly one `308` to the equivalent canonical URL, preserving path and query.
- Crawlability: canonical `/robots.txt`, `/sitemap.xml`, and `/feed.xml` return `200`; robots points to the canonical sitemap.
- Indexing: canonical selection, submitted-sitemap processing, page indexing/coverage, and crawl errors in Search Console/Bing.
- Reliability: redirect loops, incorrect destinations, 4xx/5xx patterns, and canonical URL mismatches.
- Discovery: impressions, clicks, queries, and organic traffic changes compared with the baseline.

Indexing delay alone is not a rollback signal. Escalate for investigation when there is a redirect loop, an incorrect canonical target, persistent crawl-affecting 4xx/5xx, a sitemap fetch failure, or a material coverage regression attributable to the migration. Consider disabling the apex redirect or restoring the prior canonical origin only after evidence identifies a systemic migration defect and the owner explicitly approves the production change.

## 3. Out of Scope

- Attaching `huynhsang.id.vn` as a Worker custom domain. The apex must remain available for future projects and currently redirects at Cloudflare.
- Automatic Search Console/Bing submission, remote API access, credential storage, DNS changes, redirect-rule changes, deployment, or production rollback without a separate owner authorization.
- Admin CMS, Supabase contact-submission persistence, and mandatory local `bun run preview`.

## 4. Architecture and Constraints

- `src/config/site.ts` owns `SITE_URL`; it remains `https://portfolio.huynhsang.id.vn`.
- `src/app/robots.ts`, `src/app/sitemap.ts`, RSS, metadata, and JSON-LD consume this canonical origin rather than independently declaring an origin.
- Cloudflare owns the legacy-apex redirect. The Worker owns the canonical subdomain.
- Daily DX remains `bun run dev`; Workers-true verification is `bun run deploy` followed by remote smoke. Local `bun run preview` is optional and rare.
- No new dependency is required for this documentation/operations task.

## 5. Acceptance Criteria

- P5 documents name `https://portfolio.huynhsang.id.vn` as the sole canonical production origin.
- P5 documents describe `https://huynhsang.id.vn` only as a path/query-preserving Cloudflare `308` legacy redirect, not as a Worker custom domain.
- The canonical sitemap URL, monitoring signals, owner-access requirements, and escalation/rollback boundary are explicit.
- The SEO follow-up can be executed by an owner without source changes, credentials in the repository, or ambiguity about what evidence to retain.
