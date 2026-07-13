# 001 - Fix the Eid moon entering from scale(0)

- **Status**: TODO
- **Commit**: 27f5a54
- **Severity**: HIGH
- **Category**: Physicality & origin
- **Estimated scope**: 2 files, 2 one-line edits

## Problem

The crescent moon on both Eid celebration displays animates in from `scale: 0`. Nothing in the real world appears from nothing; a scale(0) entrance reads as an object popping out of a singularity. This is the single most emotional moment the product has (Eid morning), so it deserves a correct entrance.

```tsx
/* src/components/Countdown.tsx:196-206 - current (EidDisplay) */
<motion.div
  initial={{ scale: 0, rotate: -10 }}
  animate={{ scale: 1, rotate: 0 }}
  transition={{
    type: "spring",
    stiffness: 200,
    damping: 15,
    delay: 0.2,
  }}
  className="text-6xl md:text-8xl mb-6"
>
```

```tsx
/* src/components/EidCountdown.tsx:70-80 - current (EidCelebrationDisplay) */
<motion.div
  initial={{ scale: 0, rotate: -10 }}
  animate={{ scale: 1, rotate: 0 }}
  transition={{
    type: "spring",
    stiffness: 200,
    damping: 15,
    delay: 0.2,
  }}
  className="text-6xl md:text-8xl mb-6"
>
```

## Target

Start from a visible-but-small state combined with opacity, keeping the existing spring and delay. Exact values:

```tsx
/* target (identical in both files) */
<motion.div
  initial={{ scale: 0.9, opacity: 0, rotate: -10 }}
  animate={{ scale: 1, opacity: 1, rotate: 0 }}
  transition={{
    type: "spring",
    stiffness: 200,
    damping: 15,
    delay: 0.2,
  }}
  className="text-6xl md:text-8xl mb-6"
>
```

## Repo conventions to follow

- Motion props live inline on `motion.*` elements (see `src/components/Countdown.tsx:84-87` for an existing scale entrance that already pairs `scale: 0.9` with `opacity: 0`; imitate that pairing).
- Double quotes, no semicolons inside JSX props, biome formatting.

## Steps

1. In `src/components/Countdown.tsx`, inside `EidDisplay`, change `initial={{ scale: 0, rotate: -10 }}` to `initial={{ scale: 0.9, opacity: 0, rotate: -10 }}` and `animate={{ scale: 1, rotate: 0 }}` to `animate={{ scale: 1, opacity: 1, rotate: 0 }}`.
2. Apply the identical change inside `EidCelebrationDisplay` in `src/components/EidCountdown.tsx`.

## Boundaries

- Do NOT touch any other motion values (spring config, delay, class names).
- Do NOT change the surrounding markup.
- Do NOT add new dependencies.
- If the current code does not match the excerpts above, STOP and report.

## Verification

- **Mechanical**: `pnpm exec biome check .` reports no fixes needed; `pnpm test` passes (25 tests); `pnpm run build` succeeds.
- **Feel check**: run `pnpm dev`, open the Dev Date Picker (bottom-right calendar button), pick the "Eid al-Fitr" preset, and watch the moon on `/` and on `/eid`:
  - The moon should fade in while springing up from 90% size, not erupt from a point.
  - In DevTools > Rendering, enable "Emulate CSS prefers-reduced-motion" and confirm nothing breaks (framer still runs this unless plan 002 is applied; that is expected here).
- **Done when**: both Eid displays enter from scale 0.9 with an opacity fade and the spring pop is preserved.
