# P1 Foundation — Design Spec (Template Clone, Sub-project 1)

> Status: **Approved design, pending user spec review** (2026-08-03)
> Decomposition ratified: P1 Foundation → P2 Home → P3 Blog → P4 Contact → P5 Extras.
> Approach ratified: **A — direct port** from template source with incremental fidelity verification.
> Sources of truth: `DESIGN.md` + `.impeccable/design.json` (visual system), `docs/template-analysis.md` (inventory, hazards, defects), `PRODUCT.md` (product constraints).

## 1. Goal

Port the template's entire visual foundation — design tokens, fonts, theme system, scrollport, and all chrome components (dock, floating header, mobile drawer, mode/sound toggles, section/separator chrome, corner overlays) — onto this repo's stack with 100% visual/behavioral fidelity, so every later surface (P2+) builds on chrome that already looks and behaves exactly like the template.

## 2. Scope

**In scope (P1):**

- Design tokens & base styles: OKLCH zinc ramps, semantic tokens, keyframes, base element styles — ported from `portfolio-template-ui-ux/portfolio-main/packages/design-system/styles/globals.css` into `src/app/globals.css` (Tailwind v4 `@theme` form).
- Fonts: custom local "X" (Regular/Medium woff2) + JetBrains Mono, wired via `next/font/local` (template reference: `fonts.ts`).
- Theme system: `@wrksz/themes` provider (`attribute="class"`, `defaultTheme="system"`, `enableSystem`, template's storageKey) + ModeToggle with View Transitions circle-reveal.
- Scrollport: `.scrollable-area` custom scroll container. **Load-bearing** — dock auto-hide, header reveal, and scroll-top all read it (hazard recorded in template-analysis).
- Chrome components: Dock (motion pill nav), FloatingHeader (reveal-on-scroll-up), MobileDrawer (vaul-base), ModeToggle, SoundToggle (stub), Section, Separator (pattern), corner overlays.
- `src/config/site.ts`: owner identity (`Huỳnh Sang`), nav links, socials (empty/controlled placeholders), Zod 4 validated at build. All template-author info stripped (MIT license condition).
- Fidelity verification harness: Playwright visual-diff spec comparing clone (:3000) vs template (:6969).

**Out of scope (P1):** home page content (P2), sound playback logic + assets (P2; toggle is a stub), MDX/blog (P3), contact (P4), any Supabase usage, any new env vars.

## 3. Global Constraints

- Bun only (`bun add`, `bun run`, `bunx`); never npm/pnpm/yarn.
- Next.js 16 App Router, RSC default; `"use client"` only at interaction boundaries (dock, toggles, drawer, scrollport hook consumers).
- No `export const runtime = "edge"` (OpenNext Cloudflare).
- shadcn/ui on Base UI (`base-nova`): `render` prop patterns, never Radix `asChild`; no Radix packages in the tree (vaul-base replaces vaul for exactly this reason).
- Zod 4 idioms for all validation (template uses Zod 3 — rewrite during port).
- Oxlint + Oxfmt only; run `bun run format`, `bun run typecheck`, `bun run lint` after every task.
- Read matching docs under `node_modules/next/dist/docs/` before touching Next.js APIs.
- Template runs at `http://localhost:6969` (`bun run dev` in `portfolio-template-ui-ux/portfolio-main/apps/website`) for side-by-side fidelity comparison.
- Conventional Commits; no Cursor/agent identity in git authorship; commit only when the user asks.
- Dependencies are already installed and pinned (see `docs/template-analysis.md` → "Dependency decisions"): `@wrksz/themes@1.0.0`, `vaul-base@1.0.0`, `motion` (existing), `tw-animate-css` (existing). Do not add new deps in P1.

## 4. Architecture

```text
src/
├── app/
│   ├── globals.css          # PORT: tokens (OKLCH zinc), keyframes, base styles
│   │                        #   fix: remove duplicated @keyframes reveal
│   ├── layout.tsx           # MODIFY: fonts, ThemeProvider, Scrollport shell,
│   │                        #   Dock, FloatingHeader (server component shell)
│   └── page.tsx             # stub (P2 fills)
├── config/
│   └── site.ts              # NEW: identity + nav + socials, Zod-validated
├── components/
│   ├── ui/                  # existing base-nova; restyle button/separator to template
│   └── layout/
│       ├── scrollport.tsx       # .scrollable-area container
│       ├── dock.tsx             # floating pill nav (motion)
│       ├── dock-items.tsx       # item definitions from site.ts
│       ├── floating-header.tsx  # reveal-on-scroll-up
│       ├── mobile-drawer.tsx    # vaul-base drawer
│       ├── mode-toggle.tsx      # View Transitions circle reveal
│       ├── sound-toggle.tsx     # stub (ui-store.soundEnabled only)
│       ├── section.tsx          # section chrome
│       ├── separator.tsx        # pattern separator
│       └── corner-overlay.tsx   # "+" corner marks
├── lib/
│   └── hooks/
│       ├── use-scroll-direction.ts  # shared by dock + header, reads scrollport
│       └── use-scrollport.ts        # access to scrollport element
└── providers.tsx            # MODIFY: add @wrksz/themes ThemeProvider
```

Boundary rules: `layout.tsx` stays a Server Component; chrome is client islands. No whole-layout client conversion.

## 5. Component port notes

| Component                 | Template source                                      | Port notes                                                                                                                  |
| ------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Tokens/base CSS           | `packages/design-system/styles/globals.css`          | Port verbatim then adapt to Tailwind v4 `@theme`; fix duplicate `@keyframes reveal`; keep OKLCH values unchanged            |
| Fonts                     | template `fonts.ts` + woff2 assets                   | Copy woff2 files + MIT notice; `next/font/local` with same variable names/weights                                           |
| Scrollport                | scroll-area components                               | Container with `.scrollable-area`; do not substitute native window scroll                                                   |
| Dock                      | `components/navigation/dock/index.tsx`               | **Defect fix:** idle auto-hide timer never arms (`if (timeoutRef.current)` guard wraps the `setTimeout`) — arm it correctly |
| FloatingHeader            | `components/navigation/floating-header.tsx`          | Reveal-on-scroll-up behavior preserved                                                                                      |
| MobileDrawer              | `components/navigation/mobile-drawer.tsx`            | vaul → vaul-base (`import { Drawer } from "vaul-base"`), same API                                                           |
| ModeToggle                | `components/navigation/dock/mode-toggle.tsx`         | **Defect fix:** `startViewTransition` fallback must single-toggle and must not throw on unsupported browsers                |
| SoundToggle               | `components/navigation/dock/sound-toggle.tsx`        | Full visual/a11y; onClick only flips `ui-store.soundEnabled`                                                                |
| Section/Separator/corners | `components/section.tsx`, `components/separator.tsx` | Exact padding/pattern values from DESIGN.md                                                                                 |
| Button/Separator (ui)     | design-system package                                | Restyle existing base-nova components to template gradient/hover specs (DESIGN.md §Components)                              |

## 6. Data flow & state

- **Theme:** `@wrksz/themes` `ThemeProvider` in `providers.tsx`; `useTheme` in ModeToggle; transition via `document.startViewTransition` with safe fallback.
- **Scroll:** single `useScrollDirection` hook reading the scrollport element; consumed by Dock (hide on scroll down / idle) and FloatingHeader (reveal on scroll up).
- **Sound:** `ui-store` (existing Zustand factory/provider pattern) gains `soundEnabled: boolean` + `toggleSound()`; SoundToggle is the only consumer in P1.
- **Config:** `site.ts` exports a `SiteConfig` parsed through a Zod 4 schema at module load (fail fast at build).

## 7. Defect fixes & decisions

Port must NOT carry template bugs (from template-analysis "Known hazards"):

1. Dock idle auto-hide timer: implement working `setTimeout` arm/clear on scroll activity.
2. ModeToggle fallback: single theme application, feature-detect `document.startViewTransition`, no throw.
3. `globals.css`: dedupe `@keyframes reveal`.

**Font license decision (approved in design review):** copy "X" woff2 files and JetBrains Mono from the template, retain the template's MIT `license.md` notice in the repo (attribution), and record that redistribution rights rely on the blanket MIT license. If this is later judged unsafe, fallback is JetBrains Mono globally (fidelity loss accepted then, not now).

## 8. Testing & fidelity verification

- **Vitest** (`tests/unit/`): site config schema (valid + invalid shapes), `useScrollDirection` logic (jsdom), theme-toggle fallback branching.
- **Playwright visual diff** (`tests/e2e/foundation.visual.spec.ts`): template (:6969) vs clone (:3000) screenshots — dock, floating header, drawer open state, light + dark themes; computed-style probes for key tokens (background, border, font-family).
- **Manual @Browser pass** at phase end: side-by-side interaction comparison (scroll behaviors, toggle transition, drawer drag).
- **Gate:** `bun run validate` (typecheck + lint + format:check + test:run + build) must pass.

## 9. Success criteria

- Clone chrome is visually indistinguishable from the template in light and dark mode (visual diff within tolerance; manual pass confirms interactions).
- All known P1-scope template defects are fixed, not ported.
- No template-author identity remains anywhere; `site.ts` is the only identity source.
- `bun run validate` green; no new dependencies added.

## 10. Risks

- **Scrollport fidelity:** substituting native scroll breaks three behaviors at once — port it first-class, test early.
- **View Transitions on Cloudflare preview:** verify toggle works under `bun run preview`, not just `next dev`.
- **Font rendering drift:** woff2 files must be copied byte-identical; verify via computed font-family + visual diff.
- **@wrksz/themes youth:** pinned at 1.0.0; API surface used is only `ThemeProvider` + `useTheme` — replaceable with ~80 lines if abandoned.
