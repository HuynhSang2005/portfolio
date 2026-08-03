# P2 Home — Design Spec (Template Clone, Sub-project 2)

> Status: **Approved by user — spec + plan gates passed** (2026-08-03)
> Decomposition ratified: P1 Foundation → **P2 Home** → P3 Blog → P4 Contact → P5 Extras.
> Depends on: P1 spec (`2026-08-03-p1-foundation-design.md`) — chrome, scrollport, site config, sound store slice.
> Sources of truth: `DESIGN.md` + `.impeccable/design.json` (visual system), `docs/template-analysis.md` (inventory, hazards), `.impeccable/template-research-report.md` (component/motion detail), template source at `portfolio-template-ui-ux/portfolio-main` (verified 2026-08-03 by direct code reading), template live at `http://localhost:6969`.

## 1. Goal

Port the template's home page (`/`) — hero with SkillsVenn, testimonials dual-row marquee, GitHub contribution heatmap, projects list, experiences dossier, wordmark footer, info overlays — plus the complete Web Audio sound system — onto this repo's stack with 100% visual/behavioral fidelity, composed entirely from P1 chrome (`ScrollArea`, `FloatingHeader`, `Section`, `Separator`).

## 2. Scope

**In scope (P2):**

- **Page composition** (`src/app/page.tsx`, replaces P1 stub): `Info` overlays → `ScrollArea useScrollAreaId` → `FloatingHeader` → vertical rhythm `Section` → `Separator` → … → `WordmarkFooter` → bottom spacer `h-[clamp(80px,10vh,200px)]`. Section order (verified from template `app/page.tsx`): Hero → Testimonials → GitHubContribution → Projects → Experiences → WordmarkFooter.
- **Hero**: name + `PronounceMyName`, mono uppercase job title, bio paragraphs (`text-foreground/70 leading-relaxed`), `SkillsVenn` (4 circles `55%` size, labels at 14%/15% positions, center avatar `border-background shadow-md`), `RevealOnLoad` stagger (delays 0/0.15/0.3, durations 0.5/0.5/0.6, ease `[0.25,0.4,0.25,1]`, 20px offset).
- **Info overlays** (`features/home/components/info.tsx`): fixed mono corners — time (1s tick, `en-US` hour12), screen size (resize listener), fade-in `0.6s easeOut` x −20→0, desktop ≥1000px only, `font-x text-xs tracking-wider text-gray-600 dark:text-gray-300`, z-50. Clone renders `show=['time','screen']` only (see §7 decision 3).
- **Testimonials**: dual-row CSS-only marquee (no library) — items sorted by date (`localeCompare` numeric), duplicated for seamless loop, `animation: marquee-scroll ${items.length*5}s linear infinite`, row 2 `reverse`, pause on hover, cards `w-[16rem] rounded-xl ring-1 ring-foreground/10 ring-inset hover:bg-accent/50`, edge fades `w-20 bg-linear-to-r/l from-background`, testimonial atoms (`figure`/`blockquote`/`figcaption` + avatar ring `ring-black/10 dark:ring-white/15`).
- **GitHub contribution heatmap**: `getContributions()` seam (§7 decision 1) → Suspense + `use(promise)` client graph; `ContributionGraph` primitive port (pure React + SVG + `date-fns`): `blockSize 9`, `blockMargin 3`, `fontSize 11`, `maxLevel 4`, levels `fill-muted-foreground/5|20|40|60|80`, month labels with min-3-week filter, footer total count + Less/More legend, fallback `h-[162px]` spinner, empty data renders nothing.
- **Projects**: link rows — logo (`size-10 rounded-lg object-contain`) or fallback `BoxIcon` in `bg-muted`, title `group-hover:underline` + `ArrowUpRightIcon` opacity fade-in, `text-sm text-foreground/60` short description, item hover pop sound.
- **Experiences**: collapsible dossier rows — company logo or `BriefcaseIcon` fallback, company name + external link (stopPropagation), period line (`start — end || '∞'`), chevron rotate on open, panel `ml-14 border-l-2 border-muted pl-4` with positions (title, `· employmentType`, description, `Tag` skill chips), `defaultOpen` for current employer, item hover pop sound. Radix `Collapsible` → Base UI `Collapsible` port (§7 decision 5).
- **WordmarkFooter**: near-verbatim port — SVG half-cropped wordmark (`viewBox 1000×160`, `fontSize 240`, baseline cut ~70% visible), mouse-tracked radial shine (lerp 0.1, 4-stop opacity ladder `.88/.62/.34/.16`), vertical fade mask (60% → 0.55), spring entrance (`stiffness 260, damping 28`, y 16→0), bottom hairline `rgba(0,0,0,.08)` / dark `rgba(255,255,255,.08)`, system font stack, `textLength={VB_W}` squeezes any brand name; `brandName` from `siteConfig.name`.
- **Sound system** (full port, wires into P1 stubs):
  - `useSound(url)` — fetch + decode mp3 via Web Audio, respects mute (template `lib/hooks/use-sound.tsx`).
  - `useHoverSound()` — synthesized whoosh: 0.1s pink noise, bandpass 1600Hz Q 0.6, gain peak 0.15, throttle 50ms (template `use-hover-sound.tsx`).
  - `useItemHoverSound()` — softer pop: 0.06s pink noise, bandpass 2200Hz Q 0.8, gain peak 0.1, throttle 80ms (template `use-item-hover-sound.tsx`).
  - Toggle jingle — ascending C5→E5→G5→C6 on unmute, descending G5→C5 on mute (from template `SoundProvider.playToggleSound`), wired into P1 `SoundToggle`.
  - `sound-muted` localStorage persistence with template's key and semantics (`'true'` = muted), hydrated post-mount into the P1 `ui-store` sound slice.
  - Asset: copy `public/assets/button-click.mp3` (skip `achievement.mp3` — only used by archived easter eggs).
  - Wiring: floating-dock item hover → whoosh; ModeToggle click → mp3; SoundToggle → jingle; Projects/Experiences rows → item pop.
- **Data configs** (Zod 4 schemas, all replaceable without code changes): `src/config/projects.ts`, `src/config/experience.ts`, `src/config/testimonials.ts`, plus `site.ts` extension (`jobTitle`, `bio[]`, `skillsVenn` labels, `githubUsername`, `pronunciationLang`).
- **SEO**: `generateMetadata` from `siteConfig` (title = tagline, description = bio summary); JSON-LD `Organization`. No OG image generation in P2 (template uses Cloudinary — deferred).

**Out of scope (P2):** blog (P3), contact (P4), llms routes + overlay links (P5), views/likes, admin, real owner content (placeholder fixtures only, §7 decision 4), `Map` component (not on live home — craft-adjacent, P5), `namePronunciationUrl` audio file (TTS only), `FlipSentences`/`Marquee` wrapper/`TestimonialSpotlight` (unused in live template), `project-item.tsx` (dead code in template — `projects.tsx` renders rows inline).

## 3. Global Constraints

- All P1 Global Constraints apply verbatim (Bun only, Next 16 RSC-first, no `runtime = "edge"`, Base UI `render` props, Zod 4, Oxlint/Oxfmt, template at :6969 for comparison, no new deps without need).
- Dependencies already available: `motion` (existing), `date-fns` (existing per AGENTS.md), `lucide-react` (existing). **No new runtime dependencies in P2.**
- Page stays an RSC shell; client islands only: Info overlays, RevealOnLoad wrappers, SkillsVenn (client in template — verify necessity, prefer server if no interactivity... template marks it `'use client'` though static; keep client to match, review at plan), testimonial marquee (needs hover pause → CSS-only is fine but template marks client), contribution graph (`use(promise)`), projects/experiences rows (sound hooks), wordmark footer, sound hooks consumers.
- `getContributions` is the ONLY network call; it must degrade gracefully (§7 decision 1).
- Next 16 conventions (static/ISR, metadata) verified against `node_modules/next/dist/docs/` at implementation — template's `export const dynamic = 'force-static'` is Next 15 idiom, do not cargo-cult.
- No template-author identity anywhere; placeholder fixtures must be provably neutral (§7 decision 4).

## 4. Architecture

```text
src/
├── app/
│   └── page.tsx                     # REPLACE P1 stub: full home composition (RSC)
├── config/
│   ├── site.ts                      # EXTEND: jobTitle, bio, skillsVenn, githubUsername, pronunciationLang
│   ├── projects.ts                  # NEW: Project schema + placeholder fixtures
│   ├── experience.ts                # NEW: Experience schema + placeholder fixtures
│   └── testimonials.ts              # NEW: Testimonial schema + placeholder fixtures
├── components/
│   ├── ui/
│   │   ├── contribution-graph.tsx   # NEW: primitive port (DS package → single file)
│   │   ├── collapsible.tsx          # NEW: shadcn add (Base UI) + animation bridge
│   │   ├── tag.tsx                  # NEW: Tag chip
│   │   └── reveal-on-load.tsx       # NEW: motion reveal primitive (reused by P3+)
│   ├── layout/
│   │   ├── floating-dock.tsx        # MODIFY: wire useHoverSound on item hover
│   │   ├── mode-toggle.tsx          # MODIFY: wire useSound click mp3
│   │   └── sound-toggle.tsx         # MODIFY: jingle on toggle
│   └── icons/                       # (P1, unchanged)
├── features/home/
│   ├── components/
│   │   ├── info.tsx                 # Info overlays (time/screen only)
│   │   ├── skills-venn.tsx
│   │   ├── pronounce-my-name.tsx
│   │   ├── testimonial.tsx          # atoms (figure/quote/author/avatar/ring)
│   │   ├── testimonials.tsx         # dual-row marquee
│   │   ├── github-contribution.tsx  # section + Suspense boundary
│   │   ├── contribution-graph-client.tsx  # use(promise) client graph
│   │   ├── projects.tsx
│   │   ├── experiences.tsx
│   │   └── wordmark-footer.tsx
│   └── data/
│       └── contributions.ts         # getContributions seam (§7.1)
├── lib/
│   ├── hooks/
│   │   ├── use-time.ts              # NEW (1s clock, mounted guard)
│   │   ├── use-window-size.ts       # NEW (resize listener)
│   │   ├── use-sound.ts             # NEW (mp3 Web Audio)
│   │   ├── use-hover-sound.ts       # NEW (whoosh synth)
│   │   └── use-item-hover-sound.ts  # NEW (pop synth)
│   └── sound.ts                     # NEW: shared AudioContext helper + playToggleJingle
└── providers/ui-store-provider.tsx  # MODIFY: hydrate sound-muted post-mount
public/assets/button-click.mp3       # NEW (binary copy from template)
```

Boundary rules: `page.tsx` RSC; every interactive leaf is its own client island; sound hooks never run on the server (all guarded by `'use client'` + mount checks).

## 5. Component port notes

| Component          | Template source                                                                                                | Port notes                                                                                                                                                                                      |
| ------------------ | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page composition   | `apps/website/app/page.tsx`                                                                                    | Same section order/spacers; `scrollTitle` = `siteConfig.name`; metadata via Next 16 conventions                                                                                                 |
| Hero               | inline in template `page.tsx`                                                                                  | Extract to RSC fragment in `page.tsx`; text content from extended `siteConfig`                                                                                                                  |
| SkillsVenn         | `components/skills-venn.tsx`                                                                                   | Verbatim layout math (55% circles, label positions); labels from config; avatar `next/image fill`                                                                                               |
| RevealOnLoad       | `components/reveal-on-load.tsx`                                                                                | Verbatim → `components/ui/` (generic primitive); `motion/react`                                                                                                                                 |
| PronounceMyName    | `components/pronounce-my-name.tsx`                                                                             | TTS-only (no audio URL); lang from `siteConfig.pronunciationLang` (default `vi-VN`, template hardcodes `en-IN`)                                                                                 |
| Info overlays      | `features/home/components/info.tsx` + `useTime`/`useWindowSize`                                                | Verbatim minus llms block (§7.3); mounted guards prevent SSR mismatch                                                                                                                           |
| Testimonials       | `features/home/components/testimonials.tsx` + `components/testimonial.tsx`                                     | Verbatim CSS marquee; `<style>` inline keyframes pattern kept; config data                                                                                                                      |
| ContributionGraph  | `packages/design-system/components/ui/contribution-graph.tsx`                                                  | Verbatim → single file in `components/ui/`; `date-fns` already present; `cn` import path swap                                                                                                   |
| GitHubContribution | `features/home/components/github-contribution/` + `data/graph.ts`                                              | Server fetch in RSC, promise passed to client `use()`; fallback identical                                                                                                                       |
| Projects           | `features/home/components/projects.tsx`                                                                        | Verbatim rows; data from `config/projects.ts`                                                                                                                                                   |
| Experiences        | `features/home/components/experiences.tsx`                                                                     | Radix Collapsible → Base UI `Collapsible.Root/Trigger/Panel` (§7.5); chevron selector `[[data-panel-open]_&]:rotate-180`                                                                        |
| Collapsible        | `packages/design-system/components/ui/collapsible.tsx`                                                         | shadcn `base-nova` collapsible + height-var bridge (§7.5); `CollapsibleWithContext`/chevrons-icon NOT ported (unused by experiences)                                                            |
| Tag                | `packages/design-system/components/ui/tag.tsx`                                                                 | Verbatim (`rounded-lg border bg-zinc-50 dark:bg-zinc-900 font-mono text-xs`)                                                                                                                    |
| WordmarkFooter     | `components/wordmark-footer.tsx`                                                                               | Verbatim except `brandName` prop source; keep inline STYLE string pattern                                                                                                                       |
| Sound hooks        | `lib/hooks/use-sound.tsx`, `use-hover-sound.tsx`, `use-item-hover-sound.tsx`, `lib/contexts/sound-context.tsx` | Verbatim DSP code (pink-noise coefficients, bandpass, envelopes, throttles); mute source swapped from `SoundContext` to `useUiStore((s) => s.soundEnabled)`; jingle extracted to `lib/sound.ts` |
| Config shapes      | `config/projects.ts`, `config/experience.ts`, `config/testimonials.ts`, `config/user.ts`                       | Same TS shapes, wrapped in Zod 4 schemas parsed at module load (fail fast)                                                                                                                      |

## 6. Data flow & state

- **Home content**: all static data flows from `src/config/*` (Zod-validated at module load) → RSC `page.tsx` → section components. No runtime fetching except contributions.
- **Contributions**: `page.tsx` (RSC) calls `getContributions(siteConfig.githubUsername)` → `Promise<Activity[]>` passed through `GitHubContribution` → `<Suspense fallback={…}>` → client `GitHubContributionGraph` resolves via `use(promise)`. Fetch cached with 24h revalidation (exact Next 16 cache API per bundled docs).
- **Sound state**: single source = P1 `ui-store` (`soundEnabled`, default `true`). Provider hydrates from `localStorage['sound-muted']` after mount (`soundEnabled = stored !== 'true'`); `toggleSound()` writes back (`String(!soundEnabled)`). All hooks subscribe read-only; only SoundToggle mutates.
- **Audio contexts**: each hook owns a lazily-created `AudioContext` in a ref (template pattern); suspended contexts resumed on play (autoplay policy); all failures swallowed (sound is non-critical).
- **Marquee**: pure CSS animation; no JS state. Duration derives from item count (`items.length * 5`s) at render.

## 7. Defect fixes & decisions

1. **Heatmap data source (user decision, 2026-08-03):** keep the template's mechanism — `https://github-contributions-api.jogruber.de/v4/{username}?y=last` — behind a `getContributions()` seam in `src/features/home/data/contributions.ts` for future swap to GitHub GraphQL. Additions beyond template: (a) graceful failure — non-OK response/throw → `console.warn` + return `[]` (renders nothing, matching the component's own empty-data behavior; template crashes the Suspense boundary instead); (b) username from `siteConfig.githubUsername` (Zod-validated non-empty); (c) response validated with a Zod schema (`{ contributions: { date: string; count: number; level: number }[] }`) before use.
2. **Contribution total label:** template hardcodes `'{{count}} contributions in 2025-26'` — stale string. Clone uses the primitive's default `'{{count}} contributions in {{year}}'` (year computed from data), eliminating a per-year manual edit.
3. **llms overlay links deferred:** template `Info` renders `llms-full.txt`/`llms.txt` links, but those routes are P5 scope. P2 renders `show={['time','screen']}` only — no dead links. The llms entries are restored when P5 ships the routes (noted in template-analysis sequencing).
4. **Placeholder content policy:** owner has no real projects/experience/testimonials yet and PRODUCT.md forbids fabricating them. Configs ship **clearly-marked neutral fixtures** (e.g. title `"Sample Project"`, company `"Example Co"`, generic one-line quotes) whose only purpose is exercising the UI for visual verification; each file carries a `// PLACEHOLDER — replace with real content before publishing` banner. Fixture counts mirror the template's shipped state for layout rhythm: 3 projects, 1 employer with 2 positions (exercises `defaultOpen`), 4 testimonials (2 per row).
5. **Collapsible Radix → Base UI (verified against `node_modules/@base-ui/react` 1.6 + `tw-animate-css`):** Base UI exposes `Collapsible.Root/Trigger/Panel`; trigger gets `data-panel-open`, panel gets `data-open`/`data-closed` and sets `--collapsible-panel-height` on itself. Port recipe: Panel carries `[--radix-collapsible-content-height:var(--collapsible-panel-height)]` (bridges tw-animate-css keyframes, which fall back to `auto`) + `data-[open]:animate-collapsible-down data-[closed]:animate-collapsible-up overflow-hidden`; chevron uses `[[data-panel-open]_&]:rotate-180`. If the closing animation proves janky under Base UI's mount timing, fallback is a CSS `grid-template-rows: 0fr/1fr` transition with identical 0.2s ease-out timing — decided in plan Task for experiences.
6. **PronounceMyName language:** `siteConfig.pronunciationLang` (default `"vi-VN"` — owner's name is Vietnamese); template hardcodes `'en-IN'`. No `namePronunciationUrl` support in P2 (template's own value is empty).
7. **Sound persistence key kept as `sound-muted`** for template parity (P1 store defaults `soundEnabled: true` without persistence; P2 adds hydration — no visual change, mute survives reload like the template).
8. **Not ported (dead/unused in template):** `project-item.tsx`, `experience-item.tsx` (template renders inline), `TestimonialSpotlight`, `FlipSentences`, `Marquee` wrapper, `CollapsibleChevronsIcon`, `achievement.mp3`, `Map`.

## 8. Testing & fidelity verification

- **Vitest** (`tests/unit/`): config schemas (valid + invalid shapes for projects/experience/testimonials; site config extension), contributions data layer (Zod parse of API shape, graceful `[]` on non-OK/throw — mocked `fetch`), marquee duration derivation, `useTime` (fake timers, mounted guard), `useWindowSize`, sound hooks (mocked `AudioContext` — assert no-op when `soundEnabled: false`, throttle windows for hover/item hooks), sound-muted hydration mapping.
- **Playwright visual diff** (extend P1 harness, `tests/e2e/home.visual.spec.ts`): `/` full-page + per-section screenshots (hero, testimonials, contribution, projects, experiences open/closed, wordmark) vs template :6969, light + dark; computed-style probes (SkillsVenn circle borders, marquee card ring, heatmap block fills, wordmark gradient stops); interaction probes (collapsible chevron rotate, marquee pause-on-hover, sound toggle flips `sound-muted` in localStorage).
- **Manual @Browser pass** at phase end: side-by-side — reveal stagger, hover sounds audible (muted/unmuted), collapsible animation smoothness, wordmark shine tracking, heatmap with owner's username.
- **Gate:** `bun run validate` green.

## 9. Success criteria

- Home is visually indistinguishable from the template in light and dark (visual diff within tolerance; data-driven differences limited to fixture content, documented in the diff spec).
- All five sound behaviors work and respect the mute toggle persisted across reloads.
- Heatmap renders with the owner's GitHub username and fails silently to empty state when the API is down.
- No template-author identity; all fixtures provably neutral and single-point removable.
- `bun run validate` green; zero new runtime dependencies.

## 10. Risks

- **jogruber API availability** (third-party): mitigated by graceful empty state + 24h cache + documented seam for GraphQL swap; owner accepts residual risk (decision 1).
- **Base UI collapsible exit animation:** mount timing may clip the closing animation (decision 5 fallback ready); verified in the experiences task before the visual diff gate.
- **Audio autoplay policies:** first hover before any user gesture may be silent — same behavior as the template (context resumes on gesture); acceptable parity.
- **Fixture leakage into production:** mitigated by banner comments + a single `src/config/` location + P5/pre-launch checklist item (record in template-analysis).
- **SSR/hydration drift** on time/screen overlays: mounted guards (template pattern) — visual diff asserts no hydration warnings in console.
- **Next 16 cache conventions:** template's `force-static`/fetch `revalidate` idioms are Next 15; implementation reads bundled docs first — risk of subtle caching difference on Cloudflare preview, caught by the preview check.
