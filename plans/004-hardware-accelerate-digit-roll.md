# 004 - Hardware-accelerate the per-second digit roll

- **Status**: TODO
- **Commit**: 27f5a54
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: 1 file (`src/components/NumberBox.tsx`), ~10 lines

## Problem

The digit roll uses framer-motion's `y` shorthand, which is not hardware-accelerated: it runs on the main thread via requestAnimationFrame. The seconds box re-triggers it every single second, forever, and the audience is heavily low-end mobile (Ramadan traffic from Indonesia and South Asia). During initial load and hydration, when the main thread is busiest, exactly this animation drops frames.

```tsx
/* src/components/NumberBox.tsx:18-29 - current */
        <AnimatePresence mode="popLayout">
          <motion.p
            key={displayValue}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="text-5xl md:text-7xl font-bold text-white tabular-nums tracking-tight drop-shadow-lg"
          >
            {displayValue}
          </motion.p>
        </AnimatePresence>
```

## Target

Animate the full `transform` string (framer-motion hands those to the compositor) with a strong ease-out tween instead of a spring. The tween settles in 350ms, comfortably inside the 1s tick budget, and string transforms cannot use spring physics, so the easing change is required, not optional.

```tsx
/* target: src/components/NumberBox.tsx */
        <AnimatePresence mode="popLayout">
          <motion.p
            key={displayValue}
            initial={{ transform: "translateY(20px)", opacity: 0 }}
            animate={{ transform: "translateY(0px)", opacity: 1 }}
            exit={{ transform: "translateY(-20px)", opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="text-5xl md:text-7xl font-bold text-white tabular-nums tracking-tight drop-shadow-lg"
          >
            {displayValue}
          </motion.p>
        </AnimatePresence>
```

`[0.23, 1, 0.32, 1]` is the strong ease-out curve (cubic-bezier(0.23, 1, 0.32, 1)); built-in easings are too weak for a roll this visible.

## Repo conventions to follow

- Motion props inline; this is the only file that animates digits, so no token extraction is needed yet.
- Keep `mode="popLayout"` and the fixed-height `overflow-hidden` container exactly as they are; they make the exiting digit leave the layout flow.

## Steps

1. In `src/components/NumberBox.tsx`, replace the `initial`, `animate`, `exit`, and `transition` props on the `motion.p` with the Target values above. Touch nothing else.

## Boundaries

- Do NOT change `AnimatePresence` props, the container markup, or class names.
- Do NOT change `Countdown.tsx` or `EidCountdown.tsx`.
- Do NOT add new dependencies.
- If the excerpt does not match, STOP and report.

## Verification

- **Mechanical**: `pnpm exec biome check .` clean; `pnpm test` passes; `pnpm run build` succeeds.
- **Feel check**: `pnpm dev`, watch the seconds box for at least ten ticks:
  - The old digit slides up and out while the new one slides in from below, overlapping briefly; no flicker, no double-render freeze.
  - DevTools > Performance: record 5 seconds on the idle page with "CPU 6x slowdown". The digit updates should produce composite-only work for the transform (layers panel shows the `p` promoted), and no long tasks.
  - The roll should feel crisp but calm; if it reads as abrupt next to the old spring, bump duration to 0.4, never past 0.45.
- **Done when**: digit transitions animate `transform` (not `y`) with the 0.35s strong ease-out and the page stays smooth under 6x CPU throttle.
