# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Owner (single author/admin):** an IT student building a personal portfolio; sole admin who creates and manages all content through an admin dashboard. No public user registration, ever.
- **Public visitors (two equally important audiences):**
  - Recruiters / hiring managers evaluating the owner for employment.
  - The developer community, reached through blog/craft/showcase content.

## Product Purpose

A personal full-stack portfolio that presents the owner's profile, skills, experience, and projects with rich case studies. It exists to support job hunting and personal-brand building in the dev community at the same time. Success means a recruiter can evaluate the owner and a fellow developer can learn from the work; the owner can publish and maintain all content himself through the admin area.

## Positioning

Two mechanisms, equally weighted, that a neighboring portfolio cannot truthfully copy:

1. **The site itself is the engineering proof** — its architecture, code quality, and craft demonstrate the owner's skills directly.
2. **Case-study depth** — projects are presented with real analysis and narrative depth, not screenshot galleries.

## Operating Context

- Zero operating cost is a hard constraint; the owner already has a personal domain.
- Vercel is explicitly excluded; deployment target is Cloudflare Workers via OpenNext.
- Supabase is the backend platform (PostgreSQL, Auth, Storage, Realtime) for one project (`portfolio`).
- Open-source or easily replaceable technology is preferred; business logic stays in the codebase on standard PostgreSQL to limit lock-in.
- The codebase doubles as CV material: structure, tooling, and DX are part of what is being evaluated.

## Capabilities and Constraints

Confirmed functionality targets: public portfolio pages (profile, skills, experience, projects), a public MDX blog with views/likes, a public craft gallery (MDX case notes + theme-paired preview videos), and a contact form (Turnstile + Resend) — all shipped. Rich project case studies, an admin dashboard for content management, and media upload/management remain planned. Analytics and realtime are deliberate later extensions.

Confirmed non-goals: microservices, a separate NestJS/Express backend, multi-tenant CMS, public registration, AI editor, realtime collaboration, comments, complex analytics, a full Notion-class editor.

Confirmed engineering constraints: full-stack inside one Next.js app (modular monolith), server-first with RSC as default, type-safe at app and database level, responsive + accessibility + SEO + Core Web Vitals support, and a clear lint/format/typecheck/test/deploy pipeline.

### Design source and re-platform strategy (confirmed)

- **Design source of truth:** the UI/UX, design, and animation of the template at `portfolio-template-ui-ux/portfolio-main` are cloned with 100% fidelity — it is the incumbent visual world, not loose inspiration.
- **Clone scope:** core portfolio surfaces first — home, projects/case studies, blog, contact (all shipped, plus the craft playground pages). Remaining template extras (command menu, component registry, buddy/clock/cal easter eggs, llms.txt, PWA) are later additions, re-confirmed when picked up.
- **Visual handling:** the template's visual system (colors, fonts, theme) is kept 100% as-is in the clone; only the author's personal content/information is replaced with the owner's. Visual customization is deferred and happens after the clone is complete.
- **Re-platforming:** only shadcn-ui and Next.js overlap with the template's stack (Next.js 15, pnpm/turbo monorepo, Radix, Zod 3, Vercel services). The clone is rebuilt on this repo's stack: Next.js 16, Bun, Tailwind CSS v4, shadcn/ui with Base UI (`base-nova`), Zod 4, Supabase, Cloudflare Workers via OpenNext.
- **Backend-dependent features:** template features backed by Vercel Postgres/Neon (views/likes), next-auth, Vercel Analytics/Speed Insights, Resend, Cal.com, or Gemini are re-implemented on this stack (Supabase + Cloudflare). No Vercel services.
- **Long-term requirement:** the result must stay easy to scale, upgrade, update, and customize — fidelity to the template must not fossilize its outdated stack choices.
- **Documented visual system:** the template's full design system is captured in `DESIGN.md` + `.impeccable/design.json` (tokens, typography, layout, components, motion); `docs/template-analysis.md` holds the surface/animation/backend inventory. The template runs locally with Bun (`bun install` at its root, `bun run dev` in `apps/website`, port 6969) for side-by-side fidelity comparison during the clone.

**Verified template facts (from live survey, 2026-08-01):**

- The local copy ships the "Ruixen UI Engineering Studio" demo identity/content; all of it is placeholder to be replaced by the owner's content regardless.
- Command menu and buddy are present in code but disabled in the template itself (commented out / `ENABLE_BUDDY = false`, buddy needs a Gemini key); seasons, polyrhythmic spirals, and the easter-egg provider live in `archive/`.
- Craft masonry items are inline interactive prototypes whose "View Prototype" links point to an external commercial docs site (pro.ruixen.com) — those links must not survive into the owner's site.

**Open decisions (explicitly undecided):**

- `docs/portfolio-nextjs-idea.md` is reference material only ("chưa chốt"); major product decisions are re-confirmed with the owner each time rather than inherited from that document.
- Rich editor choice (BlockNote + Ariakit is only a candidate) and its storage format are undecided.
- Detailed route design and database schema are deliberately not designed yet.
- Timing and extent of visual customization (colors, fonts, branding) after the faithful clone lands.

## Brand Commitments

- The owner's real name is Huỳnh Sang; the portfolio is a real-name personal brand.
- A personal domain exists (value not recorded in the repo).
- No logo, wordmark, palette, or voice guideline has been committed as binding.
- License obligation: the design source template is MIT licensed; its copyright/permission notice must be retained, and all of the original author's personal information must be removed before publishing.

## Evidence on Hand

- `docs/portfolio-nextjs-idea.md` — technical direction document; status: reference only, not ratified.
- `portfolio-template-ui-ux/portfolio-main` — the committed design source of truth (see "Design source and re-platform strategy"). Third-party template by Sri Somanaath G, MIT licensed (`license.md`); not committed to this repo.
- No real project write-ups, case studies, testimonials, or media assets exist yet. Future work must not fabricate projects, clients, metrics, or quotes. All of the template author's personal information must be removed before publishing — this is the author's explicit license condition.

## Product Principles

1. **Craft as evidence** — every surface should withstand an engineer reading its source.
2. **Depth over volume** — fewer, deeper case studies beat many shallow entries.
3. **Server-first simplicity** — KISS and YAGNI; client JavaScript only where interaction demands it.
4. **Sustainable at zero cost** — every architectural choice must keep the free tier viable.
5. **Owner-operated** — one author, one admin; complexity for multi-user workflows is out of scope.

## Accessibility & Inclusion

Accessibility is a stated technical goal alongside responsive design, SEO, and Core Web Vitals; no specific conformance level (e.g. WCAG 2.2 AA) has been committed yet — record as an open decision when the first surface is built.
