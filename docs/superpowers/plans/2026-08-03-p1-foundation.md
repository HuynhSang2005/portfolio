# P1 Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Commit policy (Master Execution Plan, 2026-08-03):** commit per task trên branch `feat/portfolio` (Conventional Commits, no agent identity). Merge về `main` chỉ khi user duyệt sau final review. Mỗi task vẫn kết thúc bằng checks trước khi commit.

**Goal:** Port the template's visual foundation (tokens, fonts, theme, scrollport, dock, floating header, drawer, toggles, section chrome) onto this repo's stack with 100% visual/behavioral fidelity, verified by Playwright visual diff against the live template.

**Architecture:** Direct port (Approach A): copy template source file-by-file, rewrite Radix→Base UI (`vaul-base`), `next-themes`→`@wrksz/themes`, Zod 3→4, strip backend/dead features (analytics, buddy, session, hover-sound), fix 3 documented template defects. Chrome is client islands inside a Server Component layout; page-level `ScrollArea` + `FloatingHeader` pattern preserved exactly (template mounts them per page, not in root layout).

**Tech Stack:** Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4 (`@theme`), shadcn/ui on Base UI (`base-nova`), `motion/react`, `@wrksz/themes@1.0.0`, `vaul-base@1.0.0`, Zod 4, Zustand (factory+provider), Vitest + Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-03-p1-foundation-design.md` (ratified).

## Global Constraints

- Bun only: `bun add`, `bun run <script>`, `bunx`. Never npm/pnpm/yarn.
- No new dependencies in P1 — everything needed is already installed (`motion`, `tw-animate-css`, `@wrksz/themes`, `vaul-base`, `zod`, `zustand`, `lucide-react`).
- `layout.tsx` stays a Server Component; `"use client"` only on: dock, toggles, drawer, floating header, scroll-top, hooks consumers.
- Base UI `render` prop pattern; never Radix `asChild`; no `radix-ui` imports anywhere.
- Template runs at `http://localhost:6969` for fidelity comparison (`bun run dev` in `portfolio-template-ui-ux/portfolio-main/apps/website`). The Grep/Glob tools ignore that folder (`.gitignore`) — use `rg --no-ignore` in a terminal when searching template source.
- After every task: `bun run format`, `bun run typecheck`, `bun run lint` must pass. PowerShell may print bun's stderr banner as `NativeCommandError` — judge by exit code and content, not the banner.
- Port must NOT carry these template defects (fix deliberately): (1) dock idle auto-hide timer never arms, (2) ModeToggle fallback double-toggles + throws without `startViewTransition`, (3) `@keyframes reveal` duplicated in globals.css.
- Owner identity: name `Huỳnh Sang` only; no fabricated domains, URLs, taglines beyond `IT Student` (factual per PRODUCT.md), no profile image, empty socials array. All template-author info stripped.
- Font license: copy `X-Regular.woff2`/`X-Medium.woff2` byte-identical; template's blanket MIT `license.md` is the recorded basis (spec §7).

## File Structure

| File                                        | Responsibility                                                                       |
| ------------------------------------------- | ------------------------------------------------------------------------------------ |
| `src/config/site.ts`                        | Zod-validated identity/nav/socials + scroll/theme constants (single source of truth) |
| `src/components/icons/index.tsx`            | Brand icon set: lucide wrappers + ported GitHub/LinkedIn/X SVGs                      |
| `src/lib/fonts.ts`                          | `fontX` (local woff2) + `fontMono` (JetBrains Mono)                                  |
| `public/assets/X-*.woff2`                   | Copied font binaries                                                                 |
| `src/app/globals.css`                       | Full token system + utilities + base layer + view-transition CSS (template port)     |
| `src/app/providers.tsx`                     | Adds `@wrksz/themes` ThemeProvider                                                   |
| `src/app/layout.tsx`                        | Fonts, os-macos script, Navigation, main wrapper (server)                            |
| `src/components/layout/navigation.tsx`      | Navigation composition (BottomDock desktop + ScrollTop)                              |
| `src/components/layout/scroll-area.tsx`     | Scrollport container (`SCROLL_AREA_ID`)                                              |
| `src/lib/hooks/use-mounted.ts`              | Hydration guard hook                                                                 |
| `src/lib/hooks/use-scroll-direction.ts`     | Shared scroll direction/position for scrollport                                      |
| `src/lib/hooks/use-meta-color.ts`           | meta theme-color sync                                                                |
| `src/stores/ui-store.ts`                    | Adds `soundEnabled` + `toggleSound()`                                                |
| `src/components/layout/sound-toggle.tsx`    | Sound toggle (visual complete, store-backed stub)                                    |
| `src/components/layout/mode-toggle.tsx`     | View Transitions theme toggle (defect-fixed)                                         |
| `src/components/layout/floating-dock.tsx`   | Dock primitive (motion magnification)                                                |
| `src/components/layout/dock.tsx`            | BottomDock composition (defect-fixed auto-hide)                                      |
| `src/components/ui/drawer.tsx`              | shadcn-style drawer wrapper on `vaul-base`                                           |
| `src/components/layout/mobile-drawer.tsx`   | Mobile navigation drawer                                                             |
| `src/components/layout/floating-header.tsx` | Mobile sticky header (scrollTitle reveal)                                            |
| `src/components/layout/scroll-top.tsx`      | Scroll-to-top button                                                                 |
| `src/components/layout/section.tsx`         | Section chrome with corner marks                                                     |
| `src/components/layout/separator.tsx`       | Dashed-band separator                                                                |
| `src/components/ui/button.tsx`              | Restyled to template gradient/pill spec                                              |
| `src/app/page.tsx`                          | Stub home exercising full chrome (P2 replaces)                                       |
| `tests/unit/site-config.test.ts`            | Config schema tests                                                                  |
| `tests/unit/use-scroll-direction.test.ts`   | Hook logic tests                                                                     |
| `tests/unit/theme-toggle.test.ts`           | Toggle helper + fallback tests                                                       |
| `tests/e2e/foundation.visual.spec.ts`       | Template-vs-clone visual diff + computed-style probes                                |

---

### Task 1: Site config + brand icons

**Files:**

- Create: `src/config/site.ts`
- Create: `src/components/icons/index.tsx`
- Test: `tests/unit/site-config.test.ts`

**Interfaces:**

- Consumes: nothing (leaf task).
- Produces:
  - `siteConfig: SiteConfig` — `{ name: string; tagline: string; email?: string; navbar: { href: string; label: string; icon: NavIconKey; isNew?: boolean }[]; socials: { name: string; url: string; icon: SocialIconKey }[] }`
  - `SCROLL_AREA_ID = "scroll-area-id"`, `MOBILE_SCROLL_THRESHOLD = 20`, `META_THEME_COLORS = { light: "#ffffff", dark: "#09090b" }`
  - `Icons: Record<string, FC<IconProps>>` with keys `home, craft, bookmark, calendar, email, github, linkedin, x`
  - `type IconProps = SVGProps<SVGSVGElement>`

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/site-config.test.ts
import { describe, expect, it } from "vitest";
import { siteConfig, siteConfigSchema, META_THEME_COLORS, SCROLL_AREA_ID } from "@/config/site";

describe("siteConfig", () => {
  it("passes its own Zod schema", () => {
    expect(() => siteConfigSchema.parse(siteConfig)).not.toThrow();
  });

  it("uses the owner identity and no template-author info", () => {
    expect(siteConfig.name).toBe("Huỳnh Sang");
    const serialized = JSON.stringify(siteConfig).toLowerCase();
    for (const banned of ["ruixen", "srisomanaath", "somanaath"]) {
      expect(serialized).not.toContain(banned);
    }
  });

  it("navbar hrefs are internal paths", () => {
    for (const item of siteConfig.navbar) {
      expect(item.href.startsWith("/")).toBe(true);
    }
  });

  it("exposes template constants verbatim", () => {
    expect(SCROLL_AREA_ID).toBe("scroll-area-id");
    expect(META_THEME_COLORS).toEqual({ light: "#ffffff", dark: "#09090b" });
  });

  it("rejects invalid config shapes", () => {
    expect(siteConfigSchema.safeParse({ name: "" }).success).toBe(false);
    expect(
      siteConfigSchema.safeParse({
        ...siteConfig,
        navbar: [{ href: "https://x.com", label: "Bad", icon: "home" }],
      }).success,
    ).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bunx vitest run tests/unit/site-config.test.ts`
Expected: FAIL — `Cannot find module '@/config/site'`

- [ ] **Step 3: Create brand icons**

Template references (`components/icons/index.tsx` lines 91-96, 113-130, 168-175): lucide wrappers for `home/craft/bookmark/calendar/email`; verbatim SVG paths for `linkedin/x/github` (copy path data exactly from the template file).

```tsx
// src/components/icons/index.tsx
import type { SVGProps } from "react";
import { BookmarkIcon, CalendarIcon, HomeIcon, MailIcon, PencilIcon } from "lucide-react";

export type IconProps = SVGProps<SVGSVGElement>;

export const Icons = {
  home: (props: IconProps) => <HomeIcon {...props} />,
  craft: (props: IconProps) => <PencilIcon {...props} />,
  bookmark: (props: IconProps) => <BookmarkIcon {...props} />,
  calendar: (props: IconProps) => <CalendarIcon {...props} />,
  email: (props: IconProps) => <MailIcon {...props} />,
  linkedin: (props: IconProps) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>LinkedIn</title>
      <path
        fill="currentColor"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      />
    </svg>
  ),
  x: (props: IconProps) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>X</title>
      <path
        fill="currentColor"
        d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
      />
    </svg>
  ),
  github: (props: IconProps) => (
    <svg viewBox="0 0 438.549 438.549" {...props}>
      <title>GitHub</title>
      <path
        fill="currentColor"
        d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
      />
    </svg>
  ),
};

export type IconKey = keyof typeof Icons;
```

- [ ] **Step 4: Create site config**

```ts
// src/config/site.ts
import { z } from "zod";

export const SCROLL_AREA_ID = "scroll-area-id";
export const MOBILE_SCROLL_THRESHOLD = 20;
export const META_THEME_COLORS = { light: "#ffffff", dark: "#09090b" } as const;

const navIconKeys = ["home", "craft", "bookmark", "calendar"] as const;
const socialIconKeys = ["github", "linkedin", "x", "email"] as const;

const navItemSchema = z.object({
  href: z.string().startsWith("/"),
  label: z.string().min(1),
  icon: z.enum(navIconKeys),
  isNew: z.boolean().optional(),
});

const socialSchema = z.object({
  name: z.string().min(1),
  url: z.string().min(1),
  icon: z.enum(socialIconKeys),
});

export const siteConfigSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().min(1),
  email: z.email().optional(),
  navbar: z.array(navItemSchema).min(1),
  socials: z.array(socialSchema),
});

export type SiteConfig = z.infer<typeof siteConfigSchema>;
export type NavIconKey = (typeof navIconKeys)[number];
export type SocialIconKey = (typeof socialIconKeys)[number];

export const siteConfig: SiteConfig = siteConfigSchema.parse({
  name: "Huỳnh Sang",
  tagline: "IT Student",
  navbar: [
    { href: "/", icon: "home", label: "Home" },
    { href: "/craft", icon: "craft", label: "Craft", isNew: true },
    { href: "/blog", icon: "bookmark", label: "Blog" },
  ],
  // Owner socials intentionally empty until real URLs exist — dock/drawer
  // render the social section only when this array is non-empty.
  socials: [],
});
```

Note: the template's `/cal` (Book a Meeting) nav item is excluded — Cal.com is a deferred extra (template-analysis sequencing). Zod 4 idiom: `z.email()` (top-level), not `z.string().email()`.

- [ ] **Step 5: Run test to verify it passes**

Run: `bunx vitest run tests/unit/site-config.test.ts`
Expected: PASS (5 tests)

- [ ] **Step 6: Checks**

Run: `bun run format && bun run typecheck && bun run lint`
Expected: exit 0, no errors.

---

### Task 2: Fonts + globals.css token/base port

**Files:**

- Create: `public/assets/X-Regular.woff2`, `public/assets/X-Medium.woff2` (binary copy)
- Create: `src/lib/fonts.ts`
- Modify: `src/app/globals.css` (full replace)

**Interfaces:**

- Consumes: nothing.
- Produces:
  - `fontX`, `fontMono` (next/font objects with `.variable` — used by Task 3 layout)
  - CSS utilities used everywhere later: `scrollable-area`, `layout`, `content-wrapper`, `content`, `mask-gradient`, `bg-dashed`, `screen-line-before/after`, `no-scrollbar`, `link`, `step`, `thumbnail-shadow`, `horizontal-scroll-area`
  - Animate utilities: `animate-reveal`, `animate-marquee`, `animate-marquee-vertical`
  - Token classes: `bg-background`, `text-foreground`, `border-border`, `bg-edge`, `font-x`, `font-mono`, `text-muted-foreground`, etc.

- [ ] **Step 1: Copy font binaries**

```powershell
New-Item -ItemType Directory -Force public\assets | Out-Null
Copy-Item portfolio-template-ui-ux\portfolio-main\apps\website\public\assets\X-Regular.woff2, portfolio-template-ui-ux\portfolio-main\apps\website\public\assets\X-Medium.woff2 public\assets\
```

Verify: `Get-ChildItem public\assets` lists exactly the two woff2 files; byte sizes match source.

- [ ] **Step 2: Create fonts module**

Template reference: `apps/website/lib/fonts.ts` (drop unused `fontNdot55`).

```ts
// src/lib/fonts.ts
import { JetBrains_Mono as FontMono } from "next/font/google";
import localFont from "next/font/local";

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const fontX = localFont({
  src: [
    { path: "../../public/assets/X-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/assets/X-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-x",
});
```

- [ ] **Step 3: Replace globals.css**

Full replacement content — template `packages/design-system/styles/globals.css` ported with these adaptations: (a) keep `shadcn/tailwind.css` import (base-nova preset); (b) keep `--radius` + radius scale (existing base-nova ui components reference `--radius-md` etc.); (c) map `--font-sans` → X so base-nova components inherit template typography; (d) keep list for keyframes/animations: `reveal` (deduped — template defines it twice, keep one), `marquee`, `marquee-vertical`; skip template keyframes for archived/registry features (`fall-*`, `cloud`, `marker`, `plane*`, `emoji`, `loading`, `shimmer`, `mutation`, `spin-around`, `slide`, `border-beam`, `slideUpFade`) and their `animate-*` utilities; (e) skip `lab-bg`, `bg-grid`, cursor/caret reduced-motion block, `[data-pattern="stripes"]`, and the `[data-rehype-pretty-code-*]` `@layer components` block (P3 owns it) — but KEEP the `--color-code*` tokens; (f) no `@source` (single-app auto-detection).

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@plugin "@tailwindcss/typography";

@custom-variant dark (&:where(.dark, .dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover-border: var(--popover-border);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-border: var(--border);
  --color-edge: var(--edge);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-info: var(--info);
  --color-success: var(--success);
  --color-destructive: var(--destructive);
  --color-link: var(--link);
  --color-code: var(--code);
  --color-code-foreground: var(--code-foreground);
  --color-code-number: var(--code-number);
  --color-code-highlight: var(--code-highlight);
  --color-selection: var(--selection);
  --color-selection-foreground: var(--selection-foreground);

  --font-x: var(--font-x);
  --font-mono: var(--font-mono);
  --font-sans: var(--font-x);

  --shadow-popover: var(--shadow-popover);

  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
}

@utility no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
  --primary: oklch(0.141 0.005 285.823);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.967 0.001 286.375);
  --secondary-foreground: oklch(0.141 0.005 285.823);
  --muted: oklch(0.967 0.001 286.375);
  --muted-foreground: oklch(0.552 0.016 285.938);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.141 0.005 285.823);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.141 0.005 285.823);
  --popover-border: color-mix(in oklab, var(--color-black) 15%, transparent);
  --accent: oklch(0.967 0.001 286.375);
  --accent-foreground: oklch(0.21 0.006 285.885);
  --border: oklch(0.92 0.004 286.32);
  --edge: color-mix(in oklab, var(--border) 64%, var(--background));
  --input: oklch(0.92 0.004 286.32);
  --ring: oklch(0.705 0.015 286.067);
  --info: oklch(0.67 0.17 244.98);
  --success: oklch(0.723 0.219 149.579);
  --destructive: oklch(0.577 0.245 27.325);
  --link: oklch(0.488 0.243 264.376);
  --code: oklch(0.985 0 0);
  --code-foreground: oklch(0.141 0.005 285.823);
  --code-number: oklch(0.705 0.015 286.067);
  --code-highlight: oklch(0.967 0.001 286.375);
  --selection: oklch(0.141 0.005 285.823);
  --selection-foreground: oklch(0.985 0 0);
  --shadow-popover: 0 6px 24px rgba(0, 0, 0, 0.25);
  --radius: 0.625rem;
}

.dark {
  --background: oklch(0.141 0.005 285.823);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.37 0.013 285.805);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.274 0.006 286.033);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.274 0.006 286.033);
  --muted-foreground: oklch(0.705 0.015 286.067);
  --card: oklch(0.21 0.006 285.885);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.21 0.006 285.885);
  --popover-foreground: oklch(0.985 0 0);
  --popover-border: oklch(0.37 0.013 285.805);
  --accent: oklch(0.274 0.006 286.033);
  --accent-foreground: oklch(0.985 0 0);
  --border: oklch(0.274 0.006 286.033);
  --input: oklch(0.274 0.006 286.033);
  --ring: oklch(0.552 0.016 285.938);
  --success: oklch(0.723 0.219 149.579);
  --destructive: oklch(0.505 0.213 27.518);
  --link: oklch(0.623 0.214 259.815);
  --code: oklch(0.21 0.006 285.885);
  --code-foreground: oklch(0.985 0 0);
  --code-number: oklch(0.552 0.016 285.938);
  --code-highlight: oklch(0.274 0.006 286.033);
  --selection: oklch(0.985 0 0);
  --selection-foreground: oklch(0.141 0.005 285.823);
  --shadow-popover: 0 0 24px rgba(0, 0, 0, 0.5);
}

@layer base {
  *,
  ::after,
  ::before,
  ::backdrop,
  ::file-selector-button {
    @apply border-border outline-ring/50;
  }

  html {
    @apply overflow-hidden scroll-smooth antialiased motion-safe:scroll-smooth;
    text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    text-rendering: optimizeLegibility;
  }

  body {
    @apply overscroll-y-none bg-background font-x text-foreground antialiased;
    font-feature-settings:
      "rlig" 1,
      "calt" 1;
    scroll-behavior: smooth;
    touch-action: manipulation;
  }

  .rendering-pixelated {
    image-rendering: pixelated;
  }

  a,
  button {
    @apply cursor-pointer outline-hidden;
  }

  a {
    @apply transition-colors duration-300;
  }

  button:focus {
    @apply outline-hidden;
  }

  button:disabled,
  button[disabled] {
    @apply cursor-not-allowed;
  }

  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: var(--border);
    border-radius: 5px;
  }
  * {
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
  }

  .hide-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  ::view-transition-group(root) {
    animation-duration: 0.8s;
    animation-timing-function: linear(
      0 0%,
      0.1684 2.66%,
      0.3165 5.49%,
      0.446 8.52%,
      0.5581 11.78%,
      0.6535 15.29%,
      0.7341 19.11%,
      0.8011 23.3%,
      0.8557 27.93%,
      0.8962 32.68%,
      0.9283 38.01%,
      0.9529 44.08%,
      0.9711 51.14%,
      0.9833 59.06%,
      0.9915 68.74%,
      1 100%
    );
  }
  ::view-transition-new(root) {
    animation-name: reveal-light;
  }
  ::view-transition-old(root),
  .dark::view-transition-old(root) {
    animation: none;
    z-index: -1;
  }
  .dark::view-transition-new(root) {
    animation-name: reveal-dark;
  }
  @keyframes reveal-dark {
    from {
      clip-path: polygon(50% -71%, -50% 71%, -50% 71%, 50% -71%);
    }
    to {
      clip-path: polygon(50% -71%, -50% 71%, 50% 171%, 171% 50%);
    }
  }
  @keyframes reveal-light {
    from {
      clip-path: polygon(171% 50%, 50% 171%, 50% 171%, 171% 50%);
    }
    to {
      clip-path: polygon(171% 50%, 50% 171%, -50% 71%, 50% -71%);
    }
  }
}

@utility layout {
  @apply grid layout-sm xl:layout-xl gap-y-2 xl:gap-x-9 xl:px-0 *:col-start-2 xl:*:col-start-3;
}

@utility layout-sm {
  grid-template-columns: 1fr min(var(--breakpoint-sm), 100%) 1fr;
}

@utility layout-xl {
  grid-template-columns:
    1fr minmax(auto, 10rem) min(var(--breakpoint-sm), 100%) minmax(auto, 10rem)
    1fr;
}

@utility content-wrapper {
  @apply z-1 w-full px-6 pt-8 pb-8 lg:px-8 lg:pt-12 lg:pb-20;
}

@utility content {
  @apply mx-auto w-full lg:mb-0 lg:max-w-3xl;
}

@utility scrollable-area {
  @apply h-full max-h-dvh min-h-dvh overflow-x-hidden overflow-y-auto;
}

@utility horizontal-scroll-area {
  @apply block w-fit min-w-full grow;
}

@utility thumbnail-shadow {
  box-shadow:
    0 0 0 0.5px #e2e8f0,
    0 0 0 1px rgba(226, 232, 240, 0.5),
    0 0 0 3px #f8fafc,
    0 0 0 3.5px #f1f5f9,
    0 10px 15px -3px rgb(59 130 246 / 5%),
    0 4px 6px -4px rgb(59 130 246 / 5%);
}

@utility link {
  @apply font-medium underline underline-offset-4;
}

@utility screen-line-before {
  @apply relative before:absolute before:top-0 before:-left-[100vw] before:-z-1 before:h-px before:w-[200vw] before:bg-edge;
}

@utility screen-line-after {
  @apply relative after:absolute after:bottom-0 after:-left-[100vw] after:-z-1 after:h-px after:w-[200vw] after:bg-edge;
}

@utility step {
  counter-increment: step;
  &::before {
    @apply mr-2 inline-flex size-7 items-center justify-center rounded-full bg-muted text-center -indent-px text-sm font-medium text-muted-foreground md:absolute md:-mt-0.5 md:-ml-11.5 md:size-8;
    content: counter(step);
  }
}

@utility mask-gradient {
  mask-image: linear-gradient(
    0deg,
    transparent,
    rgb(255, 255, 255) 16px,
    rgb(255, 255, 255) calc(100% - 16px),
    transparent
  );
}

@utility bg-dashed {
  background-image: repeating-linear-gradient(
    45deg,
    var(--color-background) 0px,
    var(--color-background) 2px,
    rgb(225 225 225) 2px,
    rgb(225 225 225) 3px,
    var(--color-background) 3px,
    var(--color-background) 4px
  );
}

.dark .bg-dashed {
  background-image: repeating-linear-gradient(
    45deg,
    var(--color-background) 0px,
    var(--color-background) 2px,
    rgb(60 60 60) 2px,
    rgb(60 60 60) 3px,
    var(--color-background) 3px,
    var(--color-background) 4px
  );
}

@layer utilities {
  .animate-reveal {
    animation: reveal 0.7s ease-in-out;
  }

  .animate-marquee {
    animation: marquee var(--duration) linear infinite;
  }

  .animate-marquee-vertical {
    animation: marquee-vertical var(--duration) linear infinite;
  }
}

@keyframes reveal {
  0% {
    opacity: 0;
    filter: brightness(1) blur(15px);
    scale: 1.0125;
  }
  10% {
    opacity: 1;
    filter: brightness(1.25) blur(10px);
  }
  100% {
    opacity: 1;
    filter: brightness(1) blur(0);
    scale: 1;
  }
}

@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-100% - var(--gap)));
  }
}

@keyframes marquee-vertical {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(calc(-100% - var(--gap)));
  }
}
```

- [ ] **Step 4: Verify build compiles the CSS**

Run: `bun run build`
Expected: build succeeds; no Tailwind errors. (Fonts load — network needed once for JetBrains Mono.)

- [ ] **Step 5: Checks**

Run: `bun run format && bun run typecheck && bun run lint`
Expected: exit 0.

---

### Task 3: Theme provider + root layout shell

**Files:**

- Modify: `src/app/providers.tsx`
- Modify: `src/app/layout.tsx`
- Create: `src/components/layout/navigation.tsx` (shell; dock/scroll-top wired in Tasks 7-8 — export composition that renders only what exists so far)

**Interfaces:**

- Consumes: `fontX`, `fontMono` (Task 2).
- Produces:
  - `Providers` with `ThemeProvider` wrapping children (props: `attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange`)
  - `RootLayout` rendering `<html className={cn(fontX.variable, fontMono.variable, "scroll-smooth")} suppressHydrationWarning>`, os-macos script, `<body suppressHydrationWarning>` → `Providers` → `Navigation` + `<main id="main-content" vaul-drawer-wrapper="" className="relative min-h-screen w-full bg-background">`
  - `Navigation` default export (Task 7/8 add `<BottomDock className="hidden lg:block" />` and `<ScrollTop />`)

- [ ] **Step 1: Add ThemeProvider to Providers**

```tsx
// src/app/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "@wrksz/themes/next";
import { useState, type ReactNode } from "react";

import { UiStoreProvider } from "@/providers/ui-store-provider";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <NuqsAdapter>
        <QueryClientProvider client={queryClient}>
          <UiStoreProvider>{children}</UiStoreProvider>
        </QueryClientProvider>
      </NuqsAdapter>
    </ThemeProvider>
  );
}
```

If `tsc` reports an unknown prop on `ThemeProvider` (`attribute`/`enableSystem`/`disableTransitionOnChange`), drop only the offending prop — `@wrksz/themes` documents next-themes-style API but the compiler is the source of truth. Record any dropped prop in the task notes.

- [ ] **Step 2: Create Navigation shell**

```tsx
// src/components/layout/navigation.tsx
export default function Navigation() {
  return null; // Tasks 7-8 mount BottomDock (desktop) and ScrollTop here
}
```

- [ ] **Step 3: Rewrite RootLayout**

Template reference: `apps/website/app/layout.tsx`. Adaptations: no auth/session, no Umami script, no DevTools; os-macos script kept (template uses the class for platform-specific chrome); template's `localStorage.theme` meta-color part dropped — meta color is handled by `viewport` + Task 6 hook (`@wrksz/themes` owns its own no-flash script).

```tsx
// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import type React from "react";

import { Providers } from "@/app/providers";
import Navigation from "@/components/layout/navigation";
import { META_THEME_COLORS } from "@/config/site";
import { fontMono, fontX } from "@/lib/fonts";
import { cn } from "@/lib/utils";

import "./globals.css";

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light,
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Huỳnh Sang",
  description: "Personal portfolio",
};

const platformScript = String.raw`
  try {
    if (/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)) {
      document.documentElement.classList.add('os-macos')
    }
  } catch (_) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(fontX.variable, fontMono.variable, "scroll-smooth")}
      suppressHydrationWarning
    >
      <head>
        <script type="text/javascript" dangerouslySetInnerHTML={{ __html: platformScript }} />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <Navigation />
          <main
            id="main-content"
            vaul-drawer-wrapper=""
            className="relative min-h-screen w-full bg-background"
          >
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify dev server renders**

Run: `bun run dev` (background), open `http://localhost:3000`
Expected: page renders with X font; toggling OS dark mode flips `class="dark"` on `<html>` (system theme works); no hydration errors in console. Stop the dev server after.

- [ ] **Step 5: Checks**

Run: `bun run format && bun run typecheck && bun run lint`
Expected: exit 0.

---

### Task 4: Scrollport + scroll hooks

**Files:**

- Create: `src/components/layout/scroll-area.tsx`
- Create: `src/lib/hooks/use-mounted.ts`
- Create: `src/lib/hooks/use-scroll-direction.ts`
- Test: `tests/unit/use-scroll-direction.test.ts`

**Interfaces:**

- Consumes: `SCROLL_AREA_ID` (Task 1).
- Produces:
  - `ScrollArea({ useScrollAreaId?: boolean; className?: string; children })` — renders `<div id?={SCROLL_AREA_ID} className={cn("scrollable-area relative flex w-full flex-col", className)}>`
  - `useMounted(): boolean`
  - `useScrollDirection(): { scrollTop: number; direction: "up" | "down"; visible: boolean }` — reads `#SCROLL_AREA_ID` (fallback `window`), `visible = scrollTop >= 400`; used by Tasks 7-8 (dock/header/scroll-top read this or their own template-verbatim listeners — see task notes)

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/use-scroll-direction.test.ts
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { SCROLL_AREA_ID } from "@/config/site";
import { useScrollDirection } from "@/lib/hooks/use-scroll-direction";

function createScrollArea() {
  const el = document.createElement("div");
  el.id = SCROLL_AREA_ID;
  document.body.appendChild(el);
  return el;
}

function scrollTo(el: HTMLElement, top: number) {
  Object.defineProperty(el, "scrollTop", { value: top, writable: true, configurable: true });
  el.dispatchEvent(new Event("scroll"));
}

describe("useScrollDirection", () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = createScrollArea();
  });

  afterEach(() => {
    el.remove();
  });

  it("starts at top, direction down, not visible", () => {
    const { result } = renderHook(() => useScrollDirection());
    expect(result.current).toEqual({ scrollTop: 0, direction: "down", visible: false });
  });

  it("reports direction down then up as scroll position changes", () => {
    const { result } = renderHook(() => useScrollDirection());
    act(() => scrollTo(el, 500));
    expect(result.current.direction).toBe("down");
    expect(result.current.visible).toBe(true);
    act(() => scrollTo(el, 200));
    expect(result.current.direction).toBe("up");
    expect(result.current.scrollTop).toBe(200);
  });

  it("visible is false below the 400 threshold", () => {
    const { result } = renderHook(() => useScrollDirection());
    act(() => scrollTo(el, 399));
    expect(result.current.visible).toBe(false);
    act(() => scrollTo(el, 400));
    expect(result.current.visible).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bunx vitest run tests/unit/use-scroll-direction.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement hooks + ScrollArea**

```ts
// src/lib/hooks/use-mounted.ts
"use client";

import { useEffect, useState } from "react";

export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
```

```ts
// src/lib/hooks/use-scroll-direction.ts
"use client";

import { useEffect, useState } from "react";

import { SCROLL_AREA_ID } from "@/config/site";

export type ScrollDirectionState = {
  scrollTop: number;
  direction: "up" | "down";
  visible: boolean;
};

const VISIBLE_THRESHOLD = 400;

export function useScrollDirection(): ScrollDirectionState {
  const [state, setState] = useState<ScrollDirectionState>({
    scrollTop: 0,
    direction: "down",
    visible: false,
  });

  useEffect(() => {
    const scrollAreaElem = document.querySelector(`#${SCROLL_AREA_ID}`);
    let lastScrollTop = 0;

    const handleScroll = () => {
      const scrollTop =
        scrollAreaElem instanceof HTMLElement ? scrollAreaElem.scrollTop : window.scrollY;
      setState({
        scrollTop,
        direction: scrollTop - lastScrollTop > 0 ? "down" : "up",
        visible: scrollTop >= VISIBLE_THRESHOLD,
      });
      lastScrollTop = scrollTop;
    };

    const target: HTMLElement | Window =
      scrollAreaElem instanceof HTMLElement ? scrollAreaElem : window;
    target.addEventListener("scroll", handleScroll, { passive: true });
    return () => target.removeEventListener("scroll", handleScroll);
  }, []);

  return state;
}
```

```tsx
// src/components/layout/scroll-area.tsx
import { SCROLL_AREA_ID } from "@/config/site";
import { cn } from "@/lib/utils";

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  useScrollAreaId?: boolean;
}

export const ScrollArea = ({ useScrollAreaId = false, className, ...props }: ScrollAreaProps) => (
  <div
    {...(useScrollAreaId && { id: SCROLL_AREA_ID })}
    className={cn("scrollable-area relative flex w-full flex-col", className)}
    {...props}
  />
);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bunx vitest run tests/unit/use-scroll-direction.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Checks**

Run: `bun run format && bun run typecheck && bun run lint`
Expected: exit 0.

---

### Task 5: Sound store slice + SoundToggle stub

**Files:**

- Modify: `src/stores/ui-store.ts`
- Create: `src/components/layout/sound-toggle.tsx`
- Test: `tests/unit/ui-store.test.ts`

**Interfaces:**

- Consumes: existing `createUiStore` factory/provider pattern.
- Produces:
  - `UiState` gains `soundEnabled: boolean` (default `true` — template default is unmuted)
  - `UiActions` gains `toggleSound(): void`
  - `SoundToggle` component — `useUiStore((s) => s.soundEnabled)` + `toggleSound`; renders Volume2/VolumeOff, `aria-label` matches template strings (`"Mute sounds"` / `"Unmute sounds"`)

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/ui-store.test.ts
import { describe, expect, it } from "vitest";

import { createUiStore } from "@/stores/ui-store";

describe("ui-store sound slice", () => {
  it("defaults to sound enabled", () => {
    const store = createUiStore();
    expect(store.getState().soundEnabled).toBe(true);
  });

  it("toggleSound flips the flag", () => {
    const store = createUiStore();
    store.getState().toggleSound();
    expect(store.getState().soundEnabled).toBe(false);
    store.getState().toggleSound();
    expect(store.getState().soundEnabled).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bunx vitest run tests/unit/ui-store.test.ts`
Expected: FAIL — `soundEnabled` is `undefined` / `toggleSound is not a function`.

- [ ] **Step 3: Extend the store**

```ts
// src/stores/ui-store.ts
import { createStore } from "zustand/vanilla";

export type UiState = {
  sidebarOpen: boolean;
  soundEnabled: boolean;
};

export type UiActions = {
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  toggleSound: () => void;
};

export type UiStore = UiState & UiActions;

export const defaultUiState: UiState = {
  sidebarOpen: false,
  soundEnabled: true,
};

export const createUiStore = (initState: UiState = defaultUiState) => {
  return createStore<UiStore>()((set) => ({
    ...initState,
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  }));
};
```

- [ ] **Step 4: Create SoundToggle**

Template reference: `components/navigation/dock/sound-toggle.tsx` (identical visuals; store instead of sound-context — playback wiring is P2).

```tsx
// src/components/layout/sound-toggle.tsx
"use client";

import { Volume2Icon, VolumeOffIcon } from "lucide-react";

import { useUiStore } from "@/providers/ui-store-provider";

export function SoundToggle() {
  const soundEnabled = useUiStore((s) => s.soundEnabled);
  const toggleSound = useUiStore((s) => s.toggleSound);

  return (
    <button
      type="button"
      onClick={toggleSound}
      className="flex h-full w-full items-center justify-center"
      aria-label={soundEnabled ? "Mute sounds" : "Unmute sounds"}
    >
      {soundEnabled ? <Volume2Icon className="size-4" /> : <VolumeOffIcon className="size-4" />}
    </button>
  );
}
```

- [ ] **Step 5: Run test + checks**

Run: `bunx vitest run tests/unit/ui-store.test.ts && bun run format && bun run typecheck && bun run lint`
Expected: PASS (2 tests); checks exit 0.

---

### Task 6: ModeToggle + meta-color hook

**Files:**

- Create: `src/lib/hooks/use-meta-color.ts`
- Create: `src/components/layout/mode-toggle.tsx`
- Test: `tests/unit/theme-toggle.test.ts`

**Interfaces:**

- Consumes: `META_THEME_COLORS` (Task 1), `@wrksz/themes` `useTheme` (Task 3 provider).
- Produces:
  - `useMetaColor(): { metaColor: string; setMetaColor: (color: string) => void }`
  - `getNextTheme(resolvedTheme: string | undefined): "light" | "dark"` — pure helper
  - `ModeToggle` — dock icon with sun/moon morph (motion), View Transitions with safe fallback (defect fix #2)

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/theme-toggle.test.ts
import { describe, expect, it } from "vitest";

import { getNextTheme } from "@/components/layout/mode-toggle";

describe("getNextTheme", () => {
  it("switches dark -> light", () => {
    expect(getNextTheme("dark")).toBe("light");
  });

  it("switches light -> dark", () => {
    expect(getNextTheme("light")).toBe("dark");
  });

  it("treats undefined/system-unresolved as light -> dark", () => {
    expect(getNextTheme(undefined)).toBe("dark");
  });
});

describe("view transition fallback", () => {
  it("applies the theme exactly once when startViewTransition is missing", async () => {
    const { applyThemeTransition } = await import("@/components/layout/mode-toggle");
    let calls = 0;
    const switchTheme = () => {
      calls += 1;
    };
    // jsdom has no document.startViewTransition
    applyThemeTransition(switchTheme);
    expect(calls).toBe(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bunx vitest run tests/unit/theme-toggle.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Create meta-color hook**

```ts
// src/lib/hooks/use-meta-color.ts
"use client";

import { useTheme } from "@wrksz/themes/client";
import { useCallback, useMemo } from "react";

import { META_THEME_COLORS } from "@/config/site";

export function useMetaColor() {
  const { resolvedTheme } = useTheme();

  const metaColor = useMemo(
    () => (resolvedTheme !== "dark" ? META_THEME_COLORS.light : META_THEME_COLORS.dark),
    [resolvedTheme],
  );

  const setMetaColor = useCallback((color: string) => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", color);
  }, []);

  return { metaColor, setMetaColor };
}
```

If `@wrksz/themes/client` does not export `useTheme`, check the package's documented subpaths (`bunx rg "export" node_modules/@wrksz/themes/dist/*.d.ts | head`) and use the documented entry.

- [ ] **Step 4: Create ModeToggle**

Template reference: `components/navigation/dock/mode-toggle.tsx`. Adaptations: `next-themes`→`@wrksz/themes/client`; remove `analytics` and `playClick` (sound playback is P2); extract `getNextTheme` + `applyThemeTransition` helpers; **defect fix #2**: template calls `switchTheme()` then unconditionally calls `document.startViewTransition(switchTheme)` — double toggle on unsupported browsers, throw on missing API. Fixed version applies exactly once:

```tsx
// src/components/layout/mode-toggle.tsx
"use client";

import { useTheme } from "@wrksz/themes/client";
import { type Variants, motion as m } from "motion/react";
import { useCallback } from "react";

import { META_THEME_COLORS } from "@/config/site";
import { useMetaColor } from "@/lib/hooks/use-meta-color";

export function getNextTheme(resolvedTheme: string | undefined): "light" | "dark" {
  return resolvedTheme === "dark" ? "light" : "dark";
}

export function applyThemeTransition(switchTheme: () => void): void {
  if (document.startViewTransition) {
    document.startViewTransition(switchTheme);
  } else {
    switchTheme();
  }
}

const raysVariants = {
  hidden: {
    strokeOpacity: 0,
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
  visible: {
    strokeOpacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const rayVariant: Variants = {
  hidden: { pathLength: 0, opacity: 0, scale: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      pathLength: { duration: 0.3 },
      opacity: { duration: 0.2 },
      scale: { duration: 0.3 },
    },
  },
};

const shineVariant: Variants = {
  hidden: {
    opacity: 0,
    scale: 2,
    strokeDasharray: "20, 1000",
    strokeDashoffset: 0,
    filter: "blur(0px)",
  },
  visible: {
    opacity: [0, 1, 0],
    strokeDashoffset: [0, -50, -100],
    filter: ["blur(2px)", "blur(2px)", "blur(0px)"],
    transition: { duration: 0.75, ease: "linear" },
  },
};

const sunPath =
  "M70 49.5C70 60.8218 60.8218 70 49.5 70C38.1782 70 29 60.8218 29 49.5C29 38.1782 38.1782 29 49.5 29C60 29 69.5 38 70 49.5Z";
const moonPath =
  "M70 49.5C70 60.8218 60.8218 70 49.5 70C38.1782 70 29 60.8218 29 49.5C29 38.1782 38.1782 29 49.5 29C39 45 49.5 59.5 70 49.5Z";

export default function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "dark" : "light";
  const { setMetaColor } = useMetaColor();

  const switchTheme = useCallback(() => {
    const newTheme = getNextTheme(resolvedTheme);
    setTheme(newTheme);
    setMetaColor(resolvedTheme === "dark" ? META_THEME_COLORS.light : META_THEME_COLORS.dark);
  }, [resolvedTheme, setTheme, setMetaColor]);

  return (
    <div
      className="flex h-full w-full items-center justify-center"
      onClick={() => applyThemeTransition(switchTheme)}
    >
      <m.svg
        strokeWidth="4"
        strokeLinecap="round"
        width={20}
        height={20}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative"
      >
        <m.path
          variants={shineVariant}
          d={moonPath}
          className="absolute top-0 left-0 stroke-blue-100"
          initial="hidden"
          animate={theme === "dark" ? "visible" : "hidden"}
        />
        <m.g
          variants={raysVariants}
          initial="hidden"
          animate={theme === "dark" ? "hidden" : "visible"}
          className="stroke-6 stroke-yellow-600"
          style={{ strokeLinecap: "round" }}
        >
          <m.path className="origin-center" variants={rayVariant} d="M50 2V11" />
          <m.path variants={rayVariant} d="M85 15L78 22" />
          <m.path variants={rayVariant} d="M98 50H89" />
          <m.path variants={rayVariant} d="M85 85L78 78" />
          <m.path variants={rayVariant} d="M50 98V89" />
          <m.path variants={rayVariant} d="M23 78L16 84" />
          <m.path variants={rayVariant} d="M11 50H2" />
          <m.path variants={rayVariant} d="M23 23L16 16" />
        </m.g>
        <m.path
          d={sunPath}
          fill="transparent"
          transition={{ duration: 1, type: "spring" }}
          initial={{ fillOpacity: 0, strokeOpacity: 0 }}
          animate={
            theme === "dark"
              ? {
                  d: moonPath,
                  rotate: -360,
                  scale: 2,
                  stroke: "white",
                  fill: "white",
                  fillOpacity: 0.35,
                  strokeOpacity: 1,
                  transition: { delay: 0.1 },
                }
              : {
                  d: sunPath,
                  rotate: 0,
                  stroke: "orange",
                  fill: "orange",
                  fillOpacity: 0.35,
                  strokeOpacity: 1,
                }
          }
        />
      </m.svg>
    </div>
  );
}
```

- [ ] **Step 5: Run test + checks**

Run: `bunx vitest run tests/unit/theme-toggle.test.ts && bun run format && bun run typecheck && bun run lint`
Expected: PASS (4 tests); checks exit 0.

---

### Task 7: Dock primitive + BottomDock

**Files:**

- Create: `src/components/layout/floating-dock.tsx`
- Create: `src/components/layout/dock.tsx`
- Modify: `src/components/layout/navigation.tsx`

**Interfaces:**

- Consumes: `siteConfig` + `Icons` (Task 1), `SoundToggle` (Task 5), `ModeToggle` (Task 6), `cn`.
- Produces:
  - `Dock`, `DockIcon`, `DockIconActiveDot`, `dockVariants` (motion magnification primitive)
  - `BottomDock({ className: string })` default export — auto-hide with working timer (defect fix #1), active-route dot, socials section only when `siteConfig.socials.length > 0`
  - `Navigation` renders `<BottomDock className="hidden lg:block" />`

- [ ] **Step 1: Port the dock primitive**

Template reference: `components/shared/compoenents/floating-dock.tsx`. Adaptations: remove `useHoverSound` (P2 re-adds the call inside `DockIcon` `onMouseEnter` — marked below); keep `@ts-ignore`-free typing by giving `DockIconProps.mouseX?: MotionValue<number>`; everything else verbatim.

```tsx
// src/components/layout/floating-dock.tsx
"use client";

import { type VariantProps, cva } from "class-variance-authority";
import {
  AnimatePresence,
  type HTMLMotionProps,
  type MotionValue,
  motion,
  useAnimation,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import React, { useRef, useState } from "react";

import { cn } from "@/lib/utils";

export interface DockProps extends VariantProps<typeof dockVariants> {
  className?: string;
  direction?: "top" | "middle" | "bottom";
  children: React.ReactNode;
}

const dockVariants = cva(
  "-bottom-2 -translate-x-1/2 -translate-y-1/2 fixed left-1/2 z-10 flex h-[58px] w-auto transform items-end rounded-full border border-gray-200 bg-white px-2 shadow-[0_30px_60px_rgba(0,0,0,0.12)] dark:border-gray-800 dark:bg-neutral-900",
);

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  ({ className, children, ...props }, ref) => {
    const mouseX = useMotionValue(Number.POSITIVE_INFINITY);

    const renderChildren = () => {
      return React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === DockIcon) {
          return React.cloneElement(child as React.ReactElement<DockIconProps>, {
            mouseX,
          });
        }
        return child;
      });
    };

    return (
      <motion.footer
        ref={ref}
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
        {...(props as HTMLMotionProps<"footer">)}
        className={cn(dockVariants({ className }))}
      >
        <div className="-top-px -z-1 absolute h-px w-[95%] bg-linear-to-r from-transparent via-neutral-200 to-transparent opacity-20 dark:via-neutral-700 dark:to-transparent" />
        <div className="flex w-full items-end gap-2 py-2 sm:h-[72px] sm:overflow-x-auto sm:overflow-y-hidden md:h-auto md:overflow-visible">
          {renderChildren()}
        </div>
      </motion.footer>
    );
  },
);

Dock.displayName = "Dock";

export interface DockIconProps extends HTMLMotionProps<"div"> {
  size?: number;
  title?: string;
  mouseX?: MotionValue<number>;
  className?: string;
  children?: React.ReactNode;
}

const DockIcon = ({ mouseX, title, className, children, ...props }: DockIconProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  const distance = useTransform(mouseX ?? useMotionValue(0), (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

  const width = useSpring(widthTransform, { mass: 0.1, stiffness: 150, damping: 12 });
  const height = useSpring(heightTransform, { mass: 0.1, stiffness: 150, damping: 12 });

  const [hovered, setHovered] = useState(false);

  const handleMouseDown = async () => {
    await controls.start({ y: 10, transition: { duration: 0.1 } });
  };

  const handleMouseUp = async () => {
    await controls.start({ y: -10, transition: { duration: 0.1 } });
    controls.start({ y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial={{ y: 0 }}
      style={{ width, height }}
      onMouseEnter={() => {
        setHovered(true);
        // P2: call hover-sound hook here when the sound system lands
      }}
      onMouseLeave={() => {
        setHovered(false);
        controls.start({ y: 0, transition: { duration: 0.2 } });
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={cn(
        "relative flex cursor-pointer items-center justify-center rounded-full bg-gray-200 dark:bg-neutral-800",
        className,
      )}
      {...props}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 2 }}
            className="-translate-x-1/2 -top-8 absolute left-1/2 w-fit whitespace-pre rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-neutral-700 text-xs dark:border-neutral-900 dark:bg-neutral-800 dark:text-white"
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type !== DockIconActiveDot) {
            return React.cloneElement(child as React.ReactElement<{ className?: string }>, {
              className: cn(
                "flex h-full w-full items-center justify-center",
                (child.props as { className?: string }).className,
              ),
            });
          }
          return child;
        })}
      </motion.div>
    </motion.div>
  );
};

DockIcon.displayName = "DockIcon";

interface DockIconActiveDotProps {
  isActive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const DockIconActiveDot: React.FC<DockIconActiveDotProps> = ({
  isActive = false,
  className,
  style,
}) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      className={cn("-bottom-[6px] absolute h-1 w-1 rounded-full bg-neutral-400", className)}
      style={style}
    />
  );
};

DockIconActiveDot.displayName = "DockIconActiveDot";

export { Dock, DockIcon, DockIconActiveDot, dockVariants };
```

- [ ] **Step 2: Port BottomDock with defect fix #1**

Template reference: `components/navigation/dock/index.tsx`. Adaptations: buddy/session/analytics removed; `DockConfig`→`siteConfig`; **defect fix #1** — template's `startTimeout` wraps `setTimeout` inside `if (timeoutRef.current)`, which is `null` on first call so the timer never arms. Fixed version always assigns:

```tsx
// src/components/layout/dock.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Icons } from "@/components/icons";
import { Dock, DockIcon, DockIconActiveDot } from "@/components/layout/floating-dock";
import ModeToggle from "@/components/layout/mode-toggle";
import { SoundToggle } from "@/components/layout/sound-toggle";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const DOCK_AUTOHIDE_TIMEOUT = 5_000;

function BottomDock({ className }: { className: string }) {
  const [active, setActive] = useState(true);
  const pathname = usePathname();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isItemActive = (itemHref: string) => {
    if (itemHref === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(itemHref);
  };

  const startTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setActive(false);
    }, DOCK_AUTOHIDE_TIMEOUT);
  };

  useEffect(() => {
    startTimeout();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      onMouseEnter={() => {
        setActive(true);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }}
      onMouseLeave={() => {
        startTimeout();
      }}
      className={cn(
        "-translate-x-1/2 fixed bottom-0 left-1/2 z-40 h-[clamp(80px,10vh,200px)] w-full",
        className,
      )}
    >
      <div className="mask-[linear-gradient(to_top,#000_25%,transparent)] absolute top-0 left-0 h-full w-full backdrop-blur-sm [-webkit-mask-image:linear-gradient(to_top,#000_25%,transparent)]" />
      <Dock
        className={cn("transition-all duration-300", {
          "-bottom-18": !active,
        })}
      >
        {siteConfig.navbar.map((item) => {
          const ItemIcon = Icons[item.icon];
          return (
            <DockIcon key={item.label} title={item.label}>
              <Link href={item.href}>
                <ItemIcon className="size-4" />
              </Link>
              {isItemActive(item.href) && <DockIconActiveDot isActive={isItemActive(item.href)} />}
            </DockIcon>
          );
        })}
        {siteConfig.socials.length > 0 && (
          <>
            <DockSeparator />
            {siteConfig.socials.map((social) => {
              const SocialIcon = Icons[social.icon];
              return (
                <DockIcon key={social.name} title={social.name}>
                  <Link href={social.url} target="_blank">
                    <SocialIcon className="size-4" />
                  </Link>
                </DockIcon>
              );
            })}
          </>
        )}
        <DockSeparator />
        <DockIcon title="Sound">
          <SoundToggle />
        </DockIcon>
        <DockIcon title="Theme">
          <ModeToggle />
        </DockIcon>
      </Dock>
    </div>
  );
}

function DockSeparator() {
  return <hr className="mask-gradient h-[36px] w-px shrink-0 border-0 bg-gray-400/50" />;
}

export default BottomDock;
```

Note: template renders the first separator unconditionally between navbar and socials; with empty socials we render exactly one separator before Sound/Theme (same visual result as template with its social block present minus the social icons — accepted per spec §2 "controlled placeholders"; when socials are added both separators appear, matching template).

- [ ] **Step 3: Mount in Navigation**

```tsx
// src/components/layout/navigation.tsx
import BottomDock from "./dock";

export default function Navigation() {
  return (
    <>
      <BottomDock className="hidden lg:block" />
    </>
  );
}
```

- [ ] **Step 4: Verify render + checks**

Run: `bun run dev` — dock appears bottom-center on desktop viewport (≥1024px), magnification on hover, hides after 5s idle, reappears on mouse enter.
Then: `bun run format && bun run typecheck && bun run lint`
Expected: exit 0.

---

### Task 8: Drawer UI wrapper + MobileDrawer + FloatingHeader + ScrollTop

**Files:**

- Create: `src/components/ui/drawer.tsx`
- Create: `src/components/layout/mobile-drawer.tsx`
- Create: `src/components/layout/floating-header.tsx`
- Create: `src/components/layout/scroll-top.tsx`
- Modify: `src/components/layout/navigation.tsx`

**Interfaces:**

- Consumes: `siteConfig`, `Icons`, `SCROLL_AREA_ID`, `MOBILE_SCROLL_THRESHOLD` (Task 1); `useMounted` (Task 4); `Button` (existing `src/components/ui/button.tsx`); `vaul-base`.
- Produces:
  - `Drawer, DrawerTrigger, DrawerContent, DrawerTitle, DrawerDescription, DrawerClose, DrawerHeader, DrawerFooter, DrawerOverlay, DrawerPortal` from `src/components/ui/drawer.tsx`
  - `MobileDrawer()`, `NavigationLink({ href, label, icon, onClose })`
  - `FloatingHeader({ className?, scrollTitle?, title?, children? })`
  - `ScrollTop` mounted in `Navigation`

- [ ] **Step 1: Create drawer wrapper on vaul-base**

Template reference: `packages/design-system/components/ui/drawer.tsx` — identical classes, `vaul`→`vaul-base`, drop `React.forwardRef` (React 19: `ref` is a prop).

```tsx
// src/components/ui/drawer.tsx
"use client";

import { Drawer as DrawerPrimitive } from "vaul-base";

import { cn } from "@/lib/utils";

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
);
Drawer.displayName = "Drawer";

const DrawerTrigger = DrawerPrimitive.Trigger;
const DrawerPortal = DrawerPrimitive.Portal;
const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = ({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) => (
  <DrawerPrimitive.Overlay className={cn("fixed inset-0 z-50 bg-black/80", className)} {...props} />
);
DrawerOverlay.displayName = "DrawerOverlay";

const DrawerContent = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
        className,
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
);
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)} {...props} />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) => (
  <DrawerPrimitive.Title
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
);
DrawerTitle.displayName = "DrawerTitle";

const DrawerDescription = ({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) => (
  <DrawerPrimitive.Description
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
);
DrawerDescription.displayName = "DrawerDescription";

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
```

- [ ] **Step 2: Port MobileDrawer**

Template reference: `components/navigation/mobile-drawer.tsx`. Adaptations: `USER`→`siteConfig`; no profile image (owner has none — render name+tagline only, keep layout); Base UI Button uses `render` prop instead of `asChild` (`DrawerTrigger render={<Button .../>}`? vaul Trigger accepts `asChild`? vaul-base mirrors vaul, whose Trigger supports `asChild` via Radix Slot — with Base UI Dialog underneath, vaul-base's Trigger supports the `render` prop instead. If `asChild` errors at typecheck, use `render={...}`); `VisuallyHidden` → plain `sr-only` spans are not valid here — keep semantic Title/Description wrapped in a `<span className="sr-only">`… simplest faithful approach: keep `DrawerTitle`/`DrawerDescription` but visually hidden via class.

```tsx
// src/components/layout/mobile-drawer.tsx
"use client";

import { ArrowUpRightIcon, AtSignIcon, CommandIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useState } from "react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { siteConfig } from "@/config/site";
import { useMounted } from "@/lib/hooks/use-mounted";
import { cn } from "@/lib/utils";

export function MobileDrawer() {
  const [open, setOpen] = useState(false);
  const mounted = useMounted();

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" title="Toggle drawer">
        <CommandIcon size={16} />
      </Button>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        render={
          <Button variant="ghost" size="icon" title="Toggle drawer">
            <CommandIcon size={16} />
          </Button>
        }
      />
      <DrawerContent className="h-4/5">
        <DrawerTitle className="sr-only">Navigation Menu</DrawerTitle>
        <DrawerDescription className="sr-only">
          Navigate through the website sections and social links
        </DrawerDescription>
        <div className="overflow-y-auto p-4">
          <div className="flex w-full flex-col space-y-4 text-sm">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="link-card inline-flex items-center gap-2 p-2"
                onClick={() => setOpen(false)}
              >
                <div className="flex flex-col">
                  <span className="font-semibold tracking-tight">{siteConfig.name}</span>
                  <span className="text-neutral-600 dark:text-neutral-400">
                    {siteConfig.tagline}
                  </span>
                </div>
              </Link>
              <div className="flex flex-col gap-1">
                {siteConfig.navbar.map((link) => {
                  const LinkIcon = Icons[link.icon];
                  return (
                    <NavigationLink
                      key={link.href}
                      href={link.href}
                      label={link.label}
                      icon={<LinkIcon className="h-4 w-4" />}
                      onClose={() => setOpen(false)}
                    />
                  );
                })}
              </div>
            </div>
            {siteConfig.socials.length > 0 && (
              <>
                <hr className="border-neutral-200 dark:border-neutral-800" />
                <div className="flex flex-col gap-2 text-sm">
                  <span className="px-2 font-medium text-neutral-600 text-xs leading-relaxed dark:text-neutral-400">
                    Social
                  </span>
                  <div className="flex flex-col gap-1">
                    {siteConfig.socials.map((profile) => {
                      const ProfileIcon = Icons[profile.icon];
                      return (
                        <NavigationLink
                          key={profile.url}
                          href={profile.url}
                          label={profile.name}
                          icon={<ProfileIcon className="h-4 w-4" />}
                          onClose={() => setOpen(false)}
                        />
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export const NavigationLink = memo(
  ({
    href,
    label,
    icon,
    onClose,
  }: {
    href: string;
    label: string;
    icon?: React.ReactNode;
    onClose: () => void;
  }) => {
    const pathname = usePathname();
    const iconCmp = icon ?? <AtSignIcon size={16} />;

    const isInternal = href.startsWith("/");
    if (!isInternal) {
      return (
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-2 rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-800"
          onClick={onClose}
        >
          <span className="inline-flex items-center gap-2 font-medium">
            {iconCmp}
            {label}
          </span>
          <ArrowUpRightIcon size={16} />
        </Link>
      );
    }

    let isActive = false;
    if (pathname?.length > 0) {
      const splittedPathname = pathname.split("/");
      const currentPathname = splittedPathname[1] ?? "";
      isActive = currentPathname === href.split("/")[1];
    }

    return (
      <Link
        href={href}
        className={cn(
          "group flex items-center justify-between rounded-lg p-2",
          isActive
            ? "bg-black text-white dark:bg-neutral-800"
            : "hover:bg-neutral-200 dark:hover:bg-neutral-800",
        )}
        onClick={onClose}
      >
        <span className="flex items-center gap-2">
          {iconCmp}
          <span className={cn("font-medium", isActive && "text-white dark:text-neutral-400")}>
            {label}
          </span>
        </span>
      </Link>
    );
  },
);
```

- [ ] **Step 3: Port FloatingHeader**

Template reference: `components/navigation/floating-header.tsx`. Adaptations: type props (no `any`); `Button asChild`→`render`; `react-wrap-balancer` NOT installed — template only uses Balancer for the optional `title` prop; render `title` as a plain span (identical styling classes) and note that P2+ adds Balancer only if a page needs `title`. `MobileDrawer` imported directly (no `next/dynamic` needed — it self-guards via `useMounted`).

```tsx
// src/components/layout/floating-header.tsx
"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useEffect, useState } from "react";

import { MobileDrawer } from "@/components/layout/mobile-drawer";
import { Button } from "@/components/ui/button";
import { MOBILE_SCROLL_THRESHOLD, SCROLL_AREA_ID } from "@/config/site";

export const FloatingHeader = memo(
  ({
    className,
    scrollTitle,
    title,
    children,
  }: {
    className?: string;
    scrollTitle?: string;
    title?: string;
    children?: React.ReactNode;
  }) => {
    const [transformValues, setTransformValues] = useState({
      translateY: 0,
      opacity: scrollTitle ? 0 : 1,
    });
    const pathname = usePathname();

    const goBack = pathname.split("/").length > 2;
    const goBackLink = pathname.split("/").slice(0, -1).join("/") || "/";

    useEffect(() => {
      const scrollAreaElem = document.querySelector(`#${SCROLL_AREA_ID}`);

      const onScroll = (e: Event) => {
        const scrollY = (e.target as HTMLElement).scrollTop;

        const translateY = Math.max(100 - scrollY, 0);
        const opacity = Math.min(
          Math.max(
            (scrollY - MOBILE_SCROLL_THRESHOLD * (MOBILE_SCROLL_THRESHOLD / (scrollY ** 2 / 100))) /
              100,
            0,
          ),
          1,
        );

        setTransformValues({ translateY, opacity });
      };

      if (scrollTitle) {
        scrollAreaElem?.addEventListener("scroll", onScroll, { passive: true });
      }
      return () => scrollAreaElem?.removeEventListener("scroll", onScroll);
    }, [scrollTitle]);

    return (
      <header className="sticky inset-x-0 top-0 z-40 mx-auto flex h-12 w-full shrink-0 items-center overflow-hidden border-b bg-background font-medium text-sm lg:hidden">
        <div className="flex size-full items-center px-3">
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex flex-1 items-center gap-1">
              {goBack ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  render={
                    <Link href={goBackLink} title="Go back">
                      <ArrowLeftIcon size={16} />
                    </Link>
                  }
                />
              ) : (
                <MobileDrawer />
              )}
              <div className="flex flex-1 items-center justify-between">
                {scrollTitle && (
                  <span
                    className="line-clamp-2 font-semibold tracking-tight"
                    style={{
                      transform: `translateY(${transformValues.translateY}%)`,
                      opacity: transformValues.opacity,
                    }}
                  >
                    {scrollTitle}
                  </span>
                )}
                {title && (
                  <span className="line-clamp-2 font-semibold tracking-tight">{title}</span>
                )}
                {children}
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  },
);

FloatingHeader.displayName = "FloatingHeader";
```

- [ ] **Step 4: Port ScrollTop + mount in Navigation**

Template reference: `components/scroll-top.tsx` — verbatim except import paths (`@/components/ui/button`, `@/config/site`, `@/lib/utils`).

```tsx
// src/components/layout/scroll-top.tsx
"use client";

import { ArrowUpIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { SCROLL_AREA_ID } from "@/config/site";
import { cn } from "@/lib/utils";

export function ScrollTop({ className, ...props }: React.ComponentProps<"button">) {
  const [visible, setVisible] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");

  useEffect(() => {
    let lastScrollTop = 0;

    const handleScroll = () => {
      const scrollAreaElem = document.querySelector(`#${SCROLL_AREA_ID}`);
      const scrollTop =
        scrollAreaElem instanceof HTMLElement ? scrollAreaElem.scrollTop : window.scrollY;

      setVisible(scrollTop >= 400);
      const diff = scrollTop - lastScrollTop;
      setScrollDirection(diff > 0 ? "down" : "up");
      lastScrollTop = scrollTop;
    };

    const scrollAreaElem = document.querySelector(`#${SCROLL_AREA_ID}`);
    if (scrollAreaElem) {
      scrollAreaElem.addEventListener("scroll", handleScroll, { passive: true });
    } else {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      if (scrollAreaElem) {
        scrollAreaElem.removeEventListener("scroll", handleScroll);
      } else {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <Button
      data-visible={visible}
      data-scroll-direction={scrollDirection}
      className={cn(
        "z-100 [--bottom:1rem] lg:[--bottom:2rem]",
        "fixed right-4 bottom-[calc(var(--bottom,1rem)+env(safe-area-inset-bottom,0px))] rounded-full transition-all duration-300 lg:right-8",
        "duration-300 data-[scroll-direction=down]:opacity-80 data-[scroll-direction=up]:opacity-100 data-[visible=false]:opacity-0",
        className,
      )}
      variant="secondary"
      size="icon"
      onClick={() => {
        const scrollAreaElem = document.querySelector(`#${SCROLL_AREA_ID}`);
        if (scrollAreaElem instanceof HTMLElement) {
          scrollAreaElem.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
      {...props}
    >
      <ArrowUpIcon className="size-5" />
      <span className="sr-only">Scroll to top</span>
    </Button>
  );
}
```

```tsx
// src/components/layout/navigation.tsx
import BottomDock from "./dock";
import { ScrollTop } from "./scroll-top";

export default function Navigation() {
  return (
    <>
      <BottomDock className="hidden lg:block" />
      <ScrollTop />
    </>
  );
}
```

- [ ] **Step 5: Checks**

Run: `bun run format && bun run typecheck && bun run lint && bun run build`
Expected: exit 0; build succeeds (vaul-base compiles under Next 16).

---

### Task 9: Section/Separator chrome + Button restyle

**Files:**

- Create: `src/components/layout/section.tsx`
- Create: `src/components/layout/separator.tsx`
- Modify: `src/components/ui/button.tsx`
- Modify: `src/app/page.tsx` (stub home exercising full chrome)

**Interfaces:**

- Consumes: globals utilities (Task 2), `ScrollArea`/`FloatingHeader` (Task 4/8), `siteConfig` (Task 1).
- Produces:
  - `Section({ sectionClassName?, className?, children })` — corner marks + side lines chrome
  - `Separator({ className? })` — dashed band
  - `buttonVariants` matching template spec (pill `rounded-full`, zinc gradient default, `active:scale-[0.98]`, sizes `default/sm/lg/icon`)
  - Stub home: `<ScrollArea useScrollAreaId><FloatingHeader scrollTitle={siteConfig.name}/>` + `Section` + `Separator` + tall filler content (scroll testing)

- [ ] **Step 1: Port Section + Separator**

Template references: `components/section.tsx`, `components/separator.tsx` — verbatim except import paths; React 19 (`ref` as prop, drop `forwardRef`).

```tsx
// src/components/layout/section.tsx
import { cn } from "@/lib/utils";

type SectionProps = {
  sectionClassName?: string;
  ref?: React.Ref<HTMLElement>;
} & React.HTMLAttributes<HTMLElement>;

const CornerMark = ({
  position,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) => {
  const isTop = position.includes("top");
  const isLeft = position.includes("left");

  return (
    <div
      className={cn(
        "absolute hidden h-1.5 w-1.5 bg-transparent sm:block",
        isTop ? "top-0" : "bottom-0",
        isLeft ? "left-0" : "right-0",
        isTop && isLeft && "border-l border-t border-foreground/30",
        isTop && !isLeft && "border-r border-t border-foreground/30",
        !isTop && isLeft && "border-l border-b border-foreground/30",
        !isTop && !isLeft && "border-r border-b border-foreground/30",
      )}
    />
  );
};

export const Section = ({ children, sectionClassName, className, ref, ...props }: SectionProps) => (
  <section ref={ref} className={sectionClassName} {...props}>
    <div className="relative mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
      <div className={cn("relative py-3 sm:px-3 md:py-4", className)}>
        <CornerMark position="top-left" />
        <CornerMark position="top-right" />
        <CornerMark position="bottom-left" />
        <CornerMark position="bottom-right" />
        <div className="absolute left-0 top-1.5 bottom-1.5 hidden w-px bg-foreground/10 sm:block" />
        <div className="absolute right-0 top-1.5 bottom-1.5 hidden w-px bg-foreground/10 sm:block" />
        {children}
      </div>
    </div>
  </section>
);

Section.displayName = "Section";
```

```tsx
// src/components/layout/separator.tsx
import { cn } from "@/lib/utils";

const Separator = ({ className }: { className?: string }) => (
  <div className="relative mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
    <div className={cn("h-8 bg-dashed ring-[0.65px] ring-foreground/10", className)} />
  </div>
);

export default Separator;
```

- [ ] **Step 2: Restyle Button to template spec**

Template reference: `packages/design-system/components/ui/button.tsx` variants. Keep our Base UI `ButtonPrimitive` (no Slot); port the template's cva variants verbatim (pill shape, gradient default, dark inset-shadow, sizes). Drop base-nova-only sizes (`xs`, `icon-xs`…) that the template doesn't have — template sizes are `default/sm/lg/icon` plus `icon:sm`/`icon:lg` (rename to `icon-sm`/`icon-lg` since `:` is awkward in cva keys used from TSX).

```tsx
// src/components/ui/button.tsx
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-linear-to-b from-zinc-700 to-zinc-800 text-white! text-shadow-xs hover:to-zinc-700 dark:from-zinc-600 dark:to-zinc-700 dark:inset-shadow-[1px_1px_1px,0px_0px_2px] dark:inset-shadow-white/20 dark:hover:to-zinc-600",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:inset-shadow-[1px_1px_1px,0px_0px_2px] dark:inset-shadow-white/15",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-foreground underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 px-4",
        sm: "h-7 gap-1.5 px-3 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 px-6",
        icon: "size-8",
        "icon-sm": "size-7",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
```

- [ ] **Step 3: Stub home page exercising chrome**

```tsx
// src/app/page.tsx
import { FloatingHeader } from "@/components/layout/floating-header";
import { ScrollArea } from "@/components/layout/scroll-area";
import { Section } from "@/components/layout/section";
import Separator from "@/components/layout/separator";
import { siteConfig } from "@/config/site";

export default function Home() {
  return (
    <ScrollArea useScrollAreaId>
      <FloatingHeader scrollTitle={siteConfig.name} />
      <div className="content-wrapper">
        <div className="content">
          <Section>
            <h1 className="font-semibold text-2xl tracking-tight">{siteConfig.name}</h1>
            <p className="text-muted-foreground">{siteConfig.tagline}</p>
          </Section>
          <Separator />
          <Section>
            {Array.from({ length: 12 }, (_, i) => (
              <p key={i} className="py-4 text-muted-foreground text-sm">
                Placeholder content block {i + 1} — replaced by the real home page in P2.
              </p>
            ))}
          </Section>
        </div>
      </div>
    </ScrollArea>
  );
}
```

- [ ] **Step 4: Manual smoke + checks**

Run: `bun run dev` — verify: corner marks render (≥640px), dashed separator band, mobile header appears <1024px with drawer, scroll inside scrollport (not window).
Then: `bun run format && bun run typecheck && bun run lint`
Expected: exit 0.

---

### Task 10: Playwright visual-diff harness + final validation

**Files:**

- Create: `tests/e2e/foundation.visual.spec.ts`
- Modify: `playwright.config.ts` (screenshot dir/settings if needed)

**Interfaces:**

- Consumes: everything (full chrome on `/`).
- Produces: repeatable fidelity gate — `bun run test:e2e` compares clone vs template.

- [ ] **Step 1: Write the visual spec**

Approach: same Playwright `page` visits template (:6969) then clone (:3000); screenshots compared against shared snapshots via `toMatchSnapshot` with `maxDiffPixelRatio: 0.02` tolerance (2% — absorbs font rasterization deltas across machines; tighten later if too loose). Suite self-skips when the template server is unreachable (template must be started manually: `bun run dev` in `portfolio-template-ui-ux/portfolio-main/apps/website`).

```ts
// tests/e2e/foundation.visual.spec.ts
import { expect, test } from "@playwright/test";

const TEMPLATE_URL = "http://localhost:6969";
const CLONE_URL = "http://localhost:3000";
const DIFF = { maxDiffPixelRatio: 0.02 } as const;

async function templateReachable(page: import("@playwright/test").Page): Promise<boolean> {
  try {
    const res = await page.request.get(TEMPLATE_URL, { timeout: 3_000 });
    return res.ok();
  } catch {
    return false;
  }
}

test.beforeEach(async ({ page }) => {
  test.skip(
    !(await templateReachable(page)),
    "Template dev server not running at :6969 — start it for fidelity comparison",
  );
});

async function shotBoth(
  page: import("@playwright/test").Page,
  name: string,
  theme: "light" | "dark",
  viewport: { width: number; height: number },
) {
  await page.setViewportSize(viewport);

  await page.goto(TEMPLATE_URL, { waitUntil: "networkidle" });
  await page.evaluate((t) => {
    document.documentElement.classList.toggle("dark", t === "dark");
  }, theme);
  await page.waitForTimeout(500);
  const templateShot = await page.screenshot({ fullPage: false });
  expect(templateShot).toMatchSnapshot(`${name}-${theme}.png`, DIFF);

  await page.goto(CLONE_URL, { waitUntil: "networkidle" });
  await page.evaluate((t) => {
    document.documentElement.classList.toggle("dark", t === "dark");
  }, theme);
  await page.waitForTimeout(500);
  const cloneShot = await page.screenshot({ fullPage: false });
  expect(cloneShot).toMatchSnapshot(`${name}-${theme}.png`, DIFF);
}

test.describe("foundation fidelity", () => {
  test("desktop chrome — light", async ({ page }) => {
    await shotBoth(page, "desktop", "light", { width: 1280, height: 800 });
  });

  test("desktop chrome — dark", async ({ page }) => {
    await shotBoth(page, "desktop", "dark", { width: 1280, height: 800 });
  });

  test("mobile chrome — light", async ({ page }) => {
    await shotBoth(page, "mobile", "light", { width: 390, height: 844 });
  });

  test("computed tokens match template", async ({ page }) => {
    const probe = () => {
      const body = getComputedStyle(document.body);
      const html = getComputedStyle(document.documentElement);
      return {
        background: body.backgroundColor,
        color: body.color,
        fontFamily: body.fontFamily,
        borderColor: html.getPropertyValue("--border"),
      };
    };

    await page.goto(TEMPLATE_URL, { waitUntil: "networkidle" });
    const templateTokens = await page.evaluate(probe);

    await page.goto(CLONE_URL, { waitUntil: "networkidle" });
    const cloneTokens = await page.evaluate(probe);

    expect(cloneTokens.background).toBe(templateTokens.background);
    expect(cloneTokens.color).toBe(templateTokens.color);
    expect(cloneTokens.fontFamily).toBe(templateTokens.fontFamily);
    expect(cloneTokens.borderColor).toBe(templateTokens.borderColor);
  });
});
```

Note: the first run stores template screenshots as baselines (`--update-snapshots`); the clone assertions then diff against the same baselines. Run sequence:

1. `bunx playwright test tests/e2e/foundation.visual.spec.ts --update-snapshots` (template baselines)
2. `bunx playwright test tests/e2e/foundation.visual.spec.ts` (diff clone vs baseline)

- [ ] **Step 2: Run baseline capture**

Precondition: template dev server running at :6969, clone dev server running at :3000 (or rely on Playwright `webServer` for the clone — existing config already starts it).
Run: `bunx playwright test tests/e2e/foundation.visual.spec.ts --update-snapshots`
Expected: 4 tests pass, snapshots written under `tests/e2e/foundation.visual.spec.ts-snapshots/`.

- [ ] **Step 3: Run the diff + investigate deltas**

Run: `bunx playwright test tests/e2e/foundation.visual.spec.ts`
Expected: PASS. If a diff fails: open the diff images Playwright writes, identify the delta (token, spacing, font), fix the port, re-run. Do not raise tolerance to hide real deltas.

- [ ] **Step 4: Manual @Browser side-by-side pass**

With both servers running, use the IDE browser to compare `http://localhost:6969` and `http://localhost:3000` interactively: dock magnification + auto-hide (5s idle), theme toggle transition, mobile drawer drag/close, scroll-top appears ≥400px scroll, floating-header title reveal on scroll. Record any delta and fix.

- [ ] **Step 5: Final gate**

Run: `bun run validate`
Expected: typecheck + lint + format:check + test:run + build all green.

---

## Self-Review Notes (author)

- **Spec coverage:** tokens/fonts (T2), theme system (T3, T6), scrollport (T4), dock (T7), header/drawer/scroll-top (T8), toggles (T5, T6), section chrome (T9), site.ts (T1), fidelity harness (T10), defect fixes (T2 dedupe, T6 fallback, T7 timer), stub page (T9). Spec §2 out-of-scope respected (no sound playback, no MDX, no Supabase).
- **No placeholders:** every code step carries full code; the only runtime verifications deferred to executors are compiler/API checks with explicit fallback instructions (T3 ThemeProvider props, T6 useTheme entry, T8 DrawerTrigger render prop).
- **Type consistency:** `SiteConfig`/`NavIconKey`/`SocialIconKey` (T1) consumed identically in T7/T8; `Icons` keys match `z.enum` keys; `useScrollDirection` shape matches its test; `getNextTheme`/`applyThemeTransition` exported from mode-toggle as the test imports.
- **Known executor risks:** (1) `@wrksz/themes` prop/entry names — compiler-verified fallbacks given; (2) vaul-base Trigger composition API — fallback given; (3) Playwright baseline workflow requires two manual server starts — documented.
