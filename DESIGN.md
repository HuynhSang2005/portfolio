---
name: HuynhSang Portfolio (Ruixen template clone)
description: A zinc-monochrome engineering portfolio — lab-notebook chrome, tactile dock, playful craft prototypes.
colors:
  paper-white: "oklch(1 0 0)"
  ink-black: "oklch(0.141 0.005 285.823)"
  snow-drift: "oklch(0.985 0 0)"
  graphite-whisper: "oklch(0.967 0.001 286.375)"
  ash-gray: "oklch(0.552 0.016 285.938)"
  fog-gray: "oklch(0.705 0.015 286.067)"
  hairline: "oklch(0.92 0.004 286.32)"
  slate-card: "oklch(0.21 0.006 285.885)"
  graphite-border: "oklch(0.274 0.006 286.033)"
  zinc-steel: "oklch(0.37 0.013 285.805)"
  link-blue: "oklch(0.488 0.243 264.376)"
  link-blue-dark: "oklch(0.623 0.214 259.815)"
  signal-green: "oklch(0.723 0.219 149.579)"
  destructive-red: "oklch(0.577 0.245 27.325)"
  info-blue: "oklch(0.67 0.17 244.98)"
typography:
  display:
    fontFamily: "X, 'X Fallback', sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: "normal"
  headline:
    fontFamily: "X, 'X Fallback', sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "-0.015em"
  title:
    fontFamily: "X, 'X Fallback', sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.5
  body:
    fontFamily: "X, 'X Fallback', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "'rlig' 1, 'calt' 1"
  label:
    fontFamily: "'JetBrains Mono', monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    letterSpacing: "0.05em"
  mono:
    fontFamily: "'JetBrains Mono', monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  card: "0.75rem"
  pill: "9999px"
spacing:
  section-y: "1.5rem"
  separator-band: "2rem"
  page-x: "1.5rem"
  content-max: "48rem"
components:
  button-primary:
    backgroundColor: "{colors.graphite-border}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.zinc-steel}"
    textColor: "{colors.paper-white}"
  button-secondary:
    backgroundColor: "{colors.graphite-whisper}"
    textColor: "{colors.ink-black}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  card:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.ink-black}"
    rounded: "{rounded.card}"
    padding: "16px"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink-black}"
    rounded: "{rounded.pill}"
    padding: "2px 8px"
---

# Design System: HuynhSang Portfolio (Ruixen template clone)

> **Provenance.** This system is extracted 1:1 from the design source of truth at
> `portfolio-template-ui-ux/portfolio-main` (MIT-licensed template; retain its notice, remove all
> original-author identity before publishing — see PRODUCT.md). Values below are the incumbent
> implementation's own tokens, not aspirations. Visual customization is deliberately deferred until
> after the faithful clone lands.

## Overview

**Creative North Star: "The Engineer's Lab Notebook"**

The site reads as a working notebook from a precise engineer: a single neutral ink axis, content
framed by corner registration marks and dashed separator bands, and instrument-style metadata
(clock, coordinates, viewport size) pinned to the corners of the screen in extra-small tracked type.
Nothing is
decorated for decoration's sake — every visual device either structures the page (frames, hairlines,
bands) or reports a measurement (time, counts, dates).

The personality is calm, precise, engineered — but not sterile. A macOS-style dock magnifies under
the cursor with spring physics and soft whoosh sounds; a grid of tiny analog clocks aligns its hands
into digital digits; the footer wordmark is clipped mid-glyph and shines where the mouse moves. Craft
is expressed through tactile interaction physics, not through color or ornament.

Density is moderate and reading-first: a single center column (~48rem), generous whitespace inside
rule-framed sections, prose that stays out of the way. Dark mode is a first-class twin, not an
afterthought — the same lab notebook under night light.

**Key Characteristics:**

- Single zinc ink axis (hue ~286) — chroma is reserved for function (links, success, errors) only
- Lab-notebook chrome: corner registration marks, dashed separator bands, hairline rules
- Instrument-style metadata at the screen corners (X, extra-small, tracked); monospace readouts inside content
- Tactile physics: spring-magnified dock, press bounces, reveal-on-load slides, sound feedback
- Internal scrollport (the page scrolls inside `.scrollable-area`, not the window)
- Signature artifacts: half-cut interactive wordmark footer, Clock of Clocks, Skills Venn

## Colors

The palette is one near-neutral zinc axis from paper white to ink black; the only chroma is
functional (links, success, destructive, info). Light values are canonical below; dark mode remaps
the same roles onto the dark ramp (documented per-token and in the sidecar).

### Primary

- **Ink Black** (zinc-950): the voice of the system — body text, headings, primary buttons, and the
  light-mode `--primary`. In dark mode it inverts to **Snow Drift** (zinc-50) text on Ink Black
  surfaces.

### Neutral

- **Paper White** (pure white): light-mode page background, cards, popovers. Becomes Ink Black in dark mode.
- **Snow Drift** (zinc-50): primary-foreground and dark-mode foreground/code surface.
- **Graphite Whisper** (zinc-100): light-mode secondary/muted/accent fills — the quiet resting state of chips,
  hover washes, code highlights. Becomes **Graphite Border** (zinc-800) in dark mode.
- **Ash Gray** (zinc-500): muted-foreground — metadata, timestamps, secondary text. Becomes Fog Gray (zinc-400) in dark mode.
- **Fog Gray** (zinc-400): focus rings and code line numbers in light mode.
- **Hairline** (zinc-200): borders, inputs, dividers in light mode. `--edge` softens it further via
  `color-mix(in oklab, var(--border) 64%, var(--background))` for the full-bleed screen rules.
- **Slate Card** (zinc-900): dark-mode cards, popovers, and code blocks.
- **Graphite Border** (zinc-800): dark-mode borders, muted fills, and light-mode primary hover.

### Functional chroma (never decorative)

- **Link Blue** (blue-700 light / blue-500 dark): inline links in prose only.
- **Signal Green** (green-500): success states only. The GitHub contribution heatmap is deliberately
  _not_ green here — it is monochrome (muted-foreground at 5/20/40/60/80% opacity).
- **Destructive Red** (red-600 light / red-700 dark): destructive actions and errors.
- **Info Blue**: informational notices.

### Named Rules

**The One Axis Rule.** All UI color lives on the zinc axis. If a screen needs emphasis, change the
ink weight (foreground → muted-foreground → border), never the hue.

**The Chroma Is Functional Rule.** Blue means "you can navigate", green means "it worked", red means
"careful". Chroma used for mood is a defect.

## Typography

**Display/Body Font:** X (custom, local `X-Regular.woff2` + `X-Medium.woff2`, weights 400/500)
**Label/Mono Font:** JetBrains Mono (`next/font/google`)

**Character:** X is a quiet, engineered grotesque — it carries all reading and interface text with
ligature features on (`rlig`, `calt`). JetBrains Mono is the instrument voice: uppercase, tracked-out
labels, timestamps, coordinates, and code. The pairing feels like a well-made device: one face for
the page, one for the readouts.

### Hierarchy

- **Display** (semibold, 1.5rem, normal tracking): the owner's name in the hero. The blog index H1
  shares the 1.5rem size but switches to bold with tight tracking.
- **Headline** (bold, 1.25rem, tight tracking): blog post titles and article H1s.
- **Title** (medium, 1.125rem): panel and card titles.
- **Body** (regular, 1rem, 1.5 line-height): prose; softened to `text-foreground/70` with relaxed
  leading on the home page. Prose maxes at the center column, not a ch measure.
- **Label** (JetBrains Mono, 0.75rem, tracked 0.05em, often uppercase): job titles, metadata rows,
  dates, category chips.

### Named Rules

**The Two Voices Rule.** X speaks to humans, JetBrains Mono is the readout voice _inside_ content
(dates, read-times, job titles, code). The fixed screen-corner overlays are the deliberate exception:
they are set in X at extra-small with wide tracking. Never set prose in mono (dossier-style
`ProseMono` bodies excepted).

## Layout

The page is a single center column inside a full-viewport internal scrollport
(`.scrollable-area`, `min-h-dvh max-h-dvh overflow-y-auto`) — the window itself never scrolls, and
dock/header/scroll-top behaviors key off that scrollport. Home sections sit in a `max-w-3xl`
(48rem) shell with `px-4 sm:px-6 lg:px-8`; each `Section` adds corner registration marks and vertical
side rules (`bg-foreground/10`) at `sm+`, and sections are divided by `Separator` — a 2rem dashed
band (`bg-dashed`, 45° stripes) ringed with a hairline. Blog and list pages use a `layout` utility
grid (3-col at sm, 5-col with side rails at xl) that centers content on the small breakpoint.

The dock is fixed bottom-center, auto-hides after ~5s of inactivity, and pages reserve a
`clamp(80px, 10vh, 200px)` bottom spacer so content never collides with it. On mobile (`<lg`) the
dock is replaced by a sticky `FloatingHeader` with a drawer. Fixed mono overlays (time, viewport
size, llms.txt links) occupy the corners at ≥1000px.

### Named Rules

**The Center Column Rule.** All reading lives in one ~48rem column. Side rails exist only at xl and
only for instrument metadata — never for competing content.

## Elevation & Depth

Flat by default. Depth is structural, not shadowed: hairline borders, tonal zinc layering, dashed
bands, and corner marks do the separating. Shadows appear only as state signals — popovers float
(`0 6px 24px rgba(0,0,0,0.25)` light / `0 0 24px rgba(0,0,0,0.5)` dark), thumbnails carry a soft
multi-layer slate-blue lift, and the dock's frosted mask implies it hovers above the page.

### Shadow Vocabulary

- **Popover float** (`0 6px 24px rgba(0,0,0,0.25)`): transient overlays only — menus, popovers.
- **Thumbnail lift** (multi-layer slate/blue soft shadow): media thumbnails in lists.
- **Wordmark shine** (radial gradient ladder, not box-shadow): mouse-tracked light on the footer wordmark.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. A shadow that persists without an
interaction state to justify it is a bug.

## Shapes

Two radii, no token scale: **pill** (`rounded-full`) for all controls — buttons, chips, dock, avatar
rings — and **card** (`rounded-xl`, 0.75rem) for content containers. Borders are 1px hairlines in
`--border` (softer `--edge` for full-bleed rules). The recurring silhouettes: the circular avatar,
the pill dock, the half-cropped footer wordmark, and the L-shaped corner marks framing every section.

## Components

### Buttons

- **Shape:** always a pill (9999px radius).
- **Primary:** zinc gradient fill (zinc-700 → zinc-800 light; zinc-600 → zinc-700 dark), white text
  with a subtle text shadow, compact padding (8px 16px). Hover _lightens_ the gradient end
  (→ zinc-700 light; → zinc-600 dark); a dark-mode-only inset shine gives it a machined feel.
- **Secondary/Ghost:** Graphite Whisper fill or bare text; ScrollTop is a circular secondary pill
  that appears past a 400px scroll threshold, with opacity keyed to scroll direction.
- **Feedback:** the generic Button compresses on press (`active:scale-[0.98]`); the ±10px y-bounce
  (0.1s tween) belongs to dock icons only. Optional click sound via the sound system.

### Chips

- **Style:** transparent fill, 1px Hairline border, pill shape, 0.75rem label type (2px 8px padding).
- **Use:** categories, tags, read-times. Never filled with chroma.

### Cards / Containers

- **Corner Style:** gently rounded (0.75rem).
- **Background:** Paper White light / Slate Card dark.
- **Border:** 1px Hairline; dashed variants for placeholder/empty states.
- **Shadow Strategy:** flat (see The Flat-By-Default Rule); project cards stack with 2px accent
  borders and rounded ends instead of shadows.
- **Internal Padding:** 1rem baseline, scaling with section rhythm.

### Navigation (the signature)

- **Bottom dock:** frosted pill, fixed bottom-center, icons magnify 40→80→40 by cursor distance
  (spring: mass 0.1, stiffness 150, damping 12), tooltips above icons, active-route dots, sound
  feedback, idle auto-hide (intended — the template's timer never arms, so this is dead code the
  clone must implement properly). Contains nav, socials, theme toggle, sound toggle.
- **Mobile:** sticky FloatingHeader + Vaul drawer (~4/5 height) with profile and links.
- **Theme toggle:** animated sun↔moon SVG morph (staggered paths, spring morph) wrapped in a
  View Transitions clip-path wipe (0.8s custom `linear()` easing).

### TOC (article pages)

- Left-rail list of section links, active item highlighted with the accent treatment; plain,
  hairline-free, mono-adjacent typography. "All posts" back link above.

### Wordmark Footer (signature)

- Oversized brand wordmark rendered as SVG text (240px, weight 700), clipped by its own viewBox so
  roughly 70% of each glyph shows, with a soft bottom fade mask. Mouse-tracked radial shine
  (rAF-lerped gradient center), spring entrance on scroll-into-view (stiffness 260, damping 28).
  Set in the system UI stack, not X.

### Inputs / Fields

- **Style:** 1px Hairline stroke, transparent or Paper fill, card-radius.
- **Focus:** Fog Gray ring; no glow, no chroma shift.

## Do's and Don'ts

### Do:

- **Do** stay on the zinc axis; express emphasis through ink weight, not hue.
- **Do** frame reading content with the Section corner marks and dashed separators — that chrome is the identity.
- **Do** use JetBrains Mono, uppercase, and tracking for in-content labels and readouts (dates,
  read-times, job titles); fixed screen-corner overlays stay in X at extra-small.
- **Do** give interactions physics: springs over linear tweens, press feedback, reveal-on-load (0.5s, ease `[0.25, 0.4, 0.25, 1]`, 20px offset).
- **Do** keep dark mode as a true twin — every zinc token has its dark counterpart mapped.

### Don't:

- **Don't** introduce a brand accent color; the template's orange/blue project-card hues are content
  thumbnails, not UI chrome — UI chroma stays functional only.
- **Don't** add persistent shadows or gradients to surfaces; flat at rest, shadow only as state signal.
- **Don't** set body prose in JetBrains Mono (dossier-style `ProseMono` excepted) or in-content
  readouts in X (the corner overlays are the one sanctioned exception).
- **Don't** scroll the window; the scrollport pattern is load-bearing for dock, header, and scroll-top.
- **Don't** ship purple gradients, glassmorphism, or editorial serif/cream styling — those are the
  confirmed anti-references for this world.
