# P3 Blog — Design Spec (Template Clone, Sub-project 3)

> Status: **Approved by user — spec + plan gates passed** (2026-08-03)
> Decomposition ratified: P1 Foundation → P2 Home → **P3 Blog** → P4 Contact → P5 Extras.
> Depends on: P1 spec (chrome, globals, Prose tokens), P2 spec (config patterns, RevealOnLoad, sound).
> Sources of truth: template source at `portfolio-template-ui-ux/portfolio-main` (verified 2026-08-03 by direct code reading), `docs/template-analysis.md`, template live at `http://localhost:6969/blog`.

## 1. Goal

Port the template's blog — `/blog` typographic index and `/blog/[slug]` article pages with the full local-MDX pipeline (dual-theme code highlighting, heading anchors, GFM) — onto this repo's stack with 100% visual/behavioral fidelity, **plus** post views/likes backed by Supabase (user decision, 2026-08-03) using the template's archived API semantics.

## 2. Scope

**In scope (P3):**

- **Content pipeline**: local MDX files at `src/features/blog/content/*.mdx`; frontmatter parsed by an owned ~20-line util on top of `yaml` (replaces stale `gray-matter`); slug = filename; `published: true` filter; date-desc sort (template `features/blog/data/posts.ts` semantics).
- **Frontmatter**: `title, description, date, author, published, category, readTime, image` (template `BlogMetadata`) validated with Zod 4 at read time; `readTime` optional in the clone — computed from content when absent (own util, §7.2).
- **MDX rendering**: `next-mdx-remote-client/rsc` (ratified replacement for archived `next-mdx-remote`) with the template's plugin stack (§5): `remark-gfm`, local external-links hast plugin (`_blank`, `nofollow noopener noreferrer` — replaces stale `rehype-external-links`), `rehype-slug`, raw-string extraction visitors (local walker — replaces `unist-util-visit`), `rehype-pretty-code` (dual theme `github-dark`/`github-light`, `keepBackground: false`, empty-line guard).
- **MDX component mapping**: `Heading` (h1–h6 with anchor link + hover `LinkIcon` when `id` present), `Code` (inline pill vs block via `data-language`), `Table` family (`not-prose` bordered wrapper), `figure`/`figcaption` (pretty-code `not-prose` + language icon), `pre` (copy button with raw string), `Steps`/`Step` (left-rail steps), plain `a` (no analytics/UTM).
- **Typography primitives**: `Prose` (`prose max-w-none prose-zinc dark:prose-invert` + full modifier set), `ProseMono`, `Code`, `Heading` — Radix `Slot` removed (`asChild` dropped).
- **`/blog` index** (RSC): `FloatingHeader scrollTitle="Blog"`, `h1 font-bold text-2xl tracking-tight` + muted description, post rows — title `group-hover:underline`, `line-clamp-1` description, mono-ish metadata cluster (`rounded-full border` category chip, readTime, `MMM YYYY` date), `border-b border-dashed`, `hover:bg-accent/50`.
- **`/blog/[slug]`** (RSC, static params): `generateStaticParams` + 404 for unknown slugs; back link `← All posts` (desktop); header — `h1 font-bold text-xl tracking-tight`, metadata row (category chip, readTime, `Month D, YYYY`); `Prose` with `p.lead` description + MDX body; JSON-LD `BlogPosting` (ISO dates, headline, author = `siteConfig.name`, `isAccessibleForFree`); index gets JSON-LD `Blog`.
- **Post views/likes (user decision: include)** — new surfaces designed in the cloned visual language (template's live UI has none; semantics from template's archived hooks):
  - **API**: `GET/POST /api/posts/[slug]/views` (GET → `number`, POST → incremented `number`); `GET/POST /api/posts/[slug]/likes` (GET → `{ likes, currentUserLikes }`, POST `{ count }` → batched, ≤3 per user).
  - **Storage**: Supabase Postgres `post_views`/`post_likes` (slug PK + counter), RLS public-read, writes only via `security definer` RPCs (`increment_post_view`, `add_post_likes` with server-side clamp), migration under `supabase/migrations/`.
  - **Per-user like state**: httpOnly cookie `post-likes-<slug>` (0–3), set by the likes route handler — multi-instance safe (cookie + DB, no in-memory state).
  - **Client**: TanStack Query hooks `usePostViews`/`usePostLikes` (60s dedupe), optimistic like update + 1s debounce batch (template semantics), `PostMetrics` client island in the slug metadata row — mono muted `views` text + heart button (motion scale bounce, fills on user-like).
- **Placeholder content**: 2 clearly-marked placeholder posts exercising: heading hierarchy with anchors, fenced code with `title` (figcaption + language icon), inline code, GFM table, blockquote, external link, `Steps`/`Step` (§7.4).
- **SEO/metadata**: `generateMetadata` on both routes (title/description); no OG image generation (Cloudinary deferred, same as P2).

**Out of scope (P3):** craft section + TOC rail (P5 — verified: template TOC is used **only** by `app/craft/[slug]`, not by blog), docs-specific MDX plugins — `remarkCodeImport`, `rehypeNpmCommand`/`CodeBlockCommand`, `rehypeComponent`, `rehypeAddQueryParams` (template-author UTM params), `ComponentPreview`/`ComponentSource`/`ComponentCSS`, `CodeTabs`/`Tabs` (P5), RSS/Atom feed (`/craft/feed.xml` — P5), `/llms*` + `blog.mdx` routes (P5), admin/auth, comments, search, tags page, OG images, real owner posts.

## 3. Global Constraints

- All P1/P2 Global Constraints apply verbatim.
- Ratified dependencies already installed: `next-mdx-remote-client@2.1.11`, `rehype-pretty-code@0.14.5` + `shiki@4.4.1`, `rehype-slug@6`, `@tailwindcss/typography@0.5.20`, `@tanstack/react-query@5`. New pipeline deps — **revised 2026-08-03 after maintenance audit (npm registry data)**: only `yaml` (2.9.0, 2026-05, 185M dl/wk, zero deps — frontmatter parsing via a local ~20-line util + Zod) and `remark-gfm` (4.0.1, 2025-02, 34M dl/wk, actively maintained by the unified collective — canonical GFM plugin; no credible modern alternative). **Dropped after audit:** `gray-matter` (stale since 2021, legacy js-yaml ^3 dep chain — replaced by `yaml` + local util), `rehype-external-links` (stale since 2023, ~15-line logic — inlined as a local hast plugin), `unist-util-visit` (only needed by our 3 tiny visitors — inlined as a local ~10-line tree walker). No other new runtime deps: **no SWR, no react-use, no dayjs** (TanStack Query, own debounce, native `Date` instead).
- `@tailwindcss/typography` registered in `globals.css` (`@plugin` — Tailwind v4 idiom) if P1 didn't already.
- MDX pipeline runs **server-side only** (RSC); the only client islands are the copy button and `PostMetrics`.
- Supabase access via `src/lib/supabase/server.ts` (anon key + RLS + RPC) — **no service-role key** anywhere in this flow.
- Route handlers must be Workers-safe (OpenNext): no Node-only APIs; `fs` reads for MDX content happen at build/request time in the Node build layer the same way the template does — verify against bundled Next 16 docs + OpenNext constraints at plan time.
- No template-author identity: placeholder posts neutral; no `srisomanaath` UTM params, no author R2 image URLs.

## 4. Architecture

```text
src/
├── app/
│   ├── blog/
│   │   ├── page.tsx               # NEW: index (RSC)
│   │   └── [slug]/page.tsx        # NEW: article (RSC, generateStaticParams)
│   └── api/posts/[slug]/
│       ├── views/route.ts         # NEW: GET/POST view counter
│       └── likes/route.ts         # NEW: GET/POST likes + per-user cookie
├── components/
│   ├── ui/
│   │   ├── typography.tsx         # NEW: Prose/ProseMono/Code/Heading
│   │   └── table.tsx              # NEW: Table family port
│   └── mdx/
│       ├── mdx.tsx                # NEW: MDXRemote wrapper + component map
│       ├── copy-button.tsx        # NEW: client island (clipboard + copied state)
│       └── icons-language.tsx     # NEW: getIconForLanguageExtension subset
├── features/blog/
│   ├── content/
│   │   ├── sample-post-one.mdx    # NEW (PLACEHOLDER banner in frontmatter comment)
│   │   └── sample-post-two.mdx    # NEW
│   ├── components/
│   │   └── post-metrics.tsx       # NEW: views text + like button (client island)
│   ├── data/
│   │   └── posts.ts               # NEW: fs reads + local frontmatter util (yaml) + Zod validation
│   └── types/post.ts              # NEW: BlogMetadata/BlogPost (Zod-inferred)
├── lib/
│   ├── reading-time.ts            # NEW: words/238 wpm → "N min read"
│   └── hooks/
│       ├── use-post-views.ts      # NEW (TanStack Query)
│       └── use-post-likes.ts      # NEW (TanStack Query + debounce batch)
supabase/
└── migrations/
    └── 20260803000000_post_metrics.sql  # NEW: tables + RLS + RPCs
```

## 5. Component port notes

| Component | Template source | Port notes |
| --- | --- | --- |
| Blog index | `app/blog/page.tsx` | Verbatim rows/typography; description text from `siteConfig.description`-adjacent copy (blog-specific string in config); `createOgImage`/Cloudinary removed |
| Blog article | `app/blog/[slug]/page.tsx` | Verbatim layout (single column — **no TOC rail**, verified); `dayjs` → native `Date#toISOString`; author = `siteConfig.name` |
| posts data | `features/blog/data/posts.ts` | Same fs/frontmatter logic (owned `parseFrontmatter` on `yaml`) + Zod parse per file (fail fast at build); `readTime` fallback compute |
| MDX wrapper | `components/mdx.tsx` | `next-mdx-remote/rsc` → `next-mdx-remote-client/rsc` (exports verified); identical plugin order minus docs-specific plugins (§7.5); `CopyButtonWithAnalytics` → `CopyButton` (no analytics); `MDXLinkWithAnalytics` → default anchor |
| Typography | `packages/design-system/components/ui/typography.tsx` | Verbatim classes; Radix `Slot` + `asChild` removed (plain `div`); `border-edge`/`border-s-border` utilities must exist in globals — verify P1 token port, add aliases if missing |
| Table | `packages/design-system/components/ui/table.tsx` | Verbatim (no Radix) |
| Language icons | `components/icons` (`getIconForLanguageExtension`) | Subset: generic `FileCodeIcon` fallback + per-extension mapping for `ts/tsx/js/jsx/json/bash/css/html/md` (lucide) |
| Views/likes hooks | `archive/lib/hooks/usePostViews.ts`, `usePostLikes.ts` | Semantics verbatim (60s dedupe, optimistic +1, 1s debounce batch, ≤3/user); SWR → TanStack Query; `useDebounce` → own `useEffect` timeout |

## 6. Data flow & state

- **Build/request (RSC)**: `posts.ts` reads `content/*.mdx` → local `parseFrontmatter` (`yaml`) → Zod `frontmatterSchema` (with `readTime` fallback: `computeReadTime(content)` when absent) → sorted/published-filtered lists → index page; single post + `generateStaticParams` for article pages.
- **MDX**: article page passes raw MDX string to `MDX` (RSC) → `next-mdx-remote-client/rsc` compiles with the plugin stack → HTML with component mapping. No client JS for content.
- **Views**: `PostMetrics` mounts on article page → `usePostViews` GETs count (TanStack Query, 60s `staleTime`) → effect calls POST increment once per mount session (guard `useRef` — StrictMode double-effect safe), updates cache with returned number.
- **Likes**: GET returns `{ likes, currentUserLikes }` (route reads httpOnly cookie) → heart button optimistic +1 (max 3 per user) → 1s debounce → POST `{ count: batched }` → server clamps, updates cookie + DB via RPC → response refreshes cache.
- **Supabase**: route handlers create the server client per request (`createClient()`), call RPCs only; anon key; RLS allows `select` to everyone, no direct `insert/update`.

## 7. Defect fixes & decisions

1. **Views/likes included (user decision, 2026-08-03)**: template's live blog has no metrics UI (hooks archived). We build the capability fresh: API semantics mirrored from the archived template hooks, storage on Supabase (first schema of the project), UI designed in the cloned language (mono muted text + heart). No visual-diff counterpart — verified by behavior tests + manual pass.
2. **`readTime` stays a frontmatter field** (fidelity — template ships it per-post) but becomes **optional**: when absent, `computeReadTime()` (word count ÷ 238 wpm, rounded up, `"N min read"` — exact template string format) fills it. Ratified dependency decision honored (no `reading-time` lib).
3. **TOC rail is NOT part of blog** — correction to the meta-plan and `template-analysis.md`: template `components/toc.tsx` + `lib/toc.ts` are used only by `app/craft/[slug]`. TOC moves to P5 craft scope; `mdast-util-toc` remains installed for P5. (Also correcting template-analysis during the index-update step.)
4. **Placeholder posts**: 2 posts, `author: "Huỳnh Sang"` (owner), `category: "Placeholder"`, titles prefixed `Sample:` and a frontmatter comment banner; bodies contain only generic filler about the stack — no fabricated claims.
5. **Docs-specific MDX plugins deferred** (`remarkCodeImport`, `rehypeNpmCommand`, `rehypeComponent`, UTM query params, component-preview family, CodeTabs): they serve the template's commercial docs/craft content, not blog fidelity; P5 picks them up with craft. UTM params additionally carry template-author identity (`utm_source=srisomanaath`) — never ported.
6. **Per-user like cap via cookie** (not IP): template tracked `currentUserLikes` server-side (Vercel Postgres per-IP rows, multi-instance-unsafe ratelimit alongside). Cookie + RPC clamp is multi-instance safe and simpler; documented as intentional deviation from the archived implementation (UI/UX semantics unchanged: 3 likes max per visitor).
7. **No SWR/react-use/dayjs**: TanStack Query (AGENTS.md stack), own 20-line debounce, native `Intl`/`Date`.
8. **Rate limiting**: RPC-level clamp (`count` ≤ 3, positive int) + cookie cap; Cloudflare Workers rate-limit binding is introduced in P4 for the contact form and can be extended to these POST routes without interface change (noted in template-analysis sequencing).

## 8. Testing & fidelity verification

- **Vitest** (`tests/unit/`): frontmatter schema (valid/invalid, `readTime` fallback), `computeReadTime` (word counting, rounding, string format), posts data layer (sort, published filter, slug from filename — fixture tmp dir), likes/views route handlers (mocked Supabase RPC: GET shapes, POST clamping, cookie read/set), `usePostLikes` (optimistic +1, 3-like cap, debounce batch), `usePostViews` (single increment per mount).
- **Playwright visual diff** (`tests/e2e/blog.visual.spec.ts`): `/blog` and both placeholder articles vs template `:6969/blog` (structure-level — article content differs), light + dark; code block probes (dual theme variables, figcaption title, copy button visibility/feedback), heading anchor icon on hover, table wrapper styling.
- **E2E behavior**: view increments on article visit; like button optimistic update + cap at 3; counts persist across reload (Supabase local/dev project).
- **Manual @Browser pass**: side-by-side typography/code-block fidelity; copy-to-clipboard; metrics UI feel.
- **Gate**: `bun run validate` green; migration applies cleanly to the dev Supabase project.

## 9. Success criteria

- `/blog` + `/blog/[slug]` visually indistinguishable from the template (visual diff within tolerance; content differences limited to placeholder posts).
- MDX fidelity: dual-theme code blocks with titles + copy button, heading anchors, GFM tables, inline code pills — all matching template rendering.
- Views increment once per visit and persist; likes work with optimistic UI, 3-per-visitor cap, debounce batching; all via Supabase with RLS + RPC (no service role).
- `bun run validate` green; migration documented and applied to the dev project.

## 10. Risks

- **`next-mdx-remote-client` RSC edge cases** vs archived original (component props passthrough for `pre` raw strings): mitigated by the placeholder posts exercising every mapped construct in the visual-diff gate.
- **Supabase RPC + RLS misconfiguration** leaking writes: mitigated by explicit policies + advisor check via Supabase MCP after migration; tests assert direct insert is denied.
- **Workers runtime** for `fs`-based content reads: template pattern works on Vercel; OpenNext bundles content at build — verify on `bun run preview` before the phase gate (fallback: import content via `import.meta.glob`-style build-time module if Workers preview fails).
- **Cookie-based like cap** is trivially bypassable (clear cookies): acceptable for a portfolio metric (template's IP approach equally soft); documented, not a security boundary.
- **First schema of the project**: migration naming/repair conventions set the precedent — follow Supabase skill guidance; no production application without owner approval.
