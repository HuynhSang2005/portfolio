# P4 Contact — Design Spec (Template Clone, Sub-project 4)

> Status: **Approved by user — spec + plan gates passed** (2026-08-03)
> Decomposition ratified: P1 Foundation → P2 Home → P3 Blog → **P4 Contact** → P5 Extras.
> Depends on: P1 spec (chrome, globals tokens, Button/Field/Input primitives, env module), P2 spec (Section/Separator chrome, RevealOnLoad, sound wiring).
> Sources of truth: `docs/template-analysis.md` + `PRODUCT.md` (contact form is a capability target), template live at `http://localhost:6969` — **verified 2026-08-03: the template has no contact page**; P4 is a new surface in the cloned visual language, not a fidelity clone.

## 1. Goal

Add a `/contact` route with a working contact form — validated client + server side, spam-protected, rate-limited, delivering to the owner's inbox via Resend — that looks and feels like it was always part of the template (Section/Separator chrome, mono metadata voice, pill Button, sound-on-hover parity with other interactive rows).

## 2. Scope

**In scope (P4):**

- **`/contact` route** (RSC shell): `FloatingHeader scrollTitle="Contact"`, Section/Separator chrome, header block (`h1 font-bold text-2xl tracking-tight` + muted description, blog-index voice), direct-email fallback row (mailto link from `siteConfig`), the client form island, footer metadata row (mono muted "typically replies within 24h" style line — placeholder text, owner-editable).
- **Form island** (`src/features/contact/components/contact-form.tsx`, client): React Hook Form + `@hookform/resolvers` + Zod 4 schema shared client/server; fields — name, email, subject (optional), message; honeypot `company` text field (visually hidden, must stay empty); Turnstile widget; submit Button with pending state; inline `aria-live` status region for success/error (no toast lib); Field/FieldLabel/FieldError primitives for per-field errors.
- **Server Action** (`src/features/contact/actions/send-message.ts`, `"use server"`): re-validate with the same Zod schema; honeypot check → silent success; Turnstile `siteverify`; Workers rate-limiter binding check (key = client IP); Resend email send (`emails.send`, plain fetch-based SDK — Workers-compatible); typed result `{ ok: true } | { ok: false; code: "validation" | "turnstile" | "rate-limited" | "delivery"; fieldErrors? }`.
- **Rate limiting**: Cloudflare Workers **rate limiter binding** `CONTACT_RATE_LIMITER` (5 submissions/hour per IP, user-approved over KV/in-memory); accessed via `getCloudflareContext()` — no `runtime = "edge"`.
- **Spam protection**: Cloudflare Turnstile widget (user-approved), managed mode; hidden honeypot as a free secondary layer (not a substitute).
- **Wrangler/env wiring**: `ratelimits` binding in `wrangler.jsonc`; env surface documented in `.dev.vars.example` (`RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `CONTACT_TO_EMAIL`) + public site key via `NEXT_PUBLIC_TURNSTILE_SITE_KEY`; `bun run cf-typegen` refreshes `CloudflareEnv` types.
- **Nav**: add Contact entry to the P1 dock/nav config (id `contact`, lucide `MailIcon`, route `/contact`) per the existing nav-item pattern.

**Out of scope (P4):** storing submissions in Supabase (email-only delivery), admin inbox UI, attachments/file upload, newsletter signup, Cal/booking embed (template's `/cal` — P5), SMTP relay alternatives, Email Workers inbound pipeline, OG image for `/contact` (deferred, same as P2/P3), real owner copy/reply-time claims (placeholder text policy from P2 applies — clearly editable, no fabricated commitments beyond neutral wording).

## 3. Global Constraints

- All P1–P3 Global Constraints apply verbatim.
- **New runtime deps (user-approved decisions, 2026-08-03):** `resend` (email delivery), `@marsidev/react-turnstile` (Turnstile widget wrapper — verify current maintenance status at plan time; fallback = raw `challenges.cloudflare.com/turnstile/v0/api.js` script + `useRef` render, zero-dep). `textarea` primitive added via `bunx --bun shadcn@latest add textarea`. No other new deps: no toast lib, no `lru-cache`, no per-request `axios`.
- **Server Action** for the mutation (bundled Next 16 docs: `node_modules/next/dist/docs/` — verify action size/return-serializability constraints at plan time); **not** a route handler (no client fetch wrapper needed, progressive enhancement preserved).
- Secrets discipline: `RESEND_API_KEY`/`TURNSTILE_SECRET_KEY` never `NEXT_PUBLIC_*`, never committed; `.dev.vars.example` placeholders only; production via `wrangler secret` (owner-run, out of agent scope).
- Workers-safe only: Resend SDK is fetch-based (OK under `nodejs_compat`); Turnstile verify is a single `fetch` POST to `https://challenges.cloudflare.com/turnstile/v0/siteverify`; rate limiter is a binding call — no Node-only modules anywhere in this flow.
- Multi-instance safe by construction: binding-backed rate limit + stateless action — **no** module-level counters (template's archived `lru-cache` pattern explicitly rejected).
- No template-author identity: no references to template URLs/author anywhere in copy.
- Placeholder copy policy (P2 §7): neutral, clearly-editable strings; the reply-time line is the owner's to keep or delete.

## 4. Architecture

```text
src/
├── app/
│   └── contact/
│       └── page.tsx                     # NEW: RSC shell (chrome + metadata + form island)
├── features/contact/
│   ├── actions/
│   │   └── send-message.ts              # NEW: "use server" — validate/verify/limit/deliver
│   ├── components/
│   │   ├── contact-form.tsx             # NEW: client island (RHF + Turnstile + status)
│   │   └── turnstile-widget.tsx         # NEW: thin client wrapper (theme-aware, lazy)
│   └── lib/
│       ├── contact-schema.ts            # NEW: shared Zod schema + types
│       └── turnstile.ts                 # NEW: siteverify helper (fetch)
├── components/ui/
│   └── textarea.tsx                     # NEW via shadcn CLI
wrangler.jsonc                           # MODIFY: ratelimits binding
.dev.vars.example                        # MODIFY: contact env keys
src/config/site.ts                       # MODIFY (P1 file): nav entry + contact email (re-validate gate confirms exact shape)
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
6. **Dev-mode degradation**: under `bun run dev` (pure Next, no Workers bindings) the rate-limit check is skipped with a one-line console note; Turnstile runs with Cloudflare's always-pass **test keys** in `.dev.vars.example`; full enforcement verified under `bun run preview`.

## 7. Defect Fixes & Decisions

1. **Email provider = Resend** (user decision, 2026-08-03): template parity (archived template used Resend-class API), fetch-based SDK, free tier. Dev uses `onboarding@resend.dev` → verified owner inbox; production sender domain DNS verification is an owner task — documented, not agent-executed.
2. **Spam = Turnstile (managed) + honeypot** (user decision): widget + `siteverify` server check; honeypot silent-drop. No reCAPTCHA, no third-party CAPTCHA accounts.
3. **Rate limit = Workers rate limiter binding** (user decision): multi-instance safe, native to the deploy target; KV-counter alternative rejected (eventually consistent).
4. **Server Action over route handler**: progressive enhancement, RHF result mapping, no manual fetch plumbing; verified against bundled Next 16 docs at plan time.
5. **No submission persistence**: email is the record; Supabase tables deliberately not added (scope discipline — adding storage is P5+ if wanted).
6. **Shared schema module** (`contact-schema.ts`) imported by both the island (resolver) and the action (parse) — single source, no drift.
7. **Nav entry** added via P1's nav config pattern rather than a hard-coded link — keeps dock drawer/dock in sync.
8. **Sound wiring**: hover sounds only (P2 hooks); **no** success jingle — reserved semantics from the template (jingle = unmute only).

## 8. Testing & Fidelity

- **Vitest**:
  - `contact-schema.test.ts` — valid payload, bad email, over-length message, honeypot field accepted-but-flagged.
  - `send-message.test.ts` — action with mocked `fetch` (Turnstile verify + Resend), mocked `getCloudflareContext().env` limiter: validation fail, honeypot silent-success, turnstile fail, rate-limited, resend error → `delivery`, happy path `{ ok: true }`.
  - `turnstile.test.ts` — siteverify helper: success/failure/network-error mapping.
- **Playwright E2E** (`contact.spec.ts`): renders header/form; client-side validation blocks empty submit; full flow with **Turnstile test keys** (always-pass) and a stubbed action transport is covered at unit level — E2E asserts UX states only (validation errors visible, submit disabled while pending); design-language conformance pass via @Browser (manual, §9) since no template counterpart exists.
- **Preview smoke**: `bun run preview` — form submits end-to-end with test keys; rate limiter binding present in `wrangler preview` env (second rapid submit returns `rate-limited`).
- **Checks**: `bun run validate` after each task per repo workflow.

## 9. Success Criteria

- `/contact` renders within the cloned chrome; indistinguishable in style density/voice from `/blog` index (manual @Browser side-by-side with template home/blog for tone, not pixel-diff — no counterpart).
- Full flow works under `bun run preview` with test keys: valid submit → email delivered to `CONTACT_TO_EMAIL`; invalid → field errors; bot-token fail → `turnstile`; 6th submit in an hour → `rate-limited` inline message.
- No secrets in the repo; `.dev.vars.example` documents every key; `wrangler.jsonc` binding present; `cf-typegen` types regenerated.
- All unit tests + E2E green; `bun run validate` exits 0.

## 10. Risks

| Risk | Mitigation |
| --- | --- |
| Server Actions behavior differs in OpenNext/Workers vs Node dev | Verify against bundled Next 16 docs + OpenNext docs at plan time; smoke-test under `bun run preview` before declaring done (§8) |
| `getCloudflareContext()` availability pattern in Next dev | Dev-degradation branch (§6.6) with explicit log; binding enforcement only asserted under preview |
| `@marsidev/react-turnstile` maintenance drift | Plan-time check (context7/Tavily, authoritative sources); raw-script fallback documented in §3 keeps us unblocked |
| Resend free tier requires verified domain for arbitrary recipients | Dev path uses `onboarding@resend.dev` + owner-verified inbox; production DNS step flagged as owner task in the plan |
| Rate limiter binding not available in local `next dev` | Same as above — documented dev degradation, never silently enforced-fail |
| New surface could drift from cloned visual language | §5 pins every class/voice decision to existing primitives; manual conformance pass in §9 |
