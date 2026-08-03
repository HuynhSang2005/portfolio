# Task 8 Report: Drawer UI wrapper + MobileDrawer + FloatingHeader + ScrollTop

**Branch:** `feat/portfolio`  
**Date:** 2026-08-03  
**Status:** DONE_WITH_CONCERNS

## Summary

Implemented P1 Foundation Task 8: `vaul-base` drawer wrapper, `MobileDrawer`, `FloatingHeader`, `ScrollTop`; mounted `ScrollTop` in `Navigation`; `FloatingHeader` hosts `MobileDrawer` on mobile root paths. `FloatingHeader` and `ScrollTop` consume `useScrollDirection` (Task 4). TDD RED → GREEN; format, typecheck, lint, build pass.

## TDD Evidence

### RED

```
Command: bunx vitest run tests/unit/scroll-top.test.tsx tests/unit/floating-header.test.tsx tests/unit/mobile-drawer.test.tsx tests/unit/navigation.test.tsx
Result: FAIL — missing modules; Navigation missing ScrollTop
```

### GREEN

```
Command: bunx vitest run tests/unit/scroll-top.test.tsx tests/unit/floating-header.test.tsx tests/unit/mobile-drawer.test.tsx tests/unit/navigation.test.tsx
Result: PASS — 10 tests (4 files)

Full suite: bun run test:run — 45 passed (14 files)
```

## Checks

```
Command: bun run format; bun run typecheck; bun run lint; bun run build
Result: exit 0 (all pass)
```

## Files Changed

| File                                        | Action                                               |
| ------------------------------------------- | ---------------------------------------------------- |
| `src/components/ui/drawer.tsx`              | Created — shadcn-style wrapper on `vaul-base`        |
| `src/components/layout/mobile-drawer.tsx`   | Created — `MobileDrawer`, `NavigationLink`           |
| `src/components/layout/floating-header.tsx` | Created — sticky mobile header, `useScrollDirection` |
| `src/components/layout/scroll-top.tsx`      | Created — scroll-top button via `useScrollDirection` |
| `src/components/layout/navigation.tsx`      | Modified — mounts `<ScrollTop />`                    |
| `tests/unit/scroll-top.test.tsx`            | Created — 2 tests                                    |
| `tests/unit/floating-header.test.tsx`       | Created — 3 tests                                    |
| `tests/unit/mobile-drawer.test.tsx`         | Created — 3 tests                                    |
| `tests/unit/navigation.test.tsx`            | Modified — ScrollTop assertion                       |
| `tests/setup.ts`                            | Modified — `matchMedia` mock for vaul-base in jsdom  |

## Commit

```
9b4fccf feat(layout): add drawer, mobile nav, floating header, and scroll-top
10 files changed, 590 insertions(+)
```

Not pushed (per instructions).

## Implementation Notes

- `import { Drawer as DrawerPrimitive } from "vaul-base"` matches installed API (`Drawer.Root`, `.Trigger`, etc.).
- `DrawerTrigger` uses child `<Button>` pattern (not `render` prop) — Base UI Trigger + Button composition avoids `nativeButton` warnings.
- Back link in `FloatingHeader` uses `Link` + `buttonVariants` (not `Button render`).
- `FloatingHeader` scrollTitle animation derives `translateY`/`opacity` from `useScrollDirection().scrollTop` via `useMemo` (replaces template inline scroll listener).
- `ScrollTop` uses `useScrollDirection` for `data-visible` and `data-scroll-direction` (replaces template inline listener).
- Vietnamese TSDoc on exported drawer primitives, `MobileDrawer`, `FloatingHeader`, `ScrollTop`.

## Concerns

1. **vaul-base `style.css` not imported** — brief/classes only; drag/scale animations may need `vaul-base/style.css` in globals if visual parity gaps appear in manual QA.
2. **`matchMedia` mock** added to `tests/setup.ts` — required for vaul-base in jsdom; not needed in browser.
3. **MobileDrawer in FloatingHeader** (not `Navigation`) — matches template page-level chrome; `Navigation` only adds `ScrollTop` + desktop dock.
4. Manual QA recommended: drawer drag/close, scroll-top ≥400px, floating-header title reveal on mobile (`bun run dev`).

---

## Review Fix (Task 8 findings)

**Date:** 2026-08-03  
**Status:** DONE

### Changes

1. **DrawerTrigger render prop** — `mobile-drawer.tsx` uses `render={<Button ... />}` on `DrawerTrigger` (single button, no nested button).
2. **vaul-base styles** — `@import "vaul-base/style.css"` added to `globals.css` for drawer animations.
3. **Test** — `mobile-drawer.test.tsx` asserts exactly one `<button>` in closed trigger subtree (mounted + pre-mount cases).

### Checks

```
Command: bun run format; bun run typecheck; bun run lint
Result: exit 0

Command: bunx vitest run tests/unit/mobile-drawer.test.tsx tests/unit/floating-header.test.tsx tests/unit/scroll-top.test.tsx tests/unit/navigation.test.tsx
Result: PASS — 11 tests (4 files)
```

### Commit

```
fix(layout): drawer trigger render prop and vaul-base styles
```

Not pushed (per instructions).
