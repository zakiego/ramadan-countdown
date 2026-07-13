# 003 - Remove the layout jump when the skeleton swaps to the live card

- **Status**: TODO
- **Commit**: 27f5a54
- **Severity**: MEDIUM
- **Category**: Missed opportunities / jarring state change (plus CLS)
- **Estimated scope**: 3 files (`CountdownSkeleton.tsx`, `Countdown.tsx`, `EidCountdown.tsx`), ~6 line edits

## Problem

The prerendered HTML ships the skeleton; after hydration the live card replaces it. Two seams make the swap jarring:

1. The skeleton's date-pill placeholder is a different size and offset than the real pill, so everything below the card shifts on every page load (visible jump + layout shift that counts toward CLS, which matters for this site's SEO).

```tsx
/* src/components/CountdownSkeleton.tsx:14-16 - current */
      <div className="flex justify-center mt-10">
        <div className="w-64 h-8 bg-emerald-500/10 rounded-full animate-pulse" />
      </div>
```

The real pill it stands in for is `mt-12` with `px-6 py-3` padding around `text-base md:text-lg` text (roughly 50px tall on mobile, 54px on desktop), inside `src/components/Countdown.tsx:37-57` and `src/components/EidCountdown.tsx:31-52`.

2. The live card then plays a 20px upward slide entrance on top of the spot where the skeleton just was, so content that was already "there" as a skeleton lurches:

```tsx
/* src/components/Countdown.tsx:25-28 - current (CountdownDisplay wrapper) */
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
```

```tsx
/* src/components/EidCountdown.tsx:19-22 - current (EidCountdownDisplay wrapper) */
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
```

## Target

1. Skeleton placeholder matches the real pill's box:

```tsx
/* target: src/components/CountdownSkeleton.tsx */
      <div className="flex justify-center mt-12">
        <div className="w-72 h-[50px] md:h-[54px] bg-emerald-500/10 rounded-full animate-pulse" />
      </div>
```

2. The two countdown-card wrappers crossfade in place instead of sliding, since the skeleton already established their position (do NOT change the during-Ramadan, Lailatul Qadr, or Eid displays; those replace a countdown that has been on screen, not a skeleton, and their movement is fine):

```tsx
/* target: wrapper in CountdownDisplay (Countdown.tsx) and EidCountdownDisplay (EidCountdown.tsx) */
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
```

## Repo conventions to follow

- Tailwind arbitrary values are already used in the codebase (e.g. `text-[10px]` in `SiteFooter.tsx`, `blur-[120px]` in `index.tsx`), so `h-[50px]` fits.
- Motion props inline on `motion.div`, biome formatting.

## Steps

1. In `src/components/CountdownSkeleton.tsx`, change the pill placeholder wrapper from `mt-10` to `mt-12` and the placeholder div classes from `w-64 h-8` to `w-72 h-[50px] md:h-[54px]`.
2. In `src/components/Countdown.tsx`, in `CountdownDisplay` only, change the outer `motion.div` to `initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, ease: "easeOut" }}`.
3. In `src/components/EidCountdown.tsx`, in `EidCountdownDisplay` only, make the identical wrapper change.

## Boundaries

- Do NOT touch `RamadanDisplay`, `LailatulQadrDisplay`, `EidDisplay`, or `EidCelebrationDisplay`.
- Do NOT change the inner pill `motion.div` (its delay is handled by plan 005).
- Do NOT change the grid or `NumberBox` sizing; the number rows already match the skeleton (`h-16 md:h-20`).
- If the excerpts do not match, STOP and report.

## Verification

- **Mechanical**: `pnpm exec biome check .` clean; `pnpm test` passes; `pnpm run build` succeeds.
- **Feel check**: `pnpm run build && pnpm preview`, open `/` with DevTools > Performance > "CPU 6x slowdown" to stretch the skeleton phase:
  - When digits appear, nothing below the card (answer sentence, FAQ heading) moves vertically.
  - The card content fades in over the skeleton's footprint; no 20px lurch.
  - Run a Lighthouse pass on `/`: CLS should be 0.00 for the swap.
- **Done when**: skeleton and live card occupy identical boxes and the swap is a pure crossfade.
