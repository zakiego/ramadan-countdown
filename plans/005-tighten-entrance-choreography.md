# 005 - Tighten entrance choreography, stagger the digits, fix hover timing

- **Status**: DONE
- **Commit**: 27f5a54
- **Severity**: MEDIUM
- **Category**: Easing & duration / cohesion
- **Estimated scope**: 4 files, ~12 line edits

## Problem

Three timing issues make the pages feel slower than they are:

1. The date pill (the second most important information on the page) waits 500ms and then fades for another 500ms, so the target date lands a full second after the card. The Eid page copies the same values.

```tsx
/* src/components/Countdown.tsx:37-40 - current (CountdownDisplay inner pill) */
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
```

```tsx
/* src/components/EidCountdown.tsx:31-34 - current (EidCountdownDisplay inner pill) */
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
```

2. The four number boxes appear simultaneously. A 50ms cascade (days, hours, minutes, seconds) is the natural stagger for a once-per-visit entrance.

```tsx
/* src/components/NumberBox.tsx:6-13 - current signature */
export const NumberBox = ({
  value,
  label,
}: {
  value: number;
  label: string;
}) => {
```

```tsx
/* src/components/Countdown.tsx:31-36 - current call sites (same shape in EidCountdown.tsx:24-29) */
        <NumberBox value={state.countdown.days} label="Days" />
        <NumberBox value={state.countdown.hours} label="Hours" />
        <NumberBox value={state.countdown.minutes} label="Minutes" />
        <NumberBox value={state.countdown.seconds} label="Seconds" />
```

3. The footer takes 500ms to respond to hover. Hover feedback should be near-instant, and its motion should be gated off coarse pointers (touch devices fire hover on tap).

```tsx
/* src/components/SiteFooter.tsx:13 - current */
    <div className="mt-16 flex flex-col md:flex-row items-center gap-4 md:gap-6 opacity-40 hover:opacity-100 transition-opacity duration-500 text-[10px] tracking-[0.2em] uppercase font-medium text-center">
```

## Target

1. Pill: `transition={{ delay: 0.25, duration: 0.4, ease: "easeOut" }}` (both files). Entering elements get ease-out; the date now lands at ~0.65s instead of 1.0s.

2. Digit stagger: give `NumberBox` an optional entrance delay that applies only to the label-and-first-mount, implemented as a wrapper prop threaded into the existing `motion.p` transition:

```tsx
/* target: src/components/NumberBox.tsx */
export const NumberBox = ({
  value,
  label,
  enterDelay = 0,
}: {
  value: number;
  label: string;
  enterDelay?: number;
}) => {
```

and on the `motion.p`, replace the static transition with one that uses the delay only for the first appearance of the component (subsequent value changes must not inherit it):

```tsx
            transition={{
              duration: 0.35,
              ease: [0.23, 1, 0.32, 1],
              delay: isFirstRender.current ? enterDelay : 0,
            }}
```

where `isFirstRender` is:

```tsx
  const isFirstRender = useRef(true);
  useEffect(() => {
    isFirstRender.current = false;
  }, []);
```

(`useRef`/`useEffect` imported from "react". If plan 004 has not been applied yet and the transition is still the spring, keep the spring config and add only the `delay` key the same way.)

Call sites in `src/components/Countdown.tsx` (CountdownDisplay) and `src/components/EidCountdown.tsx` (EidCountdownDisplay):

```tsx
        <NumberBox value={state.countdown.days} label="Days" enterDelay={0} />
        <NumberBox value={state.countdown.hours} label="Hours" enterDelay={0.05} />
        <NumberBox value={state.countdown.minutes} label="Minutes" enterDelay={0.1} />
        <NumberBox value={state.countdown.seconds} label="Seconds" enterDelay={0.15} />
```

3. Footer: replace `transition-opacity duration-500` with `transition-opacity duration-200`. Keep the dimmed resting state; 200ms with Tailwind's default `ease` is right for a hover color/opacity change. Do not add a hover media query here: the transition is opacity-only (no movement), and the dimmed state still reads on touch.

## Repo conventions to follow

- Motion values inline on `motion.*` props; hooks at the top of the component (see `src/components/Countdown.tsx` `Countdown()` for the existing `useCallback`/`useEffect` pattern).
- Tailwind utility classes for plain CSS transitions (`transition-colors` usage in `SiteFooter.tsx:16`).

## Steps

1. In `src/components/Countdown.tsx` (CountdownDisplay pill) and `src/components/EidCountdown.tsx` (EidCountdownDisplay pill), change `transition={{ delay: 0.5, duration: 0.5 }}` to `transition={{ delay: 0.25, duration: 0.4, ease: "easeOut" }}`.
2. In `src/components/NumberBox.tsx`, add the `enterDelay` prop, the `isFirstRender` ref, and the delay-aware transition exactly as in Target.
3. Update the four `NumberBox` call sites in each of `CountdownDisplay` and `EidCountdownDisplay` with `enterDelay={0}`, `{0.05}`, `{0.1}`, `{0.15}`.
4. In `src/components/SiteFooter.tsx`, change `duration-500` to `duration-200`.

## Boundaries

- Do NOT touch `RamadanDisplay`, `LailatulQadrDisplay`, `EidDisplay`, `EidCelebrationDisplay`, or the CSS keyframes in `app.css`.
- Do NOT change the outer card wrappers (plan 003 owns those).
- Do NOT let `enterDelay` apply to per-second value changes; the seconds box must keep ticking with zero delay after mount.
- If excerpts do not match (allowing for plan 003/004 having landed), STOP and report.

## Verification

- **Mechanical**: `pnpm exec biome check .` clean; `pnpm test` passes; `pnpm run build` succeeds.
- **Feel check**: `pnpm dev`, reload `/` a few times:
  - Digits cascade left to right over ~150ms; it should read as one gesture, not four events.
  - The date pill is readable by ~0.7s after the card appears.
  - After the entrance, watch ten seconds tick: no tick is delayed (the stagger must not re-apply).
  - Hover the footer: it brightens promptly (200ms), and hovering a link still transitions its color.
- **Done when**: entrance settles under ~1s total, digits stagger once, ticks stay instant, hover responds in 200ms.
