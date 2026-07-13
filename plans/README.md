# Animation improvement plans

Written by the improve-animations audit at commit 27f5a54 (2026-07-13). Each plan is self-contained; execute with any agent, then flip its Status.

| # | Plan | Severity | Status |
| --- | --- | --- | --- |
| 001 | [Fix the Eid moon entering from scale(0)](001-eid-moon-scale-zero.md) | HIGH | TODO |
| 002 | [Respect prefers-reduced-motion everywhere](002-prefers-reduced-motion.md) | MEDIUM | TODO |
| 003 | [Remove the skeleton-to-card layout jump](003-skeleton-card-swap-seam.md) | MEDIUM | TODO |
| 004 | [Hardware-accelerate the digit roll](004-hardware-accelerate-digit-roll.md) | MEDIUM | TODO |
| 005 | [Tighten entrance choreography, stagger digits, hover timing](005-tighten-entrance-choreography.md) | MEDIUM | TODO |

## Recommended order

001 -> 002 -> 003 -> 004 -> 005.

- 001 and 002 are independent of everything else.
- 003, 004, and 005 all touch the countdown components; run them in that order to keep the plan excerpts matching. 005 explicitly accounts for 004's transition change (it notes what to do if 004 hasn't landed), but the clean path is 004 first.
- After all five, re-run the feel checks on a real phone with CPU throttling; the digit roll (004) is the one most worth checking on hardware.

## Explicitly not planned

- The 1s page fade and 0.8s h1 slide-up stay: this is a serene, once-per-visit landing moment and the slower entrance matches the product's personality.
- The floating background blobs stay (they define the ambience); 002 stops them for reduced-motion users.
- DevDatePicker's `transition-all hover:scale-110` (dev-only surface) was noted but not planned; fix opportunistically as `transition-transform duration-[160ms] ease-out hover:scale-105`.
- Scroll-reveal for the FAQ/dates sections was considered and rejected: those sections are the SEO payload and must stay plainly in the prerendered HTML; any future reveal must be CSS-only progressive enhancement.
