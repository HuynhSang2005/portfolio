# P4 Contact — Design Spec (Template Clone, Sub-project 4)

> Status: **Approved by user — spec + plan gates passed** (2026-08-03); **scope expanded 2026-08-03** (craft + Supabase prod migration + Workers deploy); **DX strategy revised 2026-08-03** (Workers-true smoke via Cloudflare deploy — not local `bun run preview`).
> Decomposition ratified: P1 Foundation → P2 Home → P3 Blog → **P4 Contact (+ craft + prod cutover)** → P5 Extras.
> Depends on: P1 spec (chrome, globals tokens, Button/Field/Input primitives, env module), P2 spec (Section/Separator chrome, RevealOnLoad, sound wiring), P3 (MDX pipeline patterns reused by craft).
> Sources of truth: `docs/template-analysis.md` + `PRODUCT.md` (contact form is a capability target), template live at `http://localhost:6969` — **verified 2026-08-03: the template has no contact page**; P4 is a new surface in the cloned visual language, not a fidelity clone. Craft **is** a template surface (masonry + MDX teasers).
> Custom domain (owner): **`huynhsang.id.vn`** on Cloudflare Workers.

## 1. Goal

Add a `/contact` route with a working contact form — validated client + server side, spam-protected, rate-limited, delivering to the owner's inbox via Resend — that looks and feels like it was always part of the template (Section/Separator chrome, mono metadata voice, pill Button, sound-on-hover parity with other interactive rows).

Additionally (scope expansion, user decision 2026-08-03): ship `/craft` (masonry index + `[slug]` detail) so the dock link no longer 404s; confirm Supabase `post_metrics` migration on the production portfolio project; run `bun run deploy` to Cloudflare Workers once **laptop quality gates** (`bun run check` / validate as appropriate) are green — then smoke Workers-true behavior on Cloudflare (`*.workers.dev` and/or **`huynhsang.id.vn`**), not via local OpenNext preview.

## 2. Scope

**In scope (P4):**

- **`/contact` route** (RSC shell): `FloatingHeader scrollTitle="Contact"`, Section/Separator chrome, header block (`h1 font-bold text-2xl tracking-tight` + muted description, blog-index voice), direct-email fallback row (mailto link from `siteConfig`), the client form island, footer metadata row (mono muted "typically replies within 24h" style line — placeholder text, owner-editable).
- **Form island** (`src/features/contact/components/contact-form.tsx`, client): React Hook Form + `@hookform/resolvers` + Zod 4 schema shared client/server; fields — name, email, subject (optional), message; honeypot `company` text field (visually hidden, must stay empty); Turnstile widget; submit Button with pending state; inline `aria-live` status region for success/error (no toast lib); Field/FieldLabel/FieldError primitives for per-field errors.
- **Server Action** (`src/features/contact/actions/send-message.ts`, `"use server"`): re-validate with the same Zod schema; honeypot check → silent success; Turnstile `siteverify`; Workers rate-limiter binding check (key = client IP); Resend email send (`emails.send`, plain fetch-based SDK — Workers-compatible); typed result `{ ok: true } | { ok: false; code: "validation" | "turnstile" | "rate-limited" | "delivery"; fieldErrors? }`.
- **Rate limiting**: Cloudflare Workers **rate limiter binding** `CONTACT_RATE_LIMITER` (5 submissions/hour per IP, user-approved over KV/in-memory); accessed via `getCloudflareContext()` — no `runtime = "edge"`.
- **Spam protection**: Cloudflare Turnstile widget (user-approved), managed mode; hidden honeypot as a free secondary layer (not a substitute).
- **Wrangler/env wiring**: `ratelimits` binding in `wrangler.jsonc`; env surface documented in `.dev.vars.example` (`RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `CONTACT_TO_EMAIL`) + public site key via `NEXT_PUBLIC_TURNSTILE_SITE_KEY`; `bun run cf-typegen` refreshes `CloudflareEnv` types.
- **Nav**: add Contact entry to the P1 dock/nav config (id `contact`, lucide `MailIcon`, route `/contact`) per the existing nav-item pattern.
- **`/craft` surface** (user decision 2026-08-03 — pulled from P5 Extras into P4): masonry index + `/craft/[slug]` MDX detail, scrubbed of template-author identity and all `pro.ruixen.com` commercial links; card CTA is internal "View details". Preview videos under `public/media/craft/` (not `public/craft/` — avoids Workers static-asset collision with `/craft/[slug]`). MDX content bundled at build via `scripts/bundle-mdx-content.ts` (Workers have no runtime `fs` for feature content). **Not** in this expansion: `cal-grid`, `vercel-grid`, craft feed.xml, LLM copy toolbar / llms routes (remain P5).
- **Supabase prod cutover**: confirm `post_metrics` migration (`supabase/migrations/20260803000000_post_metrics.sql`) is applied on the HuynhSang `portfolio` project used as production; advisors WARN on intentional anon SECURITY DEFINER RPCs for views/likes (accepted P3 design).
- **Workers deploy + remote smoke** (user-approved 2026-08-03; DX revised same day): after laptop gates, `bun run deploy` (or Workers Builds CI). Smoke on Cloudflare — custom domain **`huynhsang.id.vn`** and/or `*.workers.dev`. Production secrets via `wrangler secret` / dashboard — never committed. **Local `bun run preview` is not a P4 completion gate** (optional, rare; laptop cannot sustain OpenNext+workerd as default).

**Out of scope (P4):** storing contact submissions in Supabase (email-only delivery), admin inbox UI, attachments/file upload, newsletter signup, Cal/booking embed (template's `/cal` — P5), SMTP relay alternatives, Email Workers inbound pipeline, OG image for `/contact` (deferred, same as P2/P3), real owner copy/reply-time claims (placeholder text policy from P2 applies — clearly editable, no fabricated commitments beyond neutral wording), craft playground experiments (`cal-grid` / `vercel-grid`), craft RSS / llms routes, **mandatory local Workers preview / WSL OpenNext preview loops**.

## 3. Global Constraints

- All P1–P3 Global Constraints apply verbatim.
- **New runtime deps (user-approved decisions, 2026-08-03):** `resend` (email delivery), `@marsidev/react-turnstile` (Turnstile widget wrapper — verify current maintenance status at plan time; fallback = raw `challenges.cloudflare.com/turnstile/v0/api.js` script + `useRef` render, zero-dep). `textarea` primitive added via `bunx --bun shadcn@latest add textarea`. No other new deps: no toast lib, no `lru-cache`, no per-request `axios`.
- **Server Action** for the mutation (bundled Next 16 docs: `node_modules/next/dist/docs/` — verify action size/return-serializability constraints at plan time); **not** a route handler (no client fetch wrapper needed, progressive enhancement preserved).
- Secrets discipline: `RESEND_API_KEY`/`TURNSTILE_SECRET_KEY` never `NEXT_PUBLIC_*`, never committed; `.dev.vars.example` placeholders only; production via `wrangler secret` (owner-run, out of agent scope).
- Workers-safe only: Resend SDK is fetch-based (OK under `nodejs_compat`); Turnstile verify is a single `fetch` POST to `https://challenges.cloudflare.com/turnstile/v0/siteverify`; rate limiter is a binding call — no Node-only modules anywhere in this flow.
- Multi-instance safe by construction: binding-backed rate limit + stateless action — **no** module-level counters (template's archived `lru-cache` pattern explicitly rejected).
- No template-author identity: no references to template URLs/author anywhere in copy.
- Placeholder copy policy (P2 §7): neutral, clearly-editable strings; the reply-time line is the owner's to keep or delete.
- **DX (ratified 2026-08-03):** daily work = `bun run dev` (+ unit/e2e against Next). Workers-true evidence (rate limit, Resend on Workers, SSG-on-Workers) = **`bun run deploy` → smoke on Cloudflare** (`huynhsang.id.vn` / workers.dev). Prefer Workers Builds for reproducible production builds when available. Do not treat local `bun run preview` as required. See `.superpowers/sdd/dx-cloudflare-decision.md`.

## 4. Architecture

```text
src/
├── app/
│   ├── contact/
│   │   └── page.tsx                     # RSC shell (chrome + metadata + form island)
│   └── craft/
│       ├── page.tsx                     # NEW (P4 expansion): masonry index + JSON-LD
│       ├── craft-card.tsx               # NEW: client theme-aware video card
│       └── [slug]/page.tsx             # NEW: MDX detail (mirror blog)
├── features/contact/
│   ├── actions/
│   │   └── send-message.ts              # "use server" — validate/verify/limit/deliver
│   ├── components/
│   │   ├── contact-form.tsx             # client island (RHF + Turnstile + status)
│   │   └── turnstile-widget.tsx         # thin client wrapper (theme-aware, lazy)
│   └── lib/
│       ├── contact-schema.ts            # shared Zod schema + types
│       └── turnstile.ts                 # siteverify helper (fetch)
├── features/craft/
│   ├── content/*.mdx                    # NEW: scrubbed craft posts
│   ├── data/posts.ts                    # NEW: reads bundled content.generated.ts
│   ├── data/content.generated.ts        # NEW: prebuild codegen (Workers-safe)
│   └── types/post.ts                    # NEW: Zod frontmatter
├── components/ui/
│   ├── textarea.tsx                     # via shadcn CLI
│   └── masonry-grid.tsx                 # NEW: CSS column masonry
├── public/media/craft/*.mp4             # NEW: theme-aware videos (path ≠ /craft route)
├── scripts/bundle-mdx-content.ts        # NEW: prebuild MDX → generated modules
wrangler.jsonc                           # ratelimits binding; custom domain huynhsang.id.vn
.dev.vars.example                        # contact env keys
src/config/site.ts                       # nav entries (contact + craft already present)
supabase/migrations/                     # post_metrics confirmed on prod project
src/middleware.ts                        # Edge session refresh (OpenNext workaround vs proxy.ts)
```

## 5. Surface Design Notes

- **Page composition** mirrors the blog index rhythm: `ScrollArea` + `FloatingHeader`, `.layout .content-wrapper` container, `h1` + muted `text-sm` description, `Section` chrome between blocks.
- **Direct-email row** above the form: `text-muted-foreground text-sm` — "Prefer email? `hello@…`" mailto link with `prose-a` underline-offset styling; address from `siteConfig` (single source, P1).
- **Form layout**: `FieldGroup` vertical; `Field` + `FieldLabel` (`text-sm font-medium`) + `Input`/`Textarea` + `FieldError` (`text-sm text-destructive`, `role="alert"`); message textarea `rows={5}`, `resize-y`; honeypot field `aria-hidden` + `tabIndex={-1}` + `autoComplete="off"`, absolutely positioned off-screen (**not** `display:none` — bots detect it).
- **Turnstile placement** above submit; theme follows `resolvedTheme` from `@wrksz/themes` (P1), re-rendering on theme change via widget `key`.
- **Submit Button**: default variant, `size="lg"` pill (per meta-plan visual language), full-width on mobile / auto on `sm+`; pending = `disabled` + "Sending…" label swap (no spinner dependency); success state = inline `aria-live="polite"` `text-sm` confirmation + `form.reset()`; failure = inline destructive message, field-level errors via `FieldError`.
- **Footer row**: `Section` + mono muted line (placeholder reply-time copy).
- **Sound**: submit Button + mailto row get `useItemHoverSound` wiring (P2 pattern) for parity with Projects/Experience rows.
- **Reveal**: page blocks wrapped in `RevealOnLoad` (P2 primitive), up-direction, staggered delays matching blog index cadence.

## 6. Data Flow & State

1. Client: RHF controls fields; Zod resolver validates on submit (and on blur after first submit attempt); honeypot + Turnstile token collected at submit time.
2. Submit → Server Action with `{ name, email, subject?, message, turnstileToken, company }`.
3. Action: Zod parse → honeypot check (non-empty ⇒ return `{ ok: true }` without sending — silent drop, no signal to bots) → Turnstile `siteverify` (token + secret; fail ⇒ `{ ok: false, code: "turnstile" }`) → rate limiter `env.CONTACT_RATE_LIMITER.limit({ key: ip })` (fail ⇒ `{ ok: false, code: "rate-limited" }`) → Resend `emails.send({ from: "Contact Form <onboarding@resend.dev>" /* dev; owner domain in prod */, to: CONTACT_TO_EMAIL, replyTo: email, subject, text })` → `{ ok: true }`.
4. Client: `ok` ⇒ reset + success message; `validation` ⇒ map `fieldErrors` into RHF (`setError`); others ⇒ inline error message; network throw ⇒ caught, generic error message.
5. IP source: `request.headers` is not available in actions the same way as route handlers — read `x-forwarded-for`/`cf-connecting-ip` via `headers()` (bundled docs at plan time confirm the idiom); fall back to a constant key in dev.
6. **Dev-mode degradation**: under `bun run dev` (pure Next, no Workers bindings) the rate-limit check is skipped with a one-line console note; Turnstile runs with Cloudflare's always-pass **test keys** in `.dev.vars.example`; **full enforcement is verified after `bun run deploy` on Cloudflare** (domain `huynhsang.id.vn` and/or workers.dev) — not via mandatory local `bun run preview`.

## 7. Defect Fixes & Decisions

1. **Email provider = Resend** (user decision, 2026-08-03): template parity (archived template used Resend-class API), fetch-based SDK, free tier. Dev uses `onboarding@resend.dev` → verified owner inbox; production sender domain DNS for **`huynhsang.id.vn`** is an owner/DNS task — documented, not agent-executed unless asked.
2. **Spam = Turnstile (managed) + honeypot** (user decision): widget + `siteverify` server check; honeypot silent-drop. No reCAPTCHA, no third-party CAPTCHA accounts.
3. **Rate limit = Workers rate limiter binding** (user decision): multi-instance safe, native to the deploy target; KV-counter alternative rejected (eventually consistent). Binding `period` is 10|60s only → **`limit: 3, period: 60`** (plan supersedes any "5/hour" wording).
4. **Server Action over route handler**: progressive enhancement, RHF result mapping, no manual fetch plumbing; verified against bundled Next 16 docs at plan time.
5. **No submission persistence**: email is the record; Supabase tables deliberately not added (scope discipline — adding storage is P5+ if wanted).
6. **Shared schema module** (`contact-schema.ts`) imported by both the island (resolver) and the action (parse) — single source, no drift.
7. **Nav entry** added via P1's nav config pattern rather than a hard-coded link — keeps dock drawer/dock in sync.
8. **Sound wiring**: hover sounds only (P2 hooks); **no** success jingle — reserved semantics from the template (jingle = unmute only).
9. **Workers DX (user decision 2026-08-03):** OpenNext stack kept; **do not** gate P4 on local OpenNext/workerd preview. Daily loop = `bun run dev`. Workers-true smoke = deploy to Cloudflare. Local preview optional/rare only. Resend key rotation **not required** (owner decision).
10. **Craft media path**: videos live under `/media/craft/*` so Cloudflare static assets do not shadow `/craft/[slug]` routes.

## 8. Testing & Fidelity

- **Vitest**:
  - `contact-schema.test.ts` — valid payload, bad email, over-length message, honeypot field accepted-but-flagged.
  - `send-message.test.ts` — action with mocked `fetch` (Turnstile verify + Resend), mocked `getCloudflareContext().env` limiter: validation fail, honeypot silent-success, turnstile fail, rate-limited, resend error → `delivery`, happy path `{ ok: true }`.
  - `turnstile.test.ts` — siteverify helper: success/failure/network-error mapping.
  - Craft/blog posts unit tests against bundled `content.generated.ts` / scrubbed MDX.
- **Playwright E2E** (`contact.spec.ts`): against `bun run dev` — header/form + empty-submit validation; optional Workers-path cases gated on env / remote base URL (not local preview).
- **Workers remote smoke** (completion gate for bindings/Resend/rate-limit): after `bun run deploy`, on `https://huynhsang.id.vn` (and/or workers.dev): contact success; 4th rapid submit → rate-limited; `/craft` + `/craft/[slug]` + `/blog/[slug]` → 200.
- **Checks (laptop):** `bun run format && typecheck && lint && test:run` (and `validate` when build boundaries change). **Not required:** local `bun run preview`.

## 9. Success Criteria

- `/contact` renders within the cloned chrome; indistinguishable in style density/voice from `/blog` index (manual @Browser side-by-side with template home/blog for tone, not pixel-diff — no counterpart).
- Laptop gates green: unit + contact e2e (dev) + checks.
- After deploy to Cloudflare: valid submit → email to `CONTACT_TO_EMAIL`; invalid → field errors; Turnstile fail → `turnstile`; **4th submit in 60s** → `rate-limited` on **`huynhsang.id.vn`** (or workers.dev).
- `/craft` and `/craft/[slug]` serve on Cloudflare without asset/route collision; no template commercial links.
- No secrets in the repo; `.dev.vars.example` documents every key; `wrangler.jsonc` binding present; custom domain wired for `huynhsang.id.vn`.

## 10. Risks

| Risk                                                  | Mitigation                                                                                                     |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Server Actions differ on OpenNext/Workers vs Node dev | Unit mocks + **remote smoke after deploy** on Cloudflare (§8); OpenNext bundled/docs at plan time              |
| `getCloudflareContext()` missing under `next dev`     | Dev-degradation branch (§6.6); binding enforcement asserted on **deployed** Worker only                        |
| `@marsidev/react-turnstile` maintenance drift         | Plan-time check; raw-script fallback documented in §3                                                          |
| Resend requires verified domain for production From   | Owner DNS for **`huynhsang.id.vn`**; until then `onboarding@resend.dev` path may apply                         |
| Rate limiter unavailable in local `next dev`          | Documented skip in development; never silently fail-closed in production without binding                       |
| Local OpenNext preview saturates laptop CPU/RAM       | **Removed as gate**; use Cloudflare deploy/Workers Builds; optional local preview only with explicit owner ask |
| Static `/craft/*.mp4` shadows `/craft/[slug]`         | Media under `/media/craft/`; confirm on Cloudflare after deploy                                                |
| New surface drifts from cloned visual language        | §5 pins class/voice; manual conformance pass                                                                   |
