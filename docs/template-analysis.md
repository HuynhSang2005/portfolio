# Template Analysis — `portfolio-template-ui-ux/portfolio-main`

Foundation document for spec + plan of the template clone. Synthesizes a live browser survey
(2026-08-01, Bun dev server on port 6969) and a full codebase research pass. The normative design
system lives in `DESIGN.md` + `.impeccable/design.json`; this document inventories **what exists**
and **what it depends on** so clone scope and sequencing can be planned.

## Template stack (what we clone _from_)

| Layer             | Template                                                                                       | Our target stack                                                                                                               |
| ----------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Framework         | Next.js 15.5 App Router, React 19                                                              | Next.js 16, React 19                                                                                                           |
| Package/workspace | pnpm 10 + turbo monorepo (`apps/website`, `packages/*`)                                        | Bun, single app (`src/app`)                                                                                                    |
| Styling           | Tailwind CSS v4 (`@theme` in CSS), shadcn-style UI on **Radix**                                | Tailwind v4, shadcn/ui on **Base UI** (`base-nova`)                                                                            |
| Tokens            | `packages/design-system/styles/globals.css` (OKLCH zinc)                                       | port to `src/app/globals.css`                                                                                                  |
| Motion            | `motion` v12 (`motion/react`) + CSS keyframes + `tw-animate-css` + `react-fast-marquee`        | same (`motion/react`, LazyMotion); marquee = CSS-only (no lib)                                                                 |
| Theme             | `next-themes` class strategy + View Transitions toggle                                         | `@wrksz/themes` (drop-in API, Next 16 peer, cookie SSR) + View Transitions toggle                                              |
| Fonts             | custom local "X" (400/500) + JetBrains Mono                                                    | same font files must be copied (license check)                                                                                 |
| Content           | MDX (blog/craft), `next-mdx-remote` + `rehype-pretty-code` + `github-slugger` + `reading-time` | local MDX via `next-mdx-remote-client` + `rehype-pretty-code`/`shiki` + `rehype-slug`/`mdast-util-toc` + own reading-time util |
| Backend           | Vercel Postgres/Neon (views/likes), next-auth, Resend, Cal.com, Gemini, Upstash Redis          | Supabase + Cloudflare (re-implement)                                                                                           |

Template runs locally with Bun: `bun install` at `portfolio-template-ui-ux/portfolio-main` (workspace
field added, pnpm `preinstall` guard removed), then `bun run dev` inside `apps/website` → port 6969.

## Surface inventory (verified live)

| Route                                       | State                | What it is                                                                                                                                                | Clone scope                  |
| ------------------------------------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| `/`                                         | works                | Hero wordmark + embedded profile card, instrument metadata, GitHub contribution heatmap, Projects stacked cards, Experience dossier list, wordmark footer | **core**                     |
| `/blog`                                     | works                | Typographic post index, featured-first layout, mono metadata rows                                                                                         | **core**                     |
| `/blog/[slug]`                              | works                | 3-col: TOC rail (active accent) + prose + code blocks (copy button)                                                                                       | **core**                     |
| `/craft`                                    | works                | Masonry grid of inline interactive prototypes; "View Prototype" links → external pro.ruixen.com (must be removed)                                         | later                        |
| `/craft/[slug]` (`cal-grid`, `vercel-grid`) | works                | Full-page grid experiments with dedicated CSS                                                                                                             | later                        |
| `/clock`                                    | works                | Clock of Clocks: 6 digits × 24 mini analog clocks, hands form digits                                                                                      | later (signature easter egg) |
| `/buddy`                                    | error state          | AI chat; disabled without Gemini key; custom "Oops!" error page                                                                                           | later, re-platformed         |
| `/cal`                                      | untested             | Cal.com booking embed                                                                                                                                     | later, re-platformed         |
| `/llms.txt`, `/me/*.md`                     | works                | LLM-readable routes                                                                                                                                       | later                        |
| `/llms-full.txt`                            | **500 in dev**       | LLM full-content route; broken by a `public/llms-full.txt` ↔ route conflict (template defect)                                                             | later (fix when cloned)      |
| `/blog.mdx/[slug]`                          | 404 for tested slugs | MDX source route for posts; data-dependent                                                                                                                | later                        |
| command menu                                | disabled in template | commented out in `components/navigation/index.tsx`                                                                                                        | later                        |
| seasons / spirals / easter-egg provider     | archived             | code in `archive/`                                                                                                                                        | later, opt-in                |

## Signature design elements (clone checklist, priority order)

1. **Design tokens + theme**: OKLCH zinc system, `.dark` class, View Transitions theme wipe —
   `packages/design-system/styles/globals.css`, `providers/theme.tsx`.
2. **Scrollport model**: `.scrollable-area` internal scroller (`h-full min-h-dvh max-h-dvh
overflow-x-hidden overflow-y-auto`); dock/header/scroll-top depend on it.
3. **Section chrome**: corner registration marks + side rules (`section.tsx`), dashed separator
   bands (`separator.tsx`), `bg-dashed`/`screen-line-*` utilities.
4. **Bottom dock**: magnification spring (mass 0.1, stiffness 150, damping 12), tooltips, active
   dots, sound — `components/navigation/dock/` + `shared/compoenents/floating-dock.tsx`. Idle
   auto-hide exists in config (`DOCK_AUTOHIDE_TIMEOUT = 5000`) but its timer never arms — dead code
   the clone must implement correctly.
5. **Floating header + mobile drawer**: mobile replacement for the dock (`lg:hidden`).
6. **Wordmark footer**: half-cropped giant wordmark, mouse-tracked shine, spring entrance —
   `wordmark-footer.tsx`.
7. **Home modules**: hero (inline in `app/page.tsx`: name/title/body/SkillsVenn), GitHub
   contribution graph, stacked project cards, experience dossier, skills Venn, info overlays —
   `features/home/` holds testimonials, contribution graph, projects, experiences, info.
8. **Blog system**: index, `[slug]` with TOC rail + `Prose` typography + pretty-code blocks.
9. **Sound system**: Web Audio — click plays `button-click.mp3` (plus `achievement.mp3`), hover
   whoosh is synthesized pink noise; `sound-muted` localStorage — `sound-context.tsx`.
10. **Craft playground**: masonry grid + inline prototypes — `app/craft/`, `masonary-grid.tsx`.

## Motion language (from code)

| Pattern             | Spec                                                      | File                             |
| ------------------- | --------------------------------------------------------- | -------------------------------- |
| Reveal on load      | 0.5–0.6s, ease `[0.25,0.4,0.25,1]`, 20px offset, stagger  | `reveal-on-load.tsx`             |
| Dock magnify        | spring mass 0.1 / stiffness 150 / damping 12; press y ±10 | `floating-dock.tsx`              |
| Theme wipe          | View Transition, 0.8s custom `linear()` clip-path         | `globals.css`, `mode-toggle.tsx` |
| Theme icon morph    | stagger 0.05, pathLength 0.3s, spring morph 1s            | `mode-toggle.tsx`                |
| Wordmark enter      | spring stiffness 260 / damping 28                         | `wordmark-footer.tsx`            |
| CSS reveal          | 0.7s, blur 15→0, scale 1.0125→1                           | `globals.css`                    |
| Testimonial marquee | items × 5s linear infinite, pause on hover                | `testimonials.tsx`               |
| Clock hands         | 1s initial / 0.4s tick, ease-in-out                       | `clock-of-clocks.tsx`            |

No page-transition library; theme toggle is the only View Transition.

## Backend dependencies to re-platform

| Template feature | Template impl                                                                                                     | Our replacement                                         | Priority     |
| ---------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ------------ |
| Post views/likes | Vercel Postgres/Neon; in-memory `lru-cache` rate limit (`lib/rate-limit.ts` — not Redis, not multi-instance safe) | Supabase Postgres + RLS; rate-limit TBD                 | with blog    |
| Auth (admin)     | next-auth (GitHub)                                                                                                | Supabase Auth (owner-only)                              | with admin   |
| Contact/email    | Resend                                                                                                            | Cloudflare Email Workers or Resend free tier (decide)   | with contact |
| Buddy AI chat    | Gemini                                                                                                            | defer; provider decided when picked up                  | later        |
| Booking          | Cal.com embed                                                                                                     | decide: keep Cal.com (free) or native                   | later        |
| Analytics        | Umami (`NEXT_PUBLIC_UMAMI_WEBSITE_ID`)                                                                            | Cloudflare Web Analytics or Umami self-host (zero-cost) | later        |
| Bookmarks        | Raindrop.io API                                                                                                   | likely drop (not in product scope)                      | later        |
| GitHub heatmap   | GitHub REST/GraphQL public API                                                                                    | same API, server-side cached (Supabase/KV)              | core         |

## Dependency decisions (ratified 2026-08-03, installed)

Decided against `docs/portfolio-nextjs-idea.md` principles (KISS/YAGNI, no Radix↔Base UI mixing,
"maintained long-term" requirement). Verified via npm registry + GitHub + official Next.js docs.

| Concern           | Template                                                                | Decision                                              | Rationale                                                                                                                                                                                                  |
| ----------------- | ----------------------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Drawer            | `vaul` (Radix dialog, unmaintained mode)                                | **`vaul-base@1.0.0`**                                 | drop-in same API on Base UI Dialog; avoids Radix mixing + focus-trap conflicts with Base UI popups (shadcn discussion #10297)                                                                              |
| Theme             | `next-themes` (maintenance mode, open React 19/Next 16 script bug #387) | **`@wrksz/themes@1.0.0`**                             | drop-in API, peer `next >=16`, zero-flash cookie SSR via `useServerInsertedHTML`, zero runtime deps. Risk: young single-maintainer package — pinned, tiny API surface (Provider + `useTheme`), replaceable |
| Marquee           | `react-fast-marquee` (unmaintained)                                     | **no dependency** — CSS-only marquee component        | template's own testimonial marquee is already pure CSS keyframes; ~30 lines, KISS                                                                                                                          |
| Reading time      | `reading-time` (stale)                                                  | **no dependency** — util in `src/lib` (words/238 wpm) | trivial, YAGNI                                                                                                                                                                                             |
| Heading slugs/TOC | `github-slugger` (stale)                                                | **`rehype-slug@6` + `mdast-util-toc@7`**              | official unified-collective plugins, maintained, fit the MDX rehype pipeline                                                                                                                               |
| MDX runtime       | `next-mdx-remote` (**archived Apr 2026**)                               | **`next-mdx-remote-client@2.1.11`**                   | maintained fork recommended by official Next.js docs; React 19 + Next 15/16, error handling + frontmatter helper                                                                                           |
| Code blocks       | `rehype-pretty-code` + `shiki`                                          | **keep: `rehype-pretty-code@0.14.5` + `shiki@4.4.1`** | needed for clone fidelity (titles, line numbers, dual-theme, copy button); `@shikijs/rehype` is lower-level and would require rebuilding these features; rpc actively maintained (Mar 2026)                |
| Prose styling     | `@tailwindcss/typography`                                               | **keep: `@tailwindcss/typography@0.5.20`**            | official Tailwind plugin; blog/prose typography for MDX output                                                                                                                                             |

## Environment variables the template expects

`AUTH_SECRET`, `GITHUB_ID/SECRET`, `NEXTAUTH_URL`, `RESEND_API_KEY`, `RAINDROP_ACCESS_TOKEN`,
`REGISTRY_URL`, `URL`, `NEXT_PUBLIC_UMAMI_WEBSITE_ID`, `ANALYZE`. The public surfaces render
without any of them; only `/buddy` hard-fails. Our env model: `getPublicEnv()` (Zod 4) +
`.env.example`, per AGENTS.md.

## Known hazards for the clone

- **Radix → Base UI**: design-system package is Radix-based; every ported primitive needs the
  `render`-prop Base UI pattern (per AGENTS.md), not `asChild`.
- **Zod 3 → Zod 4**: template schemas (env, MDX frontmatter) need Zod 4 idioms.
- **Monorepo → single app**: `@repo/design-system` imports become `src/components/ui` + `src/features`.
- **Scrollport is load-bearing**: dock auto-hide, FloatingHeader reveal, ScrollTop all read
  `.scrollable-area`; cloning pieces without it breaks behaviors.
- **Font licensing**: "X" is a custom local font (X-Regular/Medium.woff2); the repo's only rights
  document is the blanket MIT `license.md` — nothing font-specific exists, so redistribution rights
  stay genuinely unresolved. Template also ships unused fonts: `Ndot-55.otf` (wired in `fonts.ts`,
  not applied), `HubotSans.woff2` + `MonaSans.woff2` (files only). Verify before copying any.
- **Template defects to fix during clone** (verified, not to be ported): dock idle auto-hide timer
  never arms (`if (timeoutRef.current)` guard wraps the `setTimeout`); ModeToggle's
  `startViewTransition` fallback both double-toggles and throws on unsupported browsers;
  `@keyframes reveal` is defined twice identically in `globals.css`; `/llms-full.txt` 500s in dev
  (public file conflicts with the route); README's license link points to non-existent `./LICENSE`
  (actual: `license.md`).
- **External commercial links**: craft "View Prototype" → pro.ruixen.com and social/GitHub links
  point at the demo brand; all must be stripped (also an MIT-license courtesy).
- **pnpm artifacts**: template now carries a Bun lockfile + modified manifests locally; it is
  gitignored and never committed.

## Clone sequencing (P1–P4 ratified 2026-08-03; spec + plan links)

1. **Foundation**: tokens/globals.css, fonts, theme provider + View Transition toggle, scrollport,
   section/separator chrome, dock + floating header + drawer.
   — [spec](superpowers/specs/2026-08-03-p1-foundation-design.md) · [plan](superpowers/plans/2026-08-03-p1-foundation.md)
2. **Home**: hero, contribution graph, projects, experience, wordmark footer, sound system.
   — [spec](superpowers/specs/2026-08-03-p2-home-design.md) · [plan](superpowers/plans/2026-08-03-p2-home.md)
3. **Blog**: MDX pipeline, index, `[slug]` + code blocks, post views/likes (Supabase + RLS).
   — [spec](superpowers/specs/2026-08-03-p3-blog-design.md) · [plan](superpowers/plans/2026-08-03-p3-blog.md)
4. **Contact**: form + Resend email + Turnstile + Workers rate limiter (new surface, no template counterpart).
   Workers-true smoke via **Cloudflare deploy** (`huynhsang.id.vn`), not mandatory local `bun run preview`.
   — [spec](superpowers/specs/2026-08-03-p4-contact-design.md) · [plan](superpowers/plans/2026-08-03-p4-contact.md)
5. **Extras** (each re-confirmed; spec written when picked up): craft experiments (`cal-grid` / `vercel-grid`), craft feed/llms, clock, buddy, cal, analytics. **Note (2026-08-03):** craft masonry index + `[slug]` pulled into P4; remaining craft extras stay here.

Re-validate gate before executing each phase: diff the plan's assumed paths/interfaces against the
repo state at that time and update the plan doc in-place if they drift.
