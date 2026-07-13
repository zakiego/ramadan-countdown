# 002 - Respect prefers-reduced-motion everywhere

- **Status**: TODO
- **Commit**: 27f5a54
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 2 files (`src/routes/__root.tsx`, `src/styles/app.css`), ~15 lines

## Problem

The app has zero `prefers-reduced-motion` handling while running continuous motion: infinitely floating background blobs, a digit that rolls vertically every single second, and y-translate entrances on every load. For motion-sensitive users this page is actively hostile, and it never stops moving.

```css
/* src/styles/app.css:8-11 - current */
--animate-fade-in: fade-in 1s ease-out forwards;
--animate-slide-up: slide-up 0.8s ease-out forwards;
--animate-float: float 10s ease-in-out infinite;
--animate-float-delayed: float 12s ease-in-out infinite 2s;
```

```tsx
/* src/routes/__root.tsx:31-40 - current */
function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <DevDateProvider>
          {children}
          <DevDatePicker />
        </DevDateProvider>
        <Scripts />
      </body>
    </html>
  );
}
```

(Line numbers for `__root.tsx` may sit slightly lower in the file; match on the JSX shape shown.)

All framer-motion animations (`src/components/NumberBox.tsx`, `src/components/Countdown.tsx`, `src/components/EidCountdown.tsx`) ignore the OS setting too.

## Target

Reduced motion means fewer and gentler animations, not zero. Keep opacity fades, drop movement:

1. Framer-motion side: wrap the app once in `MotionConfig reducedMotion="user"`. Framer then disables transform-based animations (the digit roll, y-slides, scale pops) but keeps opacity transitions for users with the OS setting on.

```tsx
/* target: src/routes/__root.tsx */
import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { MotionConfig } from "framer-motion";

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <MotionConfig reducedMotion="user">
          <DevDateProvider>
            {children}
            <DevDatePicker />
          </DevDateProvider>
        </MotionConfig>
        <Scripts />
      </body>
    </html>
  );
}
```

2. CSS side: append this unlayered block at the very end of `src/styles/app.css` (after the `@theme` block). Unlayered CSS wins over Tailwind's `@layer utilities`, so it overrides the `animate-*` utilities:

```css
@media (prefers-reduced-motion: reduce) {
  /* Keep the opacity fade, drop all movement */
  .animate-slide-up {
    animation: fade-in 0.4s ease-out forwards;
  }
  .animate-float,
  .animate-float-delayed {
    animation: none;
  }
}
```

`animate-fade-in` stays as is (opacity only, aids comprehension). `animate-pulse` (skeleton) stays as is (opacity only).

## Repo conventions to follow

- CSS lives in `src/styles/app.css`; Tailwind v4, tokens under `@theme`, no config file. Plain CSS is fine after the `@theme` block.
- Framer-motion is already a direct dependency (`framer-motion@^12`); `MotionConfig` is a named export from it.
- Import style: named imports, `@/` alias for local modules.

## Steps

1. In `src/routes/__root.tsx`, add `import { MotionConfig } from "framer-motion";` and wrap the existing `DevDateProvider` subtree in `<MotionConfig reducedMotion="user">...</MotionConfig>` exactly as shown in Target.
2. Append the `@media (prefers-reduced-motion: reduce)` block shown in Target to the end of `src/styles/app.css`.

## Boundaries

- Do NOT modify `NumberBox.tsx`, `Countdown.tsx`, or `EidCountdown.tsx`; `MotionConfig` covers them.
- Do NOT remove or rename the existing keyframes or `--animate-*` tokens.
- Do NOT add new dependencies.
- If the `RootDocument` shape differs from the excerpt, STOP and report.

## Verification

- **Mechanical**: `pnpm exec biome check .` clean; `pnpm test` passes; `pnpm run build` succeeds (prerender must not error, since `MotionConfig` renders during SSR).
- **Feel check**: `pnpm dev`, then DevTools > Rendering > "Emulate CSS prefers-reduced-motion: reduce":
  - Background blobs stop floating entirely.
  - The h1 fades in without sliding up.
  - The seconds digit updates by fading (or swapping) in place; it must not roll vertically.
  - With the emulation off, everything animates exactly as before.
- **Done when**: with reduced motion on, no element on `/` or `/eid` changes position over time; opacity feedback remains.
